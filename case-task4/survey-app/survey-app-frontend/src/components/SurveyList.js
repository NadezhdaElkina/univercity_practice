import React from "react";
import styled from "styled-components";
import SurveyCard from "./SurveyCard";

const SurveyList = ({ surveys, fetchUserSurveys, setEditingSurvey }) => {
  return (
    <SurveyListContainer>
      {surveys.length === 0 ? (
        <NoSurveysMessage>No surveys created yet.</NoSurveysMessage>
      ) : (
        surveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} fetchUserSurveys={fetchUserSurveys} setEditingSurvey={setEditingSurvey} />
        ))
      )}
    </SurveyListContainer>
  );
};

export default SurveyList;

const SurveyListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const NoSurveysMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: gray;
  text-align: center;
  width: 100%;
`;
