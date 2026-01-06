const API_BASE = "http://localhost:3000/api";

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}` 
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

  getUser: async (userId) => {
    const res = await fetch(`${API_BASE}/user/${userId}`, {
      credentials: "include",
    });
    return res.json();
  },
  
  // FIXED: This is the critical endpoint
getMe: async () => {
    const token = localStorage.getItem("token"); // Retrieve token
    
    const res = await fetch(`${API_BASE}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Send token in header
      },
      credentials: "include",
    });
    return res.json();
  },
  
  // Fetch cast for a specific movie
  getCastByMovie: async (movieId) => {
    const res = await fetch(`${API_BASE}/cast/movie/${movieId}`, {
      credentials: "include",
    });
    return res.json();
  },

  

  // Fetch reviews for a specific movie
  getReviewsByMovie: async (movieId) => {
    const res = await fetch(`${API_BASE}/review/movie/${movieId}`, {
      credentials: "include",
    });
    return res.json();
  },
  
  // You also need this for the review form submission
  addReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(reviewData),
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
