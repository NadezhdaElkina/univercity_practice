import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import SurveyForm from "../components/SurveyForm";
import SurveyList from "../components/SurveyList";


const Profile = () => {
  const [surveys, setSurveys] = useState([]);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const token = localStorage.getItem("token");


  const fetchUserSurveys = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/surveys/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setSurveys(data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUserSurveys();
  }, [fetchUserSurveys]);

  return (
    <Container>
      <h2>My Surveys</h2>
      <SurveyForm 
        fetchUserSurveys={fetchUserSurveys} 
        editingSurvey={editingSurvey} 
        setEditingSurvey={setEditingSurvey} 
      />
      <SurveyList 
        surveys={surveys} 
        fetchUserSurveys={fetchUserSurveys} 
        setEditingSurvey={setEditingSurvey} 
      />
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  padding: 20px;
`;
