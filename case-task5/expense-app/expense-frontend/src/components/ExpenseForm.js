import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import "./ExpenseForm.css"; 

const API_URL = "http://localhost:5000";

const ExpenseForm = ({ userId, setExpenses }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);

  const addExpense = async () => {
    if (!title || !amount || !date || !category) return;

    try {
      const response = await axios.post(`${API_URL}/expenses`, {
        title,
        category,
        createdBy: userId,
        createdAt: date,
        amount: isExpense ? -Math.abs(amount) : Math.abs(amount)
      });

      setExpenses(response.data.expenses);
      setTitle("");
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory("");
      setIsExpense(true);
    } catch (error) {
      console.error("Failed to add expense:", error.response?.data || error.message);
    }
  };

  return (
    <div className="expense-form"> 
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
      <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
      <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth />
      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transport">Transport</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Job">Job</MenuItem>
          <MenuItem value="Side-hustle">Side-hustle</MenuItem>
          <MenuItem value="OTHER">OTHER</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel 
        control={<Switch checked={isExpense} onChange={() => setIsExpense(!isExpense)} />} 
        label={isExpense ? "Expense" : "Income"} 
      />
      <Button onClick={addExpense}>Add</Button>
    </div>
  );
};

export default ExpenseForm;
