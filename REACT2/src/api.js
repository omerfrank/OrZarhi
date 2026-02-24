// REACT2/src/api.js
const API_BASE = "http://localhost:3000/api";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    // 1. Check if movies are already in local storage
    const cachedMovies = localStorage.getItem("movies");
    if (cachedMovies) {
      return { success: true, data: JSON.parse(cachedMovies) };
    }

    // 2. If not, fetch from the backend
    const res = await fetch(`${API_BASE}/movie`, {
      credentials: "include",
    });
    const data = await res.json();
    
    // 3. Save the result to local storage for future use
    if (data.success) {
      localStorage.setItem("movies", JSON.stringify(data.data));
    }
    return data;
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
    // Invalidate cache so the library refreshes next time
    localStorage.removeItem("movies"); 
    return res.json();
  },
  
  updateMovie: async (id, movieData) => {
    const res = await fetch(`${API_BASE}/movie/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(movieData),
    });
    // Invalidate cache so the library refreshes next time
    localStorage.removeItem("movies"); 
    return res.json();
  },

  deleteMovie: async (id) => {
    const res = await fetch(`${API_BASE}/movie/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    // Invalidate cache so the library refreshes next time
    localStorage.removeItem("movies"); 
    return res.json();
  },

  // Cookie is automatically sent with credentials: "include"
  getMe: async () => {
    const res = await fetch(`${API_BASE}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  // Added getCast for single member fetch
  getCast: async (id) => {
    const res = await fetch(`${API_BASE}/cast/${id}`, {
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

  removeCastFromMovie: async (movieId, castId) => {
    const res = await fetch(`${API_BASE}/movie/${movieId}/cast/${castId}`, {
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
  deleteReview: async (id) => {
    const res = await fetch(`${API_BASE}/review/${id}`, {
      method: "DELETE",
      credentials: "include",
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
  linkCastToMovie: async (movieId, castId, role) => {
    const res = await fetch(`${API_BASE}/movie/${movieId}/cast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ castId, role }),
    });
    return res.json();
  },
};
