import React from "react";
import AppRouter from "./routes/router";
import { AuthProvider } from "./utils/auth.jsx";
import { ThemeProvider } from "./utils/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
