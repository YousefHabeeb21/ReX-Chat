import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, List, ListItem, Paper, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import sendMessageToOpenAI from '../api/api';

const ChatPage = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const bottomRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setInput('');
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
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
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setOpen(false);
  };

  const handleCancelTerminate = () => {
    setOpen(false);
  };

  return (
    <Box className="chat-container">
      <Typography variant="h4" component="h1" style={{ marginBottom: '20px' }}>
        Chat with AI
      </Typography>
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
      >
        Send
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleTerminate} 
        className="send-button"
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
