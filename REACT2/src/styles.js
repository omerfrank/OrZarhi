const colors = {
  background: "#121212",      // Main page background
  card: "#1A1A1A",            // Card background (slightly lighter)
  cardHover: "#252525",
  textMain: "#FFFFFF",
  textSecondary: "#A5A5A5",
  accent: "#F5C518",          // IMDb Yellow
  accentHover: "#E3B100",
  blueLink: "#5799EF",
  danger: "#FA320A",
  inputBg: "#FFFFFF",
  inputText: "#121212"
};

export const styles = {
  // Global Layout
  baseContainer: {
    minHeight: "100vh",
    width: "100%",
    backgroundColor: colors.background,
    color: colors.textMain,
    padding: "0", // Remove padding to let navbar stretch
    boxSizing: "border-box",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  pageWrapper: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "20px",
    width: "100%",
  },
  
  // Auth Pages
  authWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: colors.background,
  },
  card: {
    width: "100%",
    maxWidth: "350px",
    backgroundColor: colors.card,
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
    border: "1px solid #333",
  },
  
  // Typography
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: colors.textMain,
    textAlign: "center",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: colors.accent, // Yellow title
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #333",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  
  // Forms & Inputs
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: colors.textMain,
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: colors.inputBg,
    color: colors.inputText,
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: colors.inputBg,
    color: colors.inputText,
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
  },
  
  // Buttons
  button: {
    padding: "10px 20px",
    backgroundColor: colors.accent,
    color: "#000000", // Black text on yellow button
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
    marginTop: "10px",
  },
  linkButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: colors.blueLink,
    border: `1px solid ${colors.blueLink}`,
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "transparent",
    color: colors.danger,
    border: `1px solid ${colors.danger}`,
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
  },
  
  // Header & Nav
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121212", // Navbar color
    padding: "15px 0",
    marginBottom: "20px",
    borderBottom: "1px solid #333",
  },
  searchBar: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: colors.card,
    color: colors.textMain,
    fontSize: "16px",
  },

  // Movie Library Grid
  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", // Smaller, denser cards
    gap: "20px",
    width: "100%",
  },
  movieCard: {
    backgroundColor: colors.card,
    borderRadius: "4px", // Sharper corners like IMDb
    overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    border: "1px solid #333",
    height: "100%",
  },
  movieCardWrapper: {
    position: "relative",
  },
  moviePoster: {
    width: "100%",
    aspectRatio: "2/3",
    objectFit: "cover",
  },
  movieInfo: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  movieTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: colors.textMain,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  movieDate: {
    fontSize: "13px",
    color: colors.textSecondary,
    marginBottom: "8px",
  },
  genreContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginBottom: "8px",
  },
  genreBadge: {
    padding: "2px 6px",
    border: "1px solid #555",
    borderRadius: "10px",
    fontSize: "10px",
    color: "#ccc",
    backgroundColor: "transparent",
  },
  movieDescription: {
    fontSize: "12px",
    color: "#999",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: "3",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  
  // Star/Favorite Button (The Bookmark Ribbon)
  starButton: {
    position: "absolute",
    top: "0",
    left: "0", // IMDb typically puts this on left top
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white", 
    border: "none",
    width: "30px",
    height: "40px",
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)", // Ribbon shape
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "5px",
    cursor: "pointer",
    fontSize: "18px",
    zIndex: 10,
    transition: "color 0.2s",
  },

  // Movie Detail Page
  movieHero: {
    display: "flex",
    gap: "30px",
    backgroundColor: colors.card,
    borderRadius: "4px",
    padding: "0",
    marginBottom: "30px",
    border: "1px solid #333",
    overflow: "hidden",
    flexWrap: "wrap",
  },
  movieDetailPoster: {
    width: "250px",
    height: "auto",
    objectFit: "cover",
  },
  movieDetailInfo: {
    flex: 1,
    padding: "20px",
    minWidth: "300px",
  },
  movieDetailTitle: {
    fontSize: "42px",
    fontWeight: "400", // IMDb uses lighter weights for large titles
    margin: "0 0 10px 0",
    color: colors.textMain,
  },
  movieDetailYear: {
    fontSize: "16px",
    color: colors.textSecondary,
    marginBottom: "20px",
  },
  movieDetailDescription: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: colors.textMain,
    marginTop: "20px",
    maxWidth: "800px",
  },
  
  // Rating Block
  ratingDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  },
  ratingNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colors.textMain,
  },
  ratingLabel: {
    fontSize: "14px",
    color: colors.textSecondary,
  },
  ratingCount: {
    fontSize: "12px",
    color: colors.textSecondary,
    textTransform: "uppercase",
  },

  // Cast Grid
  castGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
  },
  castCard: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  castPhoto: {
    width: "120px",
    height: "120px",
    borderRadius: "50%", // Circular cast photos
    objectFit: "cover",
    marginBottom: "10px",
    border: "2px solid #333",
  },
  castName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: colors.textMain,
    margin: 0,
  },
  castRole: {
    fontSize: "12px",
    color: colors.textSecondary,
  },
  
  // Reviews & Utils
  error: {
    color: colors.danger,
    fontSize: "14px",
    textAlign: "center",
    margin: "10px 0",
    backgroundColor: "rgba(250, 50, 10, 0.1)",
    padding: "10px",
    borderRadius: "4px",
  },
  noResults: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: "18px",
    marginTop: "50px",
  },
  loadingText: {
    textAlign: "center",
    color: colors.accent,
    fontSize: "18px",
    marginTop: "100px",
  },
  
  // Profile specific
  profileCard: {
    backgroundColor: colors.card,
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    borderBottom: "1px solid #333",
    paddingBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: colors.accent,
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "15px",
    backgroundColor: "#252525",
    borderRadius: "8px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colors.textMain,
  },
  
  // Related Grid
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
  },
  relatedCard: {
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  relatedPoster: {
    width: "100%",
    borderRadius: "4px",
    aspectRatio: "2/3",
    objectFit: "cover",
  },
  relatedTitle: {
    fontSize: "13px",
    marginTop: "5px",
    color: colors.textMain,
  },
  
  // Reviews List
  reviewCard: {
    backgroundColor: colors.card,
    border: "1px solid #333",
    borderRadius: "4px",
    padding: "15px",
    marginBottom: "15px",
  },
  reviewTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: colors.textMain,
  },
  reviewRating: {
    color: colors.accent,
    fontWeight: "bold",
    fontSize: "18px",
  },
  reviewForm: {
    backgroundColor: colors.card,
    padding: "20px",
    borderRadius: "4px",
    border: "1px solid #333",
    marginBottom: "20px",
  },
  slider: {
    width: "100%",
    accentColor: colors.accent, // Yellow slider
  },
  switchText: {
    textAlign: "center",
    marginTop: "20px",
    color: colors.textSecondary,
  },
  link: {
    color: colors.blueLink,
    cursor: "pointer",
    fontWeight: "600",
  },
  username: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    color: colors.textMain,
  },
  email: {
    fontSize: "16px",
    color: colors.textSecondary,
    margin: 0,
  },
  statLabel: {
    fontSize: "14px",
    color: colors.textSecondary,
    marginTop: "5px",
  }
};