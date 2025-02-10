const express = require("express");
const cors = require("cors");
const { pool, connectDB } = require("./config/db"); 
const authRoutes = require("./routes/auth");
const responseRoutes = require("./routes/responses");
const surveyRoutes = require("./routes/surveys");
const {createSurveyTable} = require("./models/surveyModel");

const app = express();

(async () => {
  await connectDB();
})();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/surveys", surveyRoutes);


app.get("/", (req, res) => {
  res.send("Survey API is running!");
});


app.get("/api/surveys", async (req, res) => {
  try {
    const [surveys] = await pool.execute("SELECT * FROM Surveys");
    
    if (!Array.isArray(surveys)) {
      return res.status(500).json({ error: "Unexpected data format from database." });
    }

    res.json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/surveys", async (req, res) => {
  const { title, description, created_by } = req.body;
  if (!title || !description || !created_by) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO Surveys (title, description, created_by) VALUES (?, ?, ?)",
      [title, description, created_by]
    );
    res.status(201).json({ surveyId: result.insertId });
  } catch (error) {
    console.error("Error creating survey:", error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/responses", async (req, res) => {
  const { survey_id, user_id, answers } = req.body;
  
  if (!survey_id || !user_id || !answers) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [responseResult] = await pool.execute(
      "INSERT INTO Responses (survey_id, user_id) VALUES (?, ?)",
      [survey_id, user_id]
    );
    
    const response_id = responseResult.insertId;

    for (let answer of answers) {
      await pool.execute(
        "INSERT INTO Answers (response_id, question_id, answer_text) VALUES (?, ?, ?)",
        [response_id, answer.question_id, answer.answer_text]
      );
    }

    res.status(201).json({ response_id });
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
