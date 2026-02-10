import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function MovieDetail({ navigate, movieId }) {
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    rating: 5,
    text: ""
  });

  // Cast Modal State
  const [showCastModal, setShowCastModal] = useState(false);
  const [newCast, setNewCast] = useState({
    name: "",
    bio: "",
    role: "", // Character Name
    photoURL: "",
    birthDay: ""
  });

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      const [movieRes, castRes, reviewsRes, userRes, allMoviesRes] = await Promise.all([
        api.getMovie(movieId),
        api.getCastByMovie(movieId),
        api.getReviewsByMovie(movieId),
        api.getMe(),
        api.getMovies()
      ]);

      if (movieRes.success) {
        setMovie(movieRes.data);
        
        // Find related movies based on shared genres
        if (allMoviesRes.success) {
          const related = allMoviesRes.data
            .filter(m => m._id !== movieId)
            .filter(m => m.genre.some(g => movieRes.data.genre.includes(g)))
            .slice(0, 4);
          setRelatedMovies(related);
        }
      }

      if (castRes.success) {
        setCast(castRes.data);
      }

      if (reviewsRes.success) {
        setReviews(reviewsRes.data);
      }

      if (userRes.success) {
        const favIds = new Set(userRes.data.favorites.map(f => f._id || f));
        setIsFavorite(favIds.has(movieId));
        if (userRes.data.role === 'admin') {
            setIsAdmin(true);
        }
      }

    } catch (err) {
      setError("Failed to load movie details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    const wasFavorite = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      if (wasFavorite) {
        await api.removeFavorite(movieId);
      } else {
        await api.addFavorite(movieId);
      }
    } catch (err) {
      setIsFavorite(wasFavorite);
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.title.trim()) {
      alert("Please add a review title");
      return;
    }

    try {
      const result = await api.addReview({
        movieID: movieId,
        title: reviewForm.title,
        rating: reviewForm.rating,
        text: reviewForm.text
      });

      if (result.success) {
        setReviews([result.data, ...reviews]);
        setReviewForm({ title: "", rating: 5, text: "" });
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const handleAddCast = async () => {
    if (!newCast.name || !newCast.role || !newCast.birthDay) {
        alert("Please fill in required fields (Name, Role, Birthday)");
        return;
    }

    try {
        const res = await api.addCast(newCast);
        if (res.success) {
            // Note: Since the backend doesn't automatically link this new cast member to the current movie
            // we can't display them in the list immediately unless we had an 'addCastToMovie' endpoint.
            // For now, we confirm creation.
            alert("Cast member created! (Note: They may not appear here until linked)");
            setShowCastModal(false);
            setNewCast({ name: "", bio: "", role: "", photoURL: "", birthDay: "" });
        } else {
            alert(res.error || "Failed to add cast");
        }
    } catch (err) {
        console.error(err);
        alert("Error adding cast");
    }
  };

  const handleDeleteCast = async (id) => {
    if (!window.confirm("Delete this cast member? This removes them from all movies.")) return;
    try {
        const res = await api.deleteCast(id);
        if (res.success) {
            setCast(cast.filter(c => c._id !== id));
        } else {
            alert(res.error || "Failed to delete cast");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting cast");
    }
  };

  if (loading) {
    return (
      <div style={styles.baseContainer}>
        <p style={styles.loadingText}>Loading movie...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={styles.baseContainer}>
        <p style={styles.error}>Movie not found</p>
      </div>
    );
  }

  return (
    <div style={styles.baseContainer}>
      <div style={styles.pageWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => navigate("/movies")}
            style={styles.linkButton}
          >
            ← Back to Movies
          </button>
          <button
            onClick={() => navigate("/profile")}
            style={styles.linkButton}
          >
            My Profile
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* Movie Hero Section */}
        <div style={styles.movieHero}>
          <img
            src={movie.posterURL}
            alt={movie.title}
            style={styles.movieDetailPoster}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
            }}
          />
          <div style={styles.movieDetailInfo}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <h1 style={styles.movieDetailTitle}>{movie.title}</h1>
              <button
                style={{...styles.starButton, position: "static"}}
                onClick={toggleFavorite}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </div>
            <p style={styles.movieDetailYear}>
              {new Date(movie.releaseDate).getFullYear()}
            </p>
            <div style={styles.genreContainer}>
              {movie.genre.map((g, idx) => (
                <span key={idx} style={styles.genreBadge}>
                  {g}
                </span>
              ))}
            </div>
            <p style={styles.movieDetailDescription}>{movie.description}</p>
            
            {/* Average Rating */}
            {reviews.length > 0 && (
              <div style={styles.ratingDisplay}>
                <span style={styles.ratingNumber}>
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
                <span style={styles.ratingLabel}>/ 10</span>
                <span style={styles.ratingCount}>({reviews.length} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        <div style={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={styles.sectionTitle}>Cast</h2>
                {isAdmin && (
                    <button onClick={() => setShowCastModal(true)} style={styles.linkButton}>
                        + Add Cast Member
                    </button>
                )}
            </div>
            
            {cast.length > 0 ? (
                <div style={styles.castGrid}>
                {cast.map((member) => (
                    <div key={member._id} style={{...styles.castCard, position: "relative"}}>
                        {isAdmin && (
                            <button 
                                onClick={() => handleDeleteCast(member._id)}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    background: styles.danger,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px"
                                }}
                            >
                                ✕
                            </button>
                        )}
                        <img
                            src={member.photoURL}
                            alt={member.name}
                            style={styles.castPhoto}
                            onError={(e) => {
                            e.target.src = "https://via.placeholder.com/200x250?text=No+Photo";
                            }}
                        />
                        <div style={styles.castInfo}>
                            <h3 style={styles.castName}>{member.name}</h3>
                            <p style={styles.castRole}>{member.role}</p>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p style={{color: styles.textSecondary}}>No cast info available.</p>
            )}
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Related Movies</h2>
            <div style={styles.relatedGrid}>
              {relatedMovies.map((related) => (
                <div
                  key={related._id}
                  style={styles.relatedCard}
                  onClick={() => {
                    window.location.hash = `/movie/${related._id}`;
                    window.location.reload(); // Force reload to load new movie
                  }}
                >
                  <img
                    src={related.posterURL}
                    alt={related.title}
                    style={styles.relatedPoster}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
                    }}
                  />
                  <h4 style={styles.relatedTitle}>{related.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div style={styles.section}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={styles.sectionTitle}>Reviews ({reviews.length})</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={styles.linkButton}
            >
              {showReviewForm ? "Cancel" : "Write Review"}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div style={styles.reviewForm}>
              <input
                type="text"
                placeholder="Review title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                style={styles.input}
              />
              <div style={styles.ratingInput}>
                <label style={styles.label}>Rating: {reviewForm.rating}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  style={styles.slider}
                />
              </div>
              <textarea
                placeholder="Write your review..."
                value={reviewForm.text}
                onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                style={styles.textarea}
                rows="4"
              />
              <button onClick={handleSubmitReview} style={styles.button}>
                Submit Review
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div style={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div>
                    <h3 style={styles.reviewTitle}>{review.title}</h3>
                    <p style={styles.reviewAuthor}>
                      by {review.userID?.username || "Anonymous"}
                    </p>
                  </div>
                  <div style={styles.reviewRating}>{review.rating}/10</div>
                </div>
                {review.text && <p style={styles.reviewText}>{review.text}</p>}
                <p style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {reviews.length === 0 && !showReviewForm && (
            <p style={styles.noResults}>No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Add Cast Modal */}
        {showCastModal && (
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
                    <h2 style={styles.title}>Add New Cast Member</h2>
                    <div style={styles.form}>
                        <input 
                            style={styles.input} 
                            placeholder="Name" 
                            value={newCast.name}
                            onChange={e => setNewCast({...newCast, name: e.target.value})}
                        />
                        <input 
                            style={styles.input} 
                            placeholder="Role (e.g. Neo)" 
                            value={newCast.role}
                            onChange={e => setNewCast({...newCast, role: e.target.value})}
                        />
                         <input 
                            style={styles.input} 
                            type="date"
                            placeholder="Birthday" 
                            value={newCast.birthDay}
                            onChange={e => setNewCast({...newCast, birthDay: e.target.value})}
                        />
                        <input 
                            style={styles.input} 
                            placeholder="Photo URL" 
                            value={newCast.photoURL}
                            onChange={e => setNewCast({...newCast, photoURL: e.target.value})}
                        />
                        <textarea 
                            style={styles.textarea} 
                            placeholder="Bio" 
                            value={newCast.bio}
                            onChange={e => setNewCast({...newCast, bio: e.target.value})}
                        />
                        <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                            <button onClick={handleAddCast} style={{...styles.button, flex: 1}}>Create</button>
                            <button onClick={() => setShowCastModal(false)} style={{...styles.linkButton, flex: 1, borderColor: styles.textSecondary, color: styles.textSecondary}}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}