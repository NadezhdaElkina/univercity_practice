import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

const App = () => {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={userId ? <Home userId={userId} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={userId ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
