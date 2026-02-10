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
  const [currentUser, setCurrentUser] = useState(null);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ title: "", rating: 5, text: "" });
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect

  // Cast Creation Modal State
  const [showCastModal, setShowCastModal] = useState(false);
  const [newCast, setNewCast] = useState({ name: "", bio: "", role: "", photoURL: "", birthDay: "" });

  // Link Actor Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [allCast, setAllCast] = useState([]);
  const [linkSearch, setLinkSearch] = useState("");

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  // Load "All Cast" when the Link Modal is opened
  useEffect(() => {
    if (showLinkModal) {
      loadAllCast();
    }
  }, [showLinkModal]);

  const loadAllCast = async () => {
    try {
      const res = await api.getAllCast();
      if (res.success) {
        setAllCast(res.data);
      }
    } catch (err) {
      console.error("Failed to load all cast", err);
    }
  };

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
        if (allMoviesRes.success) {
          const related = allMoviesRes.data
            .filter(m => m._id !== movieId)
            .filter(m => m.genre.some(g => movieRes.data.genre.includes(g)))
            .slice(0, 4);
          setRelatedMovies(related);
        }
      }

      if (castRes.success) setCast(castRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (userRes.success) {
        setCurrentUser(userRes.data);
        const favIds = new Set(userRes.data.favorites.map(f => f._id || f));
        setIsFavorite(favIds.has(movieId));
        if (userRes.data.role === 'admin') setIsAdmin(true);
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
      if (wasFavorite) await api.removeFavorite(movieId);
      else await api.addFavorite(movieId);
    } catch (err) {
      setIsFavorite(wasFavorite);
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.title.trim()) { alert("Please add a review title"); return; }
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
        // Reload details to get the populated user info for the new review
        loadMovieDetails();
      }
    } catch (err) { console.error("Failed to submit review", err); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const result = await api.deleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter(r => r._id !== reviewId));
      } else {
        alert(result.error || "Failed to delete review");
      }
    } catch (err) {
      console.error("Failed to delete review", err);
      alert("Error deleting review");
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
            const createdCast = res.data;
            const linkRes = await api.linkCastToMovie(movieId, createdCast._id);
            if (linkRes.success) {
                alert("Cast member created and linked!");
                setShowCastModal(false);
                setNewCast({ name: "", bio: "", role: "", photoURL: "", birthDay: "" });
                setCast([...cast, createdCast]);
            } else {
                alert("Cast created, but failed to link: " + (linkRes.error || "Unknown error"));
            }
        } else {
            alert(res.error || "Failed to add cast");
        }
    } catch (err) {
        console.error(err);
        alert("Error adding cast");
    }
  };

  const handleLinkExisting = async (actor) => {
    try {
        const res = await api.linkCastToMovie(movieId, actor._id);
        if (res.success) {
            setCast([...cast, actor]);
            setShowLinkModal(false);
            alert(`${actor.name} added to movie!`);
        } else {
            alert(res.error || "Failed to link actor");
        }
    } catch (err) {
        console.error(err);
        alert("Error linking actor");
    }
  };

  const handleDeleteCast = async (id) => {
    if (!window.confirm("Delete this cast member? This removes them from all movies.")) return;
    try {
        const res = await api.deleteCast(id);
        if (res.success) setCast(cast.filter(c => c._id !== id));
        else alert(res.error || "Failed to delete cast");
    } catch (err) {
        console.error(err);
        alert("Error deleting cast");
    }
  };

  if (loading) return <div style={styles.baseContainer}><p style={styles.loadingText}>Loading movie...</p></div>;
  if (!movie) return <div style={styles.baseContainer}><p style={styles.error}>Movie not found</p></div>;

  // Filter existing actors out of the link gallery
  const availableActors = allCast.filter(
    actor => 
      !cast.some(existing => existing._id === actor._id) &&
      actor.name.toLowerCase().includes(linkSearch.toLowerCase())
  );

  return (
    <div style={styles.baseContainer}>
      <div style={styles.pageWrapper}>
        <div style={styles.header}>
          <button onClick={() => navigate("/movies")} style={styles.linkButton}>← Back to Movies</button>
          <button onClick={() => navigate("/profile")} style={styles.linkButton}>My Profile</button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.movieHero}>
          <img src={movie.posterURL} alt={movie.title} style={styles.movieDetailPoster} onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=No+Image"; }} />
          <div style={styles.movieDetailInfo}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <h1 style={styles.movieDetailTitle}>{movie.title}</h1>
              <button style={{...styles.starButton, position: "static"}} onClick={toggleFavorite}>{isFavorite ? "★" : "☆"}</button>
            </div>
            <p style={styles.movieDetailYear}>{new Date(movie.releaseDate).getFullYear()}</p>
            <div style={styles.genreContainer}>
              {movie.genre.map((g, idx) => (<span key={idx} style={styles.genreBadge}>{g}</span>))}
            </div>
            <p style={styles.movieDetailDescription}>{movie.description}</p>
            {reviews.length > 0 && (
              <div style={styles.ratingDisplay}>
                <span style={styles.ratingNumber}>{(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}</span>
                <span style={styles.ratingLabel}>/ 10</span>
                <span style={styles.ratingCount}>({reviews.length} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        <div style={styles.section}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <h2 style={styles.sectionTitle}>Cast</h2>
                {isAdmin && (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setShowLinkModal(true)} style={{...styles.linkButton, background: "#e9ecef", color: "#333"}}>
                            🔗 Link Existing Actor
                        </button>
                        <button onClick={() => setShowCastModal(true)} style={styles.linkButton}>
                            + Create New Actor
                        </button>
                    </div>
                )}
            </div>
            
            {cast.length > 0 ? (
                <div style={styles.castGrid}>
                {cast.map((member) => (
                    <div key={member._id} style={{...styles.castCard, position: "relative"}}>
                        {isAdmin && (
                            <button onClick={() => handleDeleteCast(member._id)} style={{ position: "absolute", top: 0, right: 0, background: styles.danger, color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✕</button>
                        )}
                        <img src={member.photoURL} alt={member.name} style={styles.castPhoto} onError={(e) => { e.target.src = "https://via.placeholder.com/200x250?text=No+Photo"; }} />
                        <div style={styles.castInfo}>
                            <h3 style={styles.castName}>{member.name}</h3>
                            <p style={styles.castRole}>{member.role}</p>
                        </div>
                    </div>
                ))}
                </div>
            ) : (<p style={{color: styles.textSecondary}}>No cast info available.</p>)}
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Related Movies</h2>
            <div style={styles.relatedGrid}>
              {relatedMovies.map((related) => (
                <div key={related._id} style={styles.relatedCard} onClick={() => { window.location.hash = `/movie/${related._id}`; window.location.reload(); }}>
                  <img src={related.posterURL} alt={related.title} style={styles.relatedPoster} onError={(e) => { e.target.src = "https://via.placeholder.com/200x300?text=No+Image"; }} />
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
            {!showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} style={styles.linkButton}>+ Write Review</button>
            )}
          </div>
          
          {showReviewForm && (
            <div style={styles.reviewForm}>
              <div>
                <label style={styles.formLabel}>Review Title</label>
                <input 
                  type="text" 
                  placeholder="Headline for your review" 
                  value={reviewForm.title} 
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})} 
                  style={{...styles.input, width: "100%", boxSizing: "border-box"}} 
                />
              </div>
              
              <div>
                <label style={styles.formLabel}>Your Rating: <span style={{color: styles.accentColor}}>{reviewForm.rating}/10</span></label>
                <div style={styles.starContainer} onMouseLeave={() => setHoverRating(0)}>
                  {[...Array(10)].map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <span 
                        key={i} 
                        style={{
                          ...styles.starIcon, 
                          color: ratingValue <= (hoverRating || reviewForm.rating) ? styles.accentColor : "#444"
                        }}
                        onClick={() => setReviewForm({...reviewForm, rating: ratingValue})}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        title={`${ratingValue}/10`}
                      >
                        ★
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={styles.formLabel}>Review</label>
                <textarea 
                  placeholder="Write your review here..." 
                  value={reviewForm.text} 
                  onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})} 
                  style={{...styles.textarea, width: "100%", boxSizing: "border-box"}} 
                  rows="5" 
                />
              </div>

              <div style={styles.formActions}>
                <button 
                  onClick={() => setShowReviewForm(false)} 
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitReview} 
                  style={styles.submitButton}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          <div style={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%"}}>
                    <div>
                        <h3 style={styles.reviewTitle}>{review.title}</h3>
                        <p style={styles.reviewAuthor}>by {review.userID?.username || "Anonymous"}</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px"}}>
                        <div style={styles.reviewRating}>{review.rating}/10</div>
                        {currentUser && review.userID && (review.userID._id === currentUser._id || isAdmin) && (
                            <button 
                                onClick={() => handleDeleteReview(review._id)}
                                style={{
                                    fontSize: "12px", 
                                    color: styles.danger, 
                                    background: "none", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    textDecoration: "underline"
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                  </div>
                </div>
                {review.text && <p style={styles.reviewText}>{review.text}</p>}
                <p style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          {reviews.length === 0 && !showReviewForm && (<p style={styles.noResults}>No reviews yet. Be the first to review!</p>)}
        </div>

        {/* Create Cast Modal */}
        {showCastModal && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                <div style={{...styles.card, maxWidth: "500px", position: "relative", width: "90%"}}>
                    <h2 style={styles.title}>Create New Actor</h2>
                    <div style={styles.form}>
                        <input style={styles.input} placeholder="Name" value={newCast.name} onChange={e => setNewCast({...newCast, name: e.target.value})} />
                        <input style={styles.input} placeholder="Role (e.g. Neo)" value={newCast.role} onChange={e => setNewCast({...newCast, role: e.target.value})} />
                         <input style={styles.input} type="date" placeholder="Birthday" value={newCast.birthDay} onChange={e => setNewCast({...newCast, birthDay: e.target.value})} />
                        <input style={styles.input} placeholder="Photo URL" value={newCast.photoURL} onChange={e => setNewCast({...newCast, photoURL: e.target.value})} />
                        <textarea style={styles.textarea} placeholder="Bio" value={newCast.bio} onChange={e => setNewCast({...newCast, bio: e.target.value})} />
                        <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                            <button onClick={handleAddCast} style={{...styles.button, flex: 1}}>Create & Link</button>
                            <button onClick={() => setShowCastModal(false)} style={{...styles.linkButton, flex: 1, borderColor: styles.textSecondary, color: styles.textSecondary}}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Link Existing Actor Modal */}
        {showLinkModal && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
                <div style={{...styles.card, maxWidth: "600px", width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{...styles.title, margin: 0}}>Link Actor to Movie</h2>
                        <button onClick={() => setShowLinkModal(false)} style={{background: "none", border: "none", fontSize: "20px", cursor: "pointer"}}>✕</button>
                    </div>
                    
                    <input 
                        style={{...styles.input, marginBottom: "20px"}} 
                        placeholder="Search actors..." 
                        value={linkSearch}
                        onChange={(e) => setLinkSearch(e.target.value)}
                        autoFocus
                    />

                    <div style={{ overflowY: "auto", flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "15px" }}>
                        {availableActors.map(actor => (
                            <div 
                                key={actor._id} 
                                onClick={() => handleLinkExisting(actor)}
                                style={{ 
                                    border: "1px solid #ddd", 
                                    borderRadius: "8px", 
                                    padding: "10px", 
                                    cursor: "pointer", 
                                    textAlign: "center",
                                    transition: "transform 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <img 
                                    src={actor.photoURL} 
                                    alt={actor.name} 
                                    style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }}
                                    onError={(e) => e.target.src = "https://via.placeholder.com/100x120?text=No+Photo"}
                                />
                                <div style={{ fontWeight: "bold", fontSize: "14px" }}>{actor.name}</div>
                                <div style={{ fontSize: "12px", color: "#666" }}>{actor.role}</div>
                            </div>
                        ))}
                        {availableActors.length === 0 && (
                            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#666" }}>
                                No actors found matching "{linkSearch}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}