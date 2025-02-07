// import { createBrowserRouter } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import MatchList from "./MatchList";
// import MatchDetailsPage from "./MatchDetailsPage";
// import RegisterPage from "./RegisterPage";
// import StartPage from "./StartPage";

// // import ConcertsList from "./ConcertsList.tsx";
// // import ConcertDetailsPage from "./ConcertDetailsPage.tsx";

// export const router = createBrowserRouter([
//   { path: "/login", Component: LoginPage },
//   { path: "/", Component: MatchList },
//   { path: "/matches/:matchId", Component: MatchDetailsPage },
//   { path: "/register", Component: RegisterPage },
//   { path: "/", Component: StartPage },
// ]);
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import MatchList from "./MatchList";
import MatchDetailsPage from "./MatchDetailsPage";
import RegisterPage from "./RegisterPage";
import StartPage from "./StartPage";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth.isAuthenticated ? children : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  { path: "/", Component: StartPage }, // Show StartPage by default
  { path: "/login", Component: LoginPage },
  { path: "/register", Component: RegisterPage },
  {
    path: "/matches",
    Component: () => (
      <ProtectedRoute>
        <MatchList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/matches/:matchId",
    Component: () => (
      <ProtectedRoute>
        <MatchDetailsPage />
      </ProtectedRoute>
    ),
  },
]);
