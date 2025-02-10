const express = require("express");
const { pool } = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const { survey_id } = req.query;

  if (!survey_id) {
    return res.status(400).json({ error: "Survey ID is required" });
  }

  try {
    const [responses] = await pool.execute(
      `SELECT r.id AS response_id, r.survey_id, r.user_id, 
              a.question_id, q.question_text, a.answer_text
       FROM Responses r
       JOIN Answers a ON r.id = a.response_id
       JOIN Questions q ON a.question_id = q.id
       WHERE r.survey_id = ?`,
      [survey_id]
    );

    if (!responses.length) {
      return res.status(404).json({ error: "No responses found for this survey" });
    }

    res.json(responses);
  } catch (error) {
    console.error("❌ Error fetching survey responses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const { survey_id, answers } = req.body;
  const user_id = req.user.id;

  if (!survey_id || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  try {
    const [responseResult] = await pool.execute(
      "INSERT INTO Responses (survey_id, user_id) VALUES (?, ?)",
      [survey_id, user_id]
    );

    const response_id = responseResult.insertId;
    for (const answer of answers) {
      if (!answer.question_id || typeof answer.answer_text !== "string") {
        return res.status(400).json({ error: "Invalid answer format" });
      }
      await pool.execute(
        "INSERT INTO Answers (response_id, question_id, answer_text) VALUES (?, ?, ?)",
        [response_id, answer.question_id, answer.answer_text]
      );
    }

    res.status(201).json({ message: "Survey response submitted successfully" });

  } catch (error) {
    console.error("❌ Error saving survey response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
