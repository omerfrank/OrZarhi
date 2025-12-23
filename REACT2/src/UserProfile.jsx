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
      const users = await fetch("http://localhost:3000/api/user", {
        credentials: "include",
      }).then((r) => r.json());

      if (users.success && users.data.length > 0) {
        setUser(users.data[0]);
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

            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}