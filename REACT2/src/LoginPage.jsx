import { useState } from "react";
import { api } from "./api";
import { styles } from "./styles";

export default function LoginPage({ onLogin, navigate }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      let result;
      if (isRegistering) {
        result = await api.register(
          formData.username,
          formData.email,
          formData.password
        );
        if (result.success) {
          localStorage.setItem("token", result.token);
          setIsRegistering(false);
          setError("Registration successful! Please login.");
          setFormData({ username: "", email: "", password: "" });
        }
      } else {
        result = await api.login(formData.email, formData.password);
        if (result.success) {
          localStorage.setItem("token", result.token);
          onLogin();
          navigate("/movies");
        }
      }

      if (!result.success) {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.baseContainer}>
      <div style={styles.authWrapper}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>

          <div style={styles.form}>
            {isRegistering && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                style={styles.input}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button
              onClick={handleSubmit}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Loading..." : isRegistering ? "Register" : "Login"}
            </button>
          </div>

          <p style={styles.switchText}>
            {isRegistering
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              style={styles.link}
            >
              {isRegistering ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}