import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

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
    xp INTEGER DEFAULT 0,
    completedModules TEXT DEFAULT '[]'
  )
`);

const app = express();
app.use(cors());
app.use(express.json());

// Get progress
app.get('/api/progress/:username', (req, res) => {
  const { username } = req.params;
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const row = stmt.get(username);
  
  if (row) {
    res.json({ xp: row.xp, completed: JSON.parse(row.completedModules) });
  } else {
    // Return default for new users
    res.json({ xp: 0, completed: [] });
  }
});

// Save progress
app.post('/api/progress/:username', (req, res) => {
  const { username } = req.params;
  const { xp, completed } = req.body;
  
  const completedStr = JSON.stringify(completed || []);
  const safeXp = xp || 0;

  const stmt = db.prepare(`
    INSERT INTO users (username, xp, completedModules)
    VALUES (@username, @xp, @completed)
    ON CONFLICT(username) DO UPDATE SET 
      xp = excluded.xp,
      completedModules = excluded.completedModules
  `);

  try {
    stmt.run({ username, xp: safeXp, completed: completedStr });
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
