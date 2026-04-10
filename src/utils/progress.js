const SESSION_KEY = "cq_session_user";
const API_URL = "http://localhost:3001/api/progress";

export function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
}

export function saveSession(profile) {
  try { 
    if (profile) sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export async function saveProgress(data) {
  try {
    if (!data.user?.name) return;
    await fetch(`${API_URL}/${data.user.name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: data.xp, completed: data.completed })
    });
  } catch (e) { console.error("API error", e); }
}

export async function loadProgress(username) {
  if (!username) return { xp: 0, completed: [] };
  try {
    const res = await fetch(`${API_URL}/${username}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error("API error", e);
  }
  return { xp: 0, completed: [] };
}
