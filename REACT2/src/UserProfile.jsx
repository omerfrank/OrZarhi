import { useState, useEffect } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function UserProfile({ navigate, onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Use getMe to get the actual logged-in user
      const result = await api.getMe();

      if (result.success) {
        setUser(result.data);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    onLogout();
    navigate("/");
  };

  if (loading) {
    return (
      <div style={styles.baseContainer}>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={styles.baseContainer}>
      <div style={styles.pageWrapper}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>My Profile</h1>
          <button
            onClick={() => navigate("/movies")}
            style={styles.linkButton}
          >
            Browse Movies
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {user && (
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={styles.username}>{user.username}</h2>
                <p style={styles.email}>{user.email}</p>
              </div>
            </div>

            <div style={styles.profileStats}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>
                  {user.favorites?.length || 0}
                </span>
                <span style={styles.statLabel}>Favorites</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
                <span style={styles.statLabel}>Member Since</span>
              </div>
            </div>

            {/* Favorites Section */}
            {user.favorites && user.favorites.length > 0 && (
              <div style={{ marginTop: "30px" }}>
                 <h3 style={{...styles.username, fontSize: "20px", marginBottom: "15px"}}>Favorite Movies</h3>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {user.favorites.map(movie => (
                       <div key={movie._id} style={{ 
                         display: "flex", 
                         gap: "10px", 
                         background: "#f8f9fa", 
                         padding: "10px", 
                         borderRadius: "8px",
                         alignItems: "center"
                       }}>
                          <img 
                            src={movie.posterURL} 
                            alt={movie.title}
                            style={{ width: "50px", height: "75px", objectFit: "cover", borderRadius: "4px" }} 
                            onError={(e) => e.target.src = "https://via.placeholder.com/50x75"}
                          />
                          <div>
                            <div style={{ fontWeight: "bold" }}>{movie.title}</div>
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              {new Date(movie.releaseDate).getFullYear()}
                            </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            <button onClick={handleLogout} style={{...styles.logoutButton, marginTop: "30px"}}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}