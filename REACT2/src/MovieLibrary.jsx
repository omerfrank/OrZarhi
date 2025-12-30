import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function MovieLibrary({ navigate }) {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(new Set()); // Store favorite IDs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
          <button
            onClick={() => navigate("/profile")}
            style={styles.linkButton}
          >
            My Profile
          </button>
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
      </div>
    </div>
  );
}