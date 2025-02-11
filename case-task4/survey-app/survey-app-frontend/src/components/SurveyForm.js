import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SurveyForm = ({ fetchUserSurveys, editingSurvey, setEditingSurvey }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    if (editingSurvey) {
      setTitle(editingSurvey.title || "");
      setDescription(editingSurvey.description || "");

      fetch(`http://localhost:5000/api/surveys/${editingSurvey.id}`)
        .then((res) => res.json())
        .then((data) => {
          const processedQuestions = data.questions.map((q) => ({
            ...q,
            options: q.options ? (Array.isArray(q.options) ? q.options : q.options.split(",")) : [],
          }));
          setQuestions(processedQuestions);
        })
        .catch((err) => console.error("Error fetching questions:", err));
    }
  }, [editingSurvey]);

  // Add a New Question
  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "text", options: [] }]);
  };

  // Add an Option for Radio or Checkbox Questions
  const addOption = (index) => {
    const updatedQuestions = [...questions];
    if (!Array.isArray(updatedQuestions[index].options)) {
      updatedQuestions[index].options = [];
    }
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  // Update Question Details
  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };


  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

 
  const handleSubmitSurvey = async () => {
    if (!title || !description || questions.length === 0) {
      alert("Пожалуйста, введите название, описание и хотя бы один вопрос!");
      return;
    }

    try {
      let response;
      const surveyData = {
        title,
        description,
        questions: questions.map((q) => ({
          ...q,
          options: q.type === "text" ? [] : q.options.filter((opt) => opt.trim() !== ""),
        })),
      };

      if (editingSurvey) {
        response = await fetch(`http://localhost:5000/api/surveys/${editingSurvey.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(surveyData),
        });
      } else {
        response = await fetch("http://localhost:5000/api/surveys", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(surveyData),
        });
      }

      if (response.ok) {
        setTitle("");
        setDescription("");
        setQuestions([]);
        setEditingSurvey(null);
        fetchUserSurveys();
      }
    } catch (error) {
      console.error("Error saving survey:", error);
    }
  };

  return (
    <Form>
      <Input
        type="text"
        placeholder="Название опроса"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Описание опроса"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {questions.map((q, index) => (
        <QuestionContainer key={index}>
          <Input
            type="text"
            placeholder="Текст вопроса"
            value={q.text}
            onChange={(e) => updateQuestion(index, "text", e.target.value)}
          />
          <Select
            value={q.type}
            onChange={(e) => updateQuestion(index, "type", e.target.value)}
          >
            <option value="text">Текст</option>
            <option value="radio">Добавить вариант</option>
            <option value="checkbox">Добавить выбор</option>
          </Select>

          {(q.type === "radio" || q.type === "checkbox") && (
            <OptionsContainer>
              <Label>Варианты ответов:</Label>
              {q.options.map((option, oIndex) => (
                <OptionInputContainer key={oIndex}>
                  <Input
                    type="text"
                    placeholder={`Вариант ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, oIndex, e.target.value)}
                  />
                </OptionInputContainer>
              ))}
              <AddOptionButton type="button" onClick={() => addOption(index)}>
                Добавить вариант
              </AddOptionButton>
            </OptionsContainer>
          )}
        </QuestionContainer>
      ))}
      <Button type="button" onClick={addQuestion}> Добавить опрос</Button>
      <Button type="button" onClick={handleSubmitSurvey}>
        {editingSurvey ? "Обновить опрос" : "Создать опрос"}
      </Button>
    </Form>
  );
};

export default SurveyForm;


const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const AddOptionButton = styled(Button)`
  background: #28a745;
  &:hover {
    background: #218838;
  }
`;

const QuestionContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
`;

const OptionsContainer = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const OptionInputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 5px;
`;
