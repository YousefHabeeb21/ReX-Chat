import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ActivityDashboard from './components/ActivityDashboard';  // Import the dashboard component

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/dashboard" element={<ActivityDashboard />} />  // Add a route for the dashboard
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
