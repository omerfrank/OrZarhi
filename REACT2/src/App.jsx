// REACT2/src/App.jsx
import { useState } from "react";
import Router from "./Router.jsx";
import LoginPage from "./LoginPage.jsx";
import MovieLibrary from "./MovieLibrary.jsx";
import UserProfile from "./UserProfile.jsx";
import MovieDetail from "./MovieDetail.jsx";
import CastDetail from "./CastDetail.jsx"; //

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

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
            
            {currentPath.startsWith("/movie/") && isAuthenticated && (
              <MovieDetail 
                navigate={navigate} 
                movieId={currentPath.split("/")[2]} 
              />
            )}
            
            {/* Added route for CastDetail */}
            {currentPath.startsWith("/cast/") && isAuthenticated && (
              <CastDetail 
                navigate={navigate} 
                castId={currentPath.split("/")[2]} 
              />
            )}

            {currentPath === "/profile" && isAuthenticated && (
            <UserProfile
              navigate={navigate}
              onLogout={() => {
                localStorage.removeItem("token"); 
                setIsAuthenticated(false);
              }}
            />
          )}
          </>
        );
      }}
    </Router>
  );
}