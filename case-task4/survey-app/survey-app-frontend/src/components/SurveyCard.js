import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const SurveyCard = ({ survey, fetchUserSurveys, setEditingSurvey }) => {
  const handleEdit = () => {
    setEditingSurvey(survey);
  };

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить этот опрос?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/surveys/${survey.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchUserSurveys();
      }
    } catch (error) {
      console.error("Error deleting survey:", error);
    }
  };

  return (
    <Card>
      <h3>{survey.title}</h3>
      <p>{survey.description}</p>
      <ButtonContainer>
        <Button onClick={handleEdit}>Редактировать</Button>
        <DeleteButton onClick={handleDelete}>Удалить</DeleteButton>
        <Link to={`/survey/${survey.id}/results`}>
          <ResultsButton>Посмотреть результаты</ResultsButton>
        </Link>
      </ButtonContainer>
    </Card>
  );
};

export default SurveyCard;

// 🔹 Styled Components
const Card = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
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

const DeleteButton = styled.button`
  background: red;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background: darkred;
  }
`;

const ResultsButton = styled.button`
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #218838;
  }
`;
