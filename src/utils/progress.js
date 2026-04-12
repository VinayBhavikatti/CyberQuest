const SESSION_KEY = "cq_session_user";
const TOKEN_KEY = "cq_session_token";
const API_URL = "http://localhost:3001/api/progress";
const AUTH_URL = "http://localhost:3001/api/auth";

export function loadSession() {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function loadToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function saveSession(profile) {
  try { 
    if (profile) sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function saveToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
}

function authHeaders() {
  const token = loadToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser({ username, email, password, avatar }) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, avatar }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "Registration failed");
  }

  saveToken(body.token);
  saveSession(body.user);
  return body.user;
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || "Login failed");
  }

  saveToken(body.token);
  saveSession(body.user);
  return body.user;
}

export async function logoutUser() {
  const token = loadToken();

  try {
    if (token) {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (e) {
    console.error("API error", e);
  } finally {
    saveToken(null);
    saveSession(null);
  }
}

export async function saveProgress(data) {
  try {
    if (!data.user?.name) return;
    await fetch(`${API_URL}/${data.user.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ xp: data.xp, completed: data.completed })
    });
  } catch (e) { console.error("API error", e); }
}

export async function loadProgress(username) {
  if (!username) return { xp: 0, completed: [] };
  try {
    const res = await fetch(`${API_URL}/${username}`, {
      headers: authHeaders(),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error("API error", e);
  }
  return { xp: 0, completed: [] };
}
