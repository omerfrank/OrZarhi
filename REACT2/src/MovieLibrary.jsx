import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function MovieLibrary({ navigate }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const result = await api.getMovies();
      if (result.success) {
        setMovies(result.data);
      } else {
        setError("Failed to load movies");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
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
            <div key={movie._id} style={styles.movieCard}>
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