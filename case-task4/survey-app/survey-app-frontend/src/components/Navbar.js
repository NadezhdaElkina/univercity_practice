import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext"; 
const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <Logo>МнениеПлюс</Logo>
      <NavLinks>
        <StyledLink to="/">Опросы</StyledLink>
        {isAuthenticated && <StyledLink to="/profile">Профиль</StyledLink>}
        {!isAuthenticated ? (
          <>
            <StyledLink to="/login">Войти</StyledLink>
            <StyledLink to="/register">Регистрация</StyledLink>
          </>
        ) : (
          <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;

// Styled Components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #007bff;
  color: white;
`;

const Logo = styled.h1`
  font-size: 1.5em;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
