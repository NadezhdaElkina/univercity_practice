import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/surveys/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Survey not found or failed to load.");
        }
        return res.json();
      })
      .then((data) => {
        setSurvey(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching survey:", err);
        setError("Failed to load survey.");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (questionId, value, type) => {
    setAnswers((prev) => {
      if (type === "checkbox") {
        const prevAnswers = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: prevAnswers.includes(value)
            ? prevAnswers.filter((v) => v !== value) 
            : [...prevAnswers, value], 
        };
      }
      return { ...prev, [questionId]: value }; 
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    const formattedAnswers = Object.entries(answers).map(([question_id, answer_text]) => ({
      question_id: parseInt(question_id, 10), 
      answer_text: Array.isArray(answer_text) ? answer_text.join(", ") : answer_text || "", 
    }));
  
    const requestBody = {
      survey_id: parseInt(id, 10), 
      answers: formattedAnswers,
    };
  
    console.log("Submitting survey with data:", requestBody); 
  
    try {
      const response = await fetch("http://localhost:5000/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert("Survey submitted successfully!");
        navigate("/");
      } else {
        const errorData = await response.json(); 
        console.error("Error submitting survey:", errorData);
        setError(errorData.error || "Failed to submit survey.");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      setError("Error submitting the survey.");
    }
  };
  
  

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <h3>Questions</h3>
      <Form onSubmit={handleSubmit}>
        {survey.questions.map((q) => (
          <QuestionCard key={q.id}>
            <p>{q.question_text}</p>
            {q.type === "text" && (
              <Input
                type="text"
                onChange={(e) => handleChange(q.id, e.target.value, q.type)}
              />
            )}
            {q.type === "radio" &&
              q.options.split(",").map((option, index) => (
                <Label key={index}>
                  <input
                    type="radio"
                    name={`question_${q.id}`}
                    value={option.trim()}
                    onChange={(e) => handleChange(q.id, e.target.value, q.type)}
                  />
                  {option.trim()}
                </Label>
              ))}
            {q.type === "checkbox" &&
              q.options.split(",").map((option, index) => (
                <Label key={index}>
                  <input
                    type="checkbox"
                    value={option.trim()}
                    onChange={(e) => handleChange(q.id, option.trim(), q.type)}
                  />
                  {option.trim()}
                </Label>
              ))}
          </QuestionCard>
        ))}
        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>
    </Container>
  );
};

export default SurveyDetail;


const Container = styled.div`
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const QuestionCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
  width:200px;
  
`;
