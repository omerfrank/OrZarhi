// REACT2/src/CastDetail.jsx
import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function CastDetail({ navigate, castId }) {
  const [cast, setCast] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCastDetails();
  }, [castId]);

  const loadCastDetails = async () => {
    try {
      // Fetch cast details and all movies in parallel
      const [castRes, moviesRes] = await Promise.all([
        api.getCast(castId),
        api.getMovies()
      ]);

      if (castRes.success) {
        setCast(castRes.data);
      } else {
        setError("Cast member not found");
      }

      if (moviesRes.success && castRes.success) {
        // Filter movies where this cast member appears
        // The API returns movies with a 'cast' array of objects (if populated) or IDs.
        // Based on MovieController, getAllMovies populates cast.
        const memberMovies = moviesRes.data.filter(m => 
            m.cast.some(c => (c._id === castId || c === castId))
        );
        setMovies(memberMovies);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.baseContainer}><p style={styles.loadingText}>Loading...</p></div>;
  if (error || !cast) return <div style={styles.baseContainer}><p style={styles.error}>{error || "Not found"}</p></div>;

  return (
    <div style={styles.baseContainer}>
      <div style={styles.pageWrapper}>
        <div style={styles.header}>
            <button onClick={() => navigate("/movies")} style={styles.linkButton}>← Back to Movies</button>
            <button onClick={() => navigate("/profile")} style={styles.linkButton}>My Profile</button>
        </div>

        <div style={styles.movieHero}> {/* Reusing movie hero style for consistency */}
          <img 
            src={cast.photoURL} 
            alt={cast.name} 
            style={styles.movieDetailPoster} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=No+Photo"; }} 
          />
          <div style={styles.movieDetailInfo}>
            <h1 style={styles.movieDetailTitle}>{cast.name}</h1>
            <p style={{...styles.movieDetailYear, color: styles.accentColor}}>
                Born: {new Date(cast.birthDay).toLocaleDateString()}
            </p>
            {/* Displaying 'role' as a known-for tag or just generic info */}
            <div style={styles.genreContainer}>
                <span style={styles.genreBadge}>{cast.role}</span>
            </div>
            <h3 style={{marginTop: "20px", color: styles.textMain}}>Biography</h3>
            <p style={styles.movieDetailDescription}>{cast.bio}</p>
          </div>
        </div>

        {/* Filmography Section */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Appears In ({movies.length})</h2>
            {movies.length > 0 ? (
                <div style={styles.relatedGrid}>
                {movies.map((movie) => (
                    <div key={movie._id} style={styles.relatedCard} onClick={() => navigate(`/movie/${movie._id}`)}>
                    <img 
                        src={movie.posterURL} 
                        alt={movie.title} 
                        style={styles.relatedPoster} 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/200x300?text=No+Image"; }} 
                    />
                    <h4 style={styles.relatedTitle}>{movie.title}</h4>
                    <span style={{fontSize: "12px", color: "#666"}}>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                ))}
                </div>
            ) : (
                <p style={{color: styles.textSecondary}}>No movies found for this actor.</p>
            )}
        </div>

      </div>
    </div>
  );
}