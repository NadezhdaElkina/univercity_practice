import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SurveyDetail from "./components/SurveyDetail";
import Profile from "./pages/Profile";
import SurveyResults from "./components/SurveyResults";
import Navbar from "./components/Navbar";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/survey/:id" element={<SurveyDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/survey/:id/results" element={<SurveyResults />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
