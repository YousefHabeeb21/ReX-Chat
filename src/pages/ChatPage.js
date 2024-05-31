import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, List, ListItem, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import sendMessageToOpenAI from '../api/api';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    return savedChats[chatId]?.messages || [];
  });

  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [isEnded, setIsEnded] = useState(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    return savedChats[chatId]?.status === 'ended';
  });
  const bottomRef = useRef(null);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    if (savedChats[chatId]) {
      setMessages(savedChats[chatId].messages);
      setIsEnded(savedChats[chatId].status === 'ended');
    }
  }, [chatId]);

  useEffect(() => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    if (!savedChats[chatId]) {
      savedChats[chatId] = { messages, status: isEnded ? 'ended' : 'active', name: '' };
    } else {
      savedChats[chatId].messages = messages;
      savedChats[chatId].status = isEnded ? 'ended' : 'active';
    }
    localStorage.setItem('chats', JSON.stringify(savedChats));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatId, isEnded]);

  const handleSend = async () => {
    if (input.trim() && !isEnded) {
      const newMessage = { text: input, sender: 'user' };
      setInput('');
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Update session name if this is the first message
      const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
      if (savedChats[chatId] && !savedChats[chatId].name) {
        savedChats[chatId].name = input.split(' ').slice(0, 5).join(' '); // Use first few words as session name
        localStorage.setItem('chats', JSON.stringify(savedChats));
      }

      try {
        const botResponse = await sendMessageToOpenAI(updatedMessages);
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('API Error:', error.message);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, something went wrong.", sender: 'bot' }]);
      }
    }
  };

  const handleTerminate = () => {
    setOpen(true);
  };

  const handleConfirmTerminate = () => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    if (savedChats[chatId]) {
      savedChats[chatId].status = 'ended';
      localStorage.setItem('chats', JSON.stringify(savedChats));
      setIsEnded(true);
    }
    setOpen(false);
  };

  const handleCancelTerminate = () => {
    setOpen(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box className="chat-container" p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToHome}
        sx={{ textTransform: 'none', color: 'primary.main', mb: 2 }}
      >
        Back to Home
      </Button>
      <Typography variant="h4" component="h1" mb={2}>Chat with AI</Typography>
      <Paper className="chat-window">
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} className={`message-container ${message.sender}`}>
              <Box className={`message-bubble ${message.sender}`}>
                {message.text}
              </Box>
            </ListItem>
          ))}
          <div ref={bottomRef} />
        </List>
      </Paper>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        variant="outlined"
        placeholder="Type your message..."
        className="chat-input"
        fullWidth
        disabled={isEnded}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend} 
          className="send-button"
          disabled={isEnded}
        >
          Send
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleTerminate} 
          className="send-button"
          disabled={isEnded}
        >
          End Chat
        </Button>
      
      <Dialog open={open} onClose={handleCancelTerminate}>
        <DialogTitle>End Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to end the chat?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTerminate} color="primary">Cancel</Button>
          <Button onClick={handleConfirmTerminate} color="secondary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatPage;
