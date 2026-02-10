const API_BASE = "http://localhost:3000/api";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
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
  
  getMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movie/${id}`, {
      credentials: "include",
    });
    return res.json();
  },

  addMovie: async (movieData) => {
    const res = await fetch(`${API_BASE}/movie`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(movieData),
    });
    return res.json();
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movie/${id}`, {
      method: "DELETE",
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
  
  // Cookie is automatically sent with credentials: "include"
  getMe: async () => {
    const res = await fetch(`${API_BASE}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // Browser automatically sends the cookie
    });
    return res.json();
  },
  
  getCastByMovie: async (movieId) => {
    const res = await fetch(`${API_BASE}/cast/movie/${movieId}`, {
      credentials: "include",
    });
    return res.json();
  },
  getAllCast: async () => {
    const res = await fetch(`${API_BASE}/cast`, {
      credentials: "include",
    });
    return res.json();
  },
  addCast: async (castData) => {
    const res = await fetch(`${API_BASE}/cast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(castData),
    });
    return res.json();
  },

  deleteCast: async (id) => {
    const res = await fetch(`${API_BASE}/cast/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },

  getReviewsByMovie: async (movieId) => {
    const res = await fetch(`${API_BASE}/review/movie/${movieId}`, {
      credentials: "include",
    });
    return res.json();
  },
  
  addReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  addFavorite: async (movieId) => {
    const res = await fetch(`${API_BASE}/user/add-favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ movieId }),
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
  linkCastToMovie: async (movieId, castId) => {
    const res = await fetch(`${API_BASE}/movie/${movieId}/cast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ castId }),
    });
    return res.json();
  }
};