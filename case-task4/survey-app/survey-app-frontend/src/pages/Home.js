import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/surveys", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, 
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSurveys(data);
        } else {
          setError("Не удалось загрузить опросы. Попробуйте снова");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching surveys:", err);
        setError("Произошла ошибка при загрузке опросов");
        setLoading(false);
      });
  }, []);

  if (loading) return <Container>Загрузка...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <h2>Доступные опросы</h2>
      <SurveyList>
        {surveys.length > 0 ? (
          surveys.map((survey) => (
            <SurveyCard key={survey.id}>
              <h3>{survey.title}</h3>
              <p>{survey.description}</p>
              <StyledLink to={`/survey/${survey.id}`}>Пройти опрос</StyledLink>
            </SurveyCard>
          ))
        ) : (
          <p>Нет доступных опросов.</p>
        )}
      </SurveyList>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  padding: 20px;
`;

const SurveyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const SurveyCard = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
