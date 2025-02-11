import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

const SurveyResults = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/responses?survey_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 404) {
          return [];
        }
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Survey responses received:", data);
        setResponses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching survey responses:", err);
        setError("Не удалось загрузить ответы");
        setLoading(false);
      });
  }, [id]);

  // функция группировки ответов
  const groupByQuestion = () => {
    const grouped = {};
    responses.forEach((response) => {
      const { question_id, question_text, answer_text } = response;

      if (!grouped[question_id]) {
        grouped[question_id] = {
          question_text,
          answers: {},
        };
      }

      
      if (!grouped[question_id].answers[answer_text]) {
        grouped[question_id].answers[answer_text] = 0;
      }
      grouped[question_id].answers[answer_text]++;
    });

    return grouped;
  };

  if (loading) return <Container>Загрузка...</Container>;
  if (error) return <Container><ErrorText>{error}</ErrorText></Container>;

  const groupedResponses = groupByQuestion();

  return (
    <Container>
      <h2>Результаты опроса</h2>
      {Object.keys(groupedResponses).length > 0 ? (
        Object.entries(groupedResponses).map(([question_id, data]) => {
          const labels = Object.keys(data.answers);
          const values = Object.values(data.answers);
          const totalResponses = values.reduce((acc, val) => acc + val, 0);
          const percentages = values.map((v) => ((v / totalResponses) * 100).toFixed(1));

          return (
            <QuestionResult key={question_id}>
              <h3>{data.question_text}</h3>
              <PieChartContainer>
                <Pie
                  data={{
                    labels: labels.map((label, index) => `${label} (${percentages[index]}%)`),
                    datasets: [
                      {
                        data: values,
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                      },
                    ],
                  }}
                />
              </PieChartContainer>
            </QuestionResult>
          );
        })
      ) : (
        <NoResponsesMessage>На этот опрос пока нет ответов</NoResponsesMessage>
      )}
    </Container>
  );
};

export default SurveyResults;

//  Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const QuestionResult = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const PieChartContainer = styled.div`
  width: 400px;
  height: 400px;
  margin: auto;
`;

const ErrorText = styled.p`
  color: red;
  font-weight: bold;
`;

const NoResponsesMessage = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: gray;
  text-align: center;
`;
