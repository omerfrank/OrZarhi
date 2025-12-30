import { useState } from "react";
import Router from "./Router.jsx";
import LoginPage from "./LoginPage.jsx";
import MovieLibrary from "./MovieLibrary.jsx";
import UserProfile from "./UserProfile.jsx";
import MovieDetail from "./MovieDetail.jsx"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {({ currentPath, navigate }) => {
        if (!isAuthenticated && currentPath !== "/") {
          navigate("/");
        }

        return (
          <>
            {currentPath === "/" && (
              <LoginPage
                onLogin={() => setIsAuthenticated(true)}
                navigate={navigate}
              />
            )}

            {currentPath === "/movies" && isAuthenticated && (
              <MovieLibrary navigate={navigate} />
            )}
            
            {currentPath === "/moviePage" && isAuthenticated && (
              <MovieDetail navigate={navigate} />
            )}

            {currentPath === "/profile" && isAuthenticated && (
              <UserProfile
                navigate={navigate}
                onLogout={() => setIsAuthenticated(false)}
              />
            )}
          </>
        );
      }}
    </Router>
  );
}