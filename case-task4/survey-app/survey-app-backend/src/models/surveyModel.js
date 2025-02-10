const { sql } = require("../config/db");

const createSurveyTable = async () => {
  const query = `
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Surveys')
    CREATE TABLE Surveys (
      id INT IDENTITY(1,1) PRIMARY KEY,
      question VARCHAR(255),
      options NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE()
    )
  `;
  await sql.query(query);
};

const createSurvey = async (question, options) => {
  const query = `INSERT INTO Surveys (question, options) OUTPUT INSERTED.* VALUES (@question, @options)`;
  const request = sql.request();
  request.input("question", sql.VarChar, question);
  request.input("options", sql.NVarChar, JSON.stringify(options));
  const result = await request.query(query);
  return result.recordset[0];
};


const getAllSurveys = async () => {
  const query = `SELECT * FROM Surveys`;
  const result = await sql.query(query);
  return result.recordset;
};

module.exports = { createSurveyTable, createSurvey, getAllSurveys };
