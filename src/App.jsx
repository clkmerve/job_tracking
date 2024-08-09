import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/AuthPage/LoginPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import ProfessionPage from "./pages/ProfessionPage.jsx";
import ProjectDetailsPage from "./pages/ProjectDetailsPage.jsx";
import UserProjectsTablePage from "./pages/UserProjectsTablePage.jsx";
import RatePage from "./pages/RatePage.jsx";

//MERVE ÇELİK

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Authentication durumu kontrol edilir
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

function App() {
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     localStorage.removeItem("token");
  //     console.log("Tarayıcı kapatıldı");
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/projects"
          element={<ProtectedRoute element={ProjectPage} />}
        />
        <Route
          path="/projects/:projectId"
          element={<ProtectedRoute element={ProjectDetailsPage} />}
        />
        <Route path="/users" element={<ProtectedRoute element={UserPage} />} />
        <Route
          path="/professions"
          element={<ProtectedRoute element={ProfessionPage} />}
        />
        <Route
          path="/lists"
          element={<ProtectedRoute element={UserProjectsTablePage} />}
        />
        <Route path="/rates" element={<ProtectedRoute element={RatePage} />} />
      </Routes>
    </Router>
  );
}

export default App;
