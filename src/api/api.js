
import axios from 'axios';

const sendMessageToOpenAI = async (messages) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const messageHistory = messages.map(message => ({
    role: message.sender === 'user' ? 'user' : 'assistant',
    content: message.text
  }));

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messageHistory,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    if (error.response && error.response.status === 429) {
      throw new Error('Rate limited');
    } else if (error.response && error.response.status === 402) {
      throw new Error('insufficient_quota');
    } else {
      throw new Error('Error fetching the response from OpenAI');
    }
  }
};

export default sendMessageToOpenAI;




