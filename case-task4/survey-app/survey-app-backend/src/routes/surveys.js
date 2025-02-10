const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");


router.post("/", authenticateToken, async (req, res) => {
  const { title, description, questions } = req.body;
  const created_by = req.user.id;

  if (!title || !description || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [surveyResult] = await connection.execute(
      "INSERT INTO Surveys (title, description, created_by) VALUES (?, ?, ?)",
      [title, description, created_by]
    );

    const survey_id = surveyResult.insertId;

    for (let question of questions) {
      await connection.execute(
        "INSERT INTO Questions (survey_id, question_text, type, options) VALUES (?, ?, ?, ?)",
        [survey_id, question.text, question.type, question.options ? question.options.join(",") : null]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Survey created successfully", survey_id });

  } catch (error) {
    await connection.rollback();
    console.error("❌ Error creating survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    connection.release();
  }
});


router.get("/", async (req, res) => {
  try {
    const [surveys] = await pool.execute("SELECT * FROM Surveys");
    res.json(surveys);
  } catch (error) {
    console.error("❌ Error fetching surveys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`🔍 Fetching surveys for user ID: ${userId}`);

    const [surveys] = await pool.execute(
      "SELECT * FROM Surveys WHERE created_by = ?", 
      [userId]
    );

    res.json(surveys);
  } catch (error) {
    console.error("❌ Error fetching user surveys:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [survey] = await pool.execute(
      "SELECT * FROM Surveys WHERE id = ?", 
      [id]
    );

    if (survey.length === 0) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const [questions] = await pool.execute(
      "SELECT * FROM Questions WHERE survey_id = ?", 
      [id]
    );

    res.json({ ...survey[0], questions });

  } catch (error) {
    console.error("❌ Error fetching survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;
  const userId = req.user.id; 

  if (!title || !description || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const [survey] = await pool.execute(
      "SELECT * FROM Surveys WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    if (survey.length === 0) {
      return res.status(403).json({ error: "You can only edit your own surveys" });
    }

    await pool.execute(
      "UPDATE Surveys SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );

    for (const q of questions) {
      if (!q.text || !q.type) {
        return res.status(400).json({ error: "Invalid question data" });
      }

      const options = Array.isArray(q.options) ? q.options.join(",") : "";
      if (q.id) {

        await pool.execute(
          "UPDATE Questions SET question_text = ?, type = ?, options = ? WHERE id = ? AND survey_id = ?",
          [q.text, q.type, options, q.id, id]
        );
      } else {

        await pool.execute(
          "INSERT INTO Questions (survey_id, question_text, type, options) VALUES (?, ?, ?, ?)",
          [id, q.text, q.type, options]
        );
      }
    }

    res.json({ message: "Survey updated successfully" });

  } catch (error) {
    console.error("❌ Error updating survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [survey] = await pool.execute(
      "SELECT * FROM Surveys WHERE id = ? AND created_by = ?",
      [id, userId]
    );

    if (survey.length === 0) {
      return res.status(403).json({ error: "You can only delete your own surveys" });
    }

    await pool.execute("DELETE FROM Surveys WHERE id = ?", [id]);
    res.json({ message: "Survey deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting survey:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
