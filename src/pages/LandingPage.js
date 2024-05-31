import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Paper, Divider, Container, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = { id: newChatId, messages: [], status: 'active' };
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    savedChats[newChatId] = newChat;
    localStorage.setItem('chats', JSON.stringify(savedChats));
    navigate(`/chat/${newChatId}`);
  };

  const handleDeleteChat = (chatId) => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    delete savedChats[chatId];
    localStorage.setItem('chats', JSON.stringify(savedChats));
    setChats({
      active: Object.values(savedChats).filter(chat => chat.status === 'active'),
      ended: Object.values(savedChats).filter(chat => chat.status === 'ended')
    });
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" className="landing-container">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            ReX Chat
          </Typography>
          <IconButton color="inherit" onClick={handleNewChat}>
            <AddIcon />
          </IconButton>
          <Button color="inherit" onClick={handleGoToDashboard}>
            View Dashboard
          </Button>
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
              <ListItem key={chat.id} button onClick={() => navigate(`/chat/${chat.id}`)}>
                <ChatIcon style={{ marginRight: 16 }} />
                <ListItemText primary={`Chat: ${chat.name || `Started on ${new Date(parseInt(chat.id)).toLocaleString()}`}`} />
                <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}>
                  <DeleteIcon />
                </IconButton>
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
              <ListItem key={chat.id} button onClick={() => navigate(`/chat/${chat.id}`)}>
                <ChatIcon style={{ marginRight: 16 }} />
                <ListItemText primary={`Chat: ${chat.name || `Started on ${new Date(parseInt(chat.id)).toLocaleString()}`}`} />
                <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default LandingPage;
