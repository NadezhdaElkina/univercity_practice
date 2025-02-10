import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import "./Auth.css"; 

const API_URL = "http://localhost:5000";

const Login = ({ setUserId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      setUserId(response.data.userId);
      setFailedLogin(false);
      navigate("/home");
    } catch (error) {
      setFailedLogin(true);
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="auth-container">
      <Paper elevation={3} className="auth-box">
        <Typography variant="h4" align="center">Login</Typography>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
        {failedLogin && <Typography className="error-text">Invalid username or password</Typography>}
        <Button onClick={login} className="auth-button">Login</Button>
        <Typography align="center">Don't have an account?</Typography>
        <Button onClick={() => navigate("/register")} className="secondary-button">Register</Button>
      </Paper>
    </Container>
  );
};

export default Login;
