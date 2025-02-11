require('dotenv').config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Hara42Kiri42!', // в строку ввести личный пароль от сервера MySQL Server!
    database: 'EXPENSE'
};

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute(
            'SELECT ID FROM USERS WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            res.json({ userId: rows[0].ID });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [result] = await connection.execute(
            'INSERT INTO USERS (username, password) VALUES (?, ?)',
            [username, password]
        );

        res.json({ userId: result.insertId });
    } catch (error) {
        console.error('Database insert error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

app.post('/expenses', async (req, res) => {
    const { title, category, createdBy, createdAt, amount } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.execute(
            'INSERT INTO EXPENSES (title, category, created_by, CREATED_AT, amount) VALUES (?, ?, ?, ?, ?)',
            [title, category, createdBy, createdAt, amount]
        );

        res.json({ message: 'Expense added successfully', expenses: await getUserExpenses(createdBy) });
    } catch (error) {
        console.error('Database insert error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

app.delete('/expenses/:id', async (req, res) => {
    const { userId } = req.body;
    const expenseId = req.params.id;
    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.execute(
            'DELETE FROM EXPENSES WHERE id = ? AND created_by = ?',
            [expenseId, userId]
        );

        res.json({ message: 'Expense deleted successfully', expenses: await getUserExpenses(userId) });
    } catch (error) {
        console.error('Database delete error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});

app.get('/expenses/:userId', async (req, res) => {
    const userId = req.params.userId;
    const connection = await mysql.createConnection(dbConfig);

    try {
        const [rows] = await connection.execute(
            'SELECT * FROM EXPENSES WHERE created_by = ? ORDER BY CREATED_AT DESC',
            [userId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.end();
    }
});


async function getUserExpenses(userId) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute(
            'SELECT * FROM EXPENSES WHERE created_by = ? ORDER BY CREATED_AT DESC',
            [userId]
        );
        return rows;
    } finally {
        await connection.end();
    }
}

const upload = multer({ dest: "uploads/" });

app.post("/import-expenses", upload.single("file"), async (req, res) => {
  const { userId } = req.body;
  const filePath = req.file.path;
  const connection = await mysql.createConnection(dbConfig);

  const insertPromises = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const insertPromise = connection.execute(
        "INSERT INTO EXPENSES (title, amount, CREATED_AT, category, created_by) VALUES (?, ?, ?, ?, ?)",
        [row.title, row.amount, row.date, row.category, userId]
      );
      insertPromises.push(insertPromise);
    })
    .on("end", async () => {
      try {
        await Promise.all(insertPromises);
        const [expenses] = await connection.execute(
          "SELECT * FROM EXPENSES WHERE created_by = ? ORDER BY CREATED_AT DESC",
          [userId]
        );

        res.json({ message: "Expenses imported successfully", expenses });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        await connection.end();
        fs.unlinkSync(filePath);
      }
    })
    .on("error", (error) => {
      console.error("File read error:", error);
      res.status(500).json({ error: "Error processing CSV file" });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
