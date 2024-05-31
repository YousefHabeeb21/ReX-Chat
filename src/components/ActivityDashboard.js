import React, { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, TextField, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

// Mock data generation function (if you want to use it)
const generateMockData = () => {
  const sessions = [];
  for (let i = 0; i < 10; i++) {
    const sessionId = `Session ${i + 1}`;
    const messages = Array.from({ length: Math.floor(Math.random() * 20) + 1 }, (_, idx) => ({
      text: `Message ${idx + 1}`,
      sender: idx % 2 === 0 ? 'user' : 'bot',
    }));
    sessions.push({ sessionId, messages, timestamp: Date.now() - i * 60000 });
  }
  return sessions;
};

const fetchData = async () => {
  // Replace with real API call if needed
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockData()), 1000);
  });
};

const ActivityDashboard = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState('messagesPerSession');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataInterval = async () => {
      try {
        const data = await fetchData();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataInterval();
    const intervalId = setInterval(fetchDataInterval, 10000);  // Update data every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const filterDataByDate = (data) => {
    if (!startDate || !endDate) return data;
    return data.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  const getChartData = () => {
    const filteredData = filterDataByDate(data);
    return filteredData.map(session => ({
      name: session.sessionId,
      value: session.messages.length,
    }));
  };

  const getRecentSessions = () => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    return Object.values(savedChats).slice(-10).map(session => ({
      sessionId: session.name || session.sessionId,
      messages: session.messages,
      timestamp: session.timestamp
    }));
  };

  const handleDeleteChat = (sessionId) => {
    const savedChats = JSON.parse(localStorage.getItem('chats')) || {};
    delete savedChats[sessionId];
    localStorage.setItem('chats', JSON.stringify(savedChats));
    setData(Object.values(savedChats));
  };

  return (
    <Box className="dashboard-container" p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Activity Dashboard</Typography>
        <Button variant="contained" onClick={handleBackToHome}>Back to Home</Button>
      </Box>
      <Box display="flex" mb={3}>
        <FormControl variant="outlined" fullWidth mr={2}>
          <InputLabel>View</InputLabel>
          <Select value={view} onChange={handleViewChange} label="View">
            <MenuItem value="messagesPerSession">Messages Per Session</MenuItem>
            <MenuItem value="recentSessions">Recent Sessions</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" justifyContent="space-between" flexGrow={1}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
      </Box>
      {view === 'messagesPerSession' && (
        <Box width="100%" height={400}>
          <ResponsiveContainer>
            <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      {view === 'recentSessions' && (
        <Box>
          <Typography variant="h6" gutterBottom>Recent Sessions</Typography>
          <List>
            {getRecentSessions().map((session, index) => (
              <React.Fragment key={session.sessionId}>
                <ListItem>
                  <ListItemText
                    primary={session.sessionId}
                    secondary={`Messages: ${session.messages.length} | ${new Date(session.timestamp).toLocaleString()}`}
                  />
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteChat(session.sessionId)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                {index < getRecentSessions().length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default ActivityDashboard;
