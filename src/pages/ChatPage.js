// src/pages/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, List, ListItem, Paper, Typography, Box } from '@mui/material';
import sendMessageToOpenAI from '../api/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setInput(''); 

      setMessages(prevMessages => [...prevMessages, newMessage]);

      try {
        const botResponse = await sendMessageToOpenAI([...messages, newMessage]);
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('API Error:', error.message);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, something went wrong.", sender: 'bot' }]);
      }
    }
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
    </Box>
  );
};

export default ChatPage;
