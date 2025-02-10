const express = require("express");
const { createSurvey, getAllSurveys } = require("../models/surveyModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const surveys = await getAllSurveys();
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving surveys" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options) return res.status(400).json({ message: "Invalid input" });

    const survey = await createSurvey(question, options);
    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: "Error creating survey" });
  }
});

module.exports = router;
