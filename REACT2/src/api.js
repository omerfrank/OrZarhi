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
  
  // FIXED: This is the critical endpoint
  getMe: async () => {
    const res = await fetch(`${API_BASE}/user/me`, {
      credentials: "include",
    });
    return res.json();
  },

  // FIXED: Remove userId from body, use session
  addFavorite: async (movieId) => {
    const res = await fetch(`${API_BASE}/user/add-favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ movieId }), // Removed userId
    });
    return res.json();
  },
  
  removeFavorite: async (movieId) => {
    const res = await fetch(`${API_BASE}/user/remove-favorite`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ movieId }),
    });
    return res.json();
  },
};