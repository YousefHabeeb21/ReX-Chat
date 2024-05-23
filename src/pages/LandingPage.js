// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/chat');
  };

  return (
    <Box className="landing-container">
      <Typography variant="h1" component="h1" className="landing-title">
        Welcome to ReX Chat
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleStartChat}
        className="landing-button"
      >
        Start Chat
      </Button>
    </Box>
  );
};

export default LandingPage;
