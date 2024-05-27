import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Paper, Divider, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';

const LandingPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState({ active: [], ended: [] });

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    const activeChats = [];
    const endedChats = [];
    for (const [id, chat] of Object.entries(savedChats)) {
      if (chat.status === 'active') {
        activeChats.push({ id, ...chat });
      } else {
        endedChats.push({ id, ...chat });
      }
    }
    setChats({ active: activeChats, ended: endedChats });
  }, []);

  const handleStartNewChat = () => {
    const newChatId = Date.now().toString();
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    savedChats[newChatId] = { messages: [], status: 'active' };
    localStorage.setItem('chats', JSON.stringify(savedChats));
    navigate(`/chat/${newChatId}`);
  };

  const handleViewChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <Container maxWidth="md" className="landing-container">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            ReX Chat
          </Typography>
          <IconButton color="inherit" onClick={handleStartNewChat}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box my={4}>
        <Paper elevation={3} className="chat-section">
          <Typography variant="h5" className="chat-section-title">
            Active Chats
          </Typography>
          <Divider />
          <List className="chat-list">
            {chats.active.map(chat => (
              <ListItem key={chat.id} button onClick={() => handleViewChat(chat.id)}>
                <ChatIcon style={{ marginRight: 16 }} />
                <ListItemText primary={`Chat started on ${new Date(parseInt(chat.id)).toLocaleString()}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Box my={4}>
        <Paper elevation={3} className="chat-section">
          <Typography variant="h5" className="chat-section-title">
            Ended Chats
          </Typography>
          <Divider />
          <List className="chat-list">
            {chats.ended.map(chat => (
              <ListItem key={chat.id} button onClick={() => handleViewChat(chat.id)}>
                <ChatIcon style={{ marginRight: 16 }} />
                <ListItemText primary={`Chat started on ${new Date(parseInt(chat.id)).toLocaleString()}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default LandingPage;
