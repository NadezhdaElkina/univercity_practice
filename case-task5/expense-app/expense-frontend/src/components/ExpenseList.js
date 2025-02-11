import React from "react";
import { List, ListItem, ListItemText, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000";

const ExpenseList = ({ expenses, setExpenses, userId }) => {
  const removeExpense = async (expenseId) => {
    try {
      const response = await axios.delete(`${API_URL}/expenses/${expenseId}`, {
        data: { userId },
      });
      setExpenses(response.data.expenses);
    } catch (error) {
      console.error("Failed to delete expense:", error.response?.data || error.message);
    }
  };

  if (!expenses.length) {
    return <Typography variant="h6" align="center">Нет записанных расходов</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h6" align="center">Список расходов</Typography>
      <List>
        {expenses.map((exp) => (
          <ListItem key={exp.id} sx={{ borderBottom: "1px solid #ddd" }}>
            <ListItemText 
              primary={`${exp.title} - $${exp.amount} (${exp.category})`} 
              secondary={`Дата: ${new Date(exp.createdAt).toLocaleDateString()}`} 
            />
            <Button variant="contained" color="secondary" onClick={() => removeExpense(exp.id)}>
            Удалить
            </Button>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ExpenseList;
