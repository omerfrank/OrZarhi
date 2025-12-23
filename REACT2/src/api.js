const API_BASE = "http://localhost:3000/api";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  register: async (username, email, password) => {
    const res = await fetch(`${API_BASE}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  getMovies: async () => {
    const res = await fetch(`${API_BASE}/movie`, {
      credentials: "include",
    });
    return res.json();
  },

  getUser: async (userId) => {
    const res = await fetch(`${API_BASE}/user/${userId}`, {
      credentials: "include",
    });
    return res.json();
  },
};