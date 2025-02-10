import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Container } from "@mui/material";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";

const API_URL = "http://localhost:5000";

const Home = ({ userId }) => {
  const [expenses, setExpenses] = useState([]);

  
  const fetchExpenses = useCallback(async () => {
    if (!userId) return; 

    try {
      const response = await axios.get(`${API_URL}/expenses/${userId}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error.response?.data || error.message);
    }
  }, [userId]); 

  
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <Container>
      <h2>Expense Tracker</h2>
      <ExpenseForm userId={userId} setExpenses={setExpenses} />
      <ExpenseChart expenses={expenses} />
      <ExpenseList expenses={expenses} setExpenses={setExpenses} userId={userId} />
    </Container>
  );
};

export default Home;
