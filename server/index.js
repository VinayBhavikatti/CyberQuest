import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure server directory exists
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname);
}

const dbPath = join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    passwordHash TEXT,
    avatar TEXT DEFAULT '🛡️',
    xp INTEGER DEFAULT 0,
    completedModules TEXT DEFAULT '[]'
  )
`);

const userColumns = db.prepare(`PRAGMA table_info(users)`).all();
const existingUserColumns = new Set(userColumns.map((column) => column.name));

if (!existingUserColumns.has('email')) {
  db.exec(`ALTER TABLE users ADD COLUMN email TEXT`);
}

if (!existingUserColumns.has('passwordHash')) {
  db.exec(`ALTER TABLE users ADD COLUMN passwordHash TEXT`);
}

if (!existingUserColumns.has('avatar')) {
  db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT '🛡️'`);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
  )
`);

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL`);

const app = express();
app.use(cors());
app.use(express.json());

const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const iterations = 120000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `${iterations}:${salt}:${hash}`;
}

function verifyPassword(password, storedHash = '') {
  const [iterationText, salt, originalHash] = storedHash.split(':');
  const iterations = Number(iterationText);

  if (!iterations || !salt || !originalHash) {
    return false;
  }

  const computedHash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(computedHash, 'hex'));
}

function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  db.prepare(`
    INSERT INTO sessions (token, username, createdAt, expiresAt)
    VALUES (?, ?, ?, ?)
  `).run(token, username, now.toISOString(), expiresAt.toISOString());

  return { token, expiresAt: expiresAt.toISOString() };
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function sanitizeUser(row) {
  return {
    name: row.username,
    email: row.email,
    avatar: row.avatar || '🛡️',
  };
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const session = db.prepare(`
    SELECT sessions.token, sessions.username, sessions.expiresAt, users.email, users.avatar
    FROM sessions
    JOIN users ON users.username = sessions.username
    WHERE sessions.token = ?
  `).get(token);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  req.auth = {
    token,
    username: session.username,
    email: session.email,
    avatar: session.avatar || '🛡️',
  };

  next();
}

app.post('/api/auth/register', (req, res) => {
  const username = (req.body.username || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = req.body.password || '';
  const avatar = (req.body.avatar || '🛡️').trim() || '🛡️';

  if (!USERNAME_REGEX.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters and use only letters, numbers, or underscores' });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include upper, lower, number, and symbol' });
  }

  const existingUser = db.prepare(`SELECT username FROM users WHERE username = ? OR email = ?`).get(username, email);
  if (existingUser) {
    return res.status(409).json({ error: 'Username or email already exists' });
  }

  const passwordHash = hashPassword(password);

  try {
    db.prepare(`
      INSERT INTO users (username, email, passwordHash, avatar, xp, completedModules)
      VALUES (?, ?, ?, ?, 0, '[]')
    `).run(username, email, passwordHash, avatar);

    const session = createSession(username);
    const user = db.prepare(`SELECT username, email, avatar FROM users WHERE username = ?`).get(username);
    return res.status(201).json({ token: session.token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password || '';

  if (!EMAIL_REGEX.test(email) || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare(`
    SELECT username, email, avatar, passwordHash
    FROM users
    WHERE email = ?
  `).get(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const session = createSession(user.username);
  return res.json({ token: session.token, user: sanitizeUser(user) });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(req.auth.token);
  res.json({ success: true });
});

// Get progress
app.get('/api/progress/:username', requireAuth, (req, res) => {
  const { username } = req.params;
  if (req.auth.username !== username) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const row = stmt.get(username);
  
  if (row) {
    res.json({
      xp: row.xp,
      completed: JSON.parse(row.completedModules),
      user: sanitizeUser(row),
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Save progress
app.post('/api/progress/:username', requireAuth, (req, res) => {
  const { username } = req.params;
  const { xp, completed } = req.body;

  if (req.auth.username !== username) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const completedStr = JSON.stringify(completed || []);
  const safeXp = Number.isFinite(xp) && xp >= 0 ? Math.floor(xp) : 0;

  const stmt = db.prepare(`
    UPDATE users
    SET xp = @xp,
        completedModules = @completed
    WHERE username = @username
  `);

  try {
    const result = stmt.run({ username, xp: safeXp, completed: completedStr });
    if (!result.changes) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend Database server running on http://localhost:${PORT}`);
});
