import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function MovieLibrary({ navigate }) {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(new Set()); // Store favorite IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    posterURL: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch movies and user data in parallel
      const [moviesRes, userRes] = await Promise.all([
        api.getMovies(),
        api.getMe()
      ]);

      if (moviesRes.success) {
        setMovies(moviesRes.data);
      } else {
        setError("Failed to load movies");
      }

      if (userRes.success) {
        // Create a Set of favorite movie IDs for O(1) lookup
        const favIds = new Set(userRes.data.favorites.map(f => f._id || f));
        setFavorites(favIds);
        
        // Check Admin
        if (userRes.data.role === 'admin') {
            setIsAdmin(true);
        }
      }

    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (e, movie) => {
    e.stopPropagation(); // Prevent clicking the card event if any
    const isFav = favorites.has(movie._id);
    
    // Optimistic UI update
    const newFavorites = new Set(favorites);
    if (isFav) {
      newFavorites.delete(movie._id);
    } else {
      newFavorites.add(movie._id);
    }
    setFavorites(newFavorites);

    try {
      if (isFav) {
        await api.removeFavorite(movie._id);
      } else {
        await api.addFavorite(movie._id);
      }
    } catch (err) {
      // Revert on error
      console.error("Failed to update favorite", err);
      setFavorites(favorites);
    }
  };

  const handleDeleteMovie = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
        const res = await api.deleteMovie(id);
        if (res.success) {
            setMovies(movies.filter(m => m._id !== id));
        } else {
            alert(res.error || "Failed to delete movie");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting movie");
    }
  };

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.releaseDate || !newMovie.posterURL) {
        alert("Please fill in required fields");
        return;
    }

    try {
        // Format genre from string to array
        const moviePayload = {
            ...newMovie,
            genre: newMovie.genre.split(",").map(g => g.trim()).filter(g => g),
            cast: [] // Assuming empty cast initially as per current backend constraints
        };

        const res = await api.addMovie(moviePayload);
        if (res.success) {
            setMovies([...movies, res.data]);
            setShowModal(false);
            setNewMovie({ title: "", description: "",ZSgenre: "", releaseDate: "", posterURL: "" });
        } else {
            alert(res.error || "Failed to add movie");
        }
    } catch (err) {
        console.error(err);
        alert("Error adding movie");
    }
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) =>
        g.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div style={styles.baseContainer}>
        <p style={styles.loadingText}>Loading movies...</p>
      </div>
    );
  }

  return (
    <div style={styles.baseContainer}>
      <div style={styles.pageWrapper}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Movie Library</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            {isAdmin && (
                <button 
                    onClick={() => setShowModal(true)} 
                    style={{...styles.button, marginTop: 0}}
                >
                    + Add Movie
                </button>
            )}
            <button
                onClick={() => navigate("/profile")}
                style={styles.linkButton}
            >
                My Profile
            </button>
          </div>
        </div>

        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search movies by title or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.movieGrid}>
          {filteredMovies.map((movie) => (
            <div key={movie._id} style={{...styles.movieCard, ...styles.movieCardWrapper}} onClick={() => navigate(`/movie/${movie._id}`)}>
              <button 
                style={styles.starButton}
                onClick={(e) => toggleFavorite(e, movie)}
              >
                {favorites.has(movie._id) ? "★" : "☆"}
              </button>
              
              {isAdmin && (
                  <button
                    style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: styles.danger,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        zIndex: 10,
                        fontWeight: "bold"
                    }}
                    onClick={(e) => handleDeleteMovie(e, movie._id)}
                  >
                    ✕
                  </button>
              )}

              <img
                src={movie.posterURL}
                alt={movie.title}
                style={styles.moviePoster}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Image";
                }}
              />
              <div style={styles.movieInfo}>
                <h3 style={styles.movieTitle}>{movie.title}</h3>
                <p style={styles.movieDate}>
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
                <div style={styles.genreContainer}>
                  {movie.genre.map((g, idx) => (
                    <span key={idx} style={styles.genreBadge}>
                      {g}
                    </span>
                  ))}
                </div>
                <p style={styles.movieDescription}>
                  {movie.description?.substring(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p style={styles.noResults}>No movies found</p>
        )}

        {/* Add Movie Modal */}
        {showModal && (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
            }}>
                <div style={{...styles.card, maxWidth: "500px", position: "relative"}}>
                    <h2 style={styles.title}>Add New Movie</h2>
                    <div style={styles.form}>
                        <input 
                            style={styles.input} 
                            placeholder="Title" 
                            value={newMovie.title}
                            onChange={e => setNewMovie({...newMovie, title: e.target.value})}
                        />
                        <input 
                            style={styles.input} 
                            placeholder="Poster URL" 
                            value={newMovie.posterURL}
                            onChange={e => setNewMovie({...newMovie, posterURL: e.target.value})}
                        />
                        <input 
                            style={styles.input} 
                            type="date"
                            value={newMovie.releaseDate}
                            onChange={e => setNewMovie({...newMovie, releaseDate: e.target.value})}
                        />
                        <input 
                            style={styles.input} 
                            placeholder="Genres (comma separated)" 
                            value={newMovie.genre}
                            onChange={e => setNewMovie({...newMovie, genre: e.target.value})}
                        />
                        <textarea 
                            style={styles.textarea} 
                            placeholder="Description" 
                            value={newMovie.description}
                            onChange={e => setNewMovie({...newMovie, description: e.target.value})}
                        />
                        <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                            <button onClick={handleAddMovie} style={{...styles.button, flex: 1}}>Add Movie</button>
                            <button onClick={() => setShowModal(false)} style={{...styles.linkButton, flex: 1, borderColor: styles.textSecondary, color: styles.textSecondary}}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}