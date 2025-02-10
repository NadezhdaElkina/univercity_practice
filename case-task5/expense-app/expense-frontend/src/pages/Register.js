import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import "./Auth.css"; 

const API_URL = "http://localhost:5000";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, { username, password });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h4" align="center">Register</Typography>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        <Button onClick={register} className="auth-button">Register</Button>
        <Typography align="center">Already have an account?</Typography>
        <Button onClick={() => navigate("/login")} className="secondary-button">Back to Login</Button>
      </Paper>
    </Container>
  );
};

export default Register;
