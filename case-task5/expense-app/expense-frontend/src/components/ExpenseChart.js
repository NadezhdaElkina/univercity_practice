import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, PointElement, LineElement, Tooltip } from "chart.js";
import { Grid, Paper, Typography } from "@mui/material";
import "./ExpenseChart.css"; // Import external CSS

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, PointElement, LineElement, Tooltip);

const ExpenseChart = ({ expenses }) => {
  if (!expenses.length) {
    return <Typography variant="h6" align="center">No expense data available</Typography>;
  }

  const expenseData = expenses.filter(exp => exp.amount < 0);
  const incomeData = expenses.filter(exp => exp.amount > 0);
  const categories = [...new Set(expenses.map(exp => exp.category))];

  // Fix: Ensure values are numeric (Convert strings to numbers)
  const categoryTotals = categories.map(cat =>
    expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0) 
  );

  console.log("Category Totals (Fixed):", categoryTotals); 

  // Assign colors: Red for expenses (negative), Blue for income (positive)
  const categoryColors = categoryTotals.map(value => (value < 0 ? "rgba(255, 99, 132, 0.7)" : "rgba(54, 162, 235, 0.7)"));

  return (
    <Grid container spacing={3} className="expense-chart-container">
      {/* Bar Chart (Category-wise Total Amount) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="chart-paper">
          <Typography variant="h6" className="chart-title">Category-wise Total Amount</Typography>
          <div className="chart-container">
            <Bar
              data={{
                labels: categories,
                datasets: [
                  {
                    label: "Total Amount",
                    data: categoryTotals,
                    backgroundColor: categoryColors,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true, 
                    ticks: {
                      callback: function (value) {
                        return `$${value}`;
                      }
                    },
                    grid: {
                      color: function (context) {
                        return context.tick.value === 0 ? 'rgba(255, 0, 0, 1)' : 'rgba(0, 0, 0, 0.1)';
                      }
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: $${tooltipItem.raw}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Paper>
      </Grid>

      {/* Line Chart (Expenses Over Time) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="chart-paper">
          <Typography variant="h6" className="chart-title">Expenses Over Time</Typography>
          <div className="chart-container">
            <Line
              data={{
                labels: expenses.map(exp => {
                  const date = new Date(exp.createdAt);
                  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    label: "Expenses Over Time",
                    data: expenses.map(exp => parseFloat(exp.amount)), //  Convert string to number
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: "rgba(255, 99, 132, 0.2)"
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: Math.min(...expenses.map(exp => parseFloat(exp.amount))) - 10, // Fix invalid numbers
                    ticks: {
                      callback: function (value) {
                        return `$${value}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Paper>
      </Grid>

      {/* Pie Chart (Expense Breakdown) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="chart-paper">
          <Typography variant="h6" className="chart-title">Expense Breakdown</Typography>
          <Pie
            data={{
              labels: expenseData.map(exp => exp.category),
              datasets: [
                {
                  data: expenseData.map(exp => Math.abs(parseFloat(exp.amount))), // Convert to absolute numbers
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"]
                }
              ]
            }}
            options={{
              plugins: {
                legend: { position: "bottom" }
              }
            }}
          />
        </Paper>
      </Grid>

      {/* Pie Chart (Income Breakdown) */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} className="chart-paper">
          <Typography variant="h6" className="chart-title">Income Breakdown</Typography>
          <Pie
            data={{
              labels: incomeData.map(exp => exp.category),
              datasets: [
                {
                  data: incomeData.map(exp => parseFloat(exp.amount)), // Convert string to number
                  backgroundColor: ["#4bc0c0", "#ff6384", "#36a2eb", "#ffce56", "#9966ff", "#ff9f40"]
                }
              ]
            }}
            options={{
              plugins: {
                legend: { position: "bottom" }
              }
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ExpenseChart;
