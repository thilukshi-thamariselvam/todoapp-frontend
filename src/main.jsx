import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import App from "./App.jsx";
import theme from './theme';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}> 
      <CssBaseline /> 
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>
);