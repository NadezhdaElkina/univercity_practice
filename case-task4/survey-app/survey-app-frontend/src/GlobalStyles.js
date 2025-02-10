import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }

  body {
    background: #f4f4f4;
    color: #333;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;
