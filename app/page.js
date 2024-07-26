'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showPrompts, setShowPrompts] = useState(true);
  const chatWindowRef = useRef(null);

  const predefinedPrompts = [
    "I'm feeling anxious and overwhelmed.",
    "Can you help me with stress management tips?",
    "I'm struggling with my self-esteem.",
    "How can I improve my sleep?"
  ];

  const handlePredefinedPromptClick = async (prompt) => {
    setMessage(prompt);
    await handleSendMessage(prompt);
    setShowPrompts(false);
  };

  const handleSendMessage = async (msg) => {
    if (!msg) return;

    // const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message: msg });
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message: msg });
    setChatHistory(response.data.chatHistory);
    setMessage('');
    setShowPrompts(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSendMessage(message);
  };

  const handleClear = async () => {
    // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clear`);
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/clear`);
    setChatHistory([]);
    setShowPrompts(true);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <h1>Mental Health Support Chatbot</h1>
      <br />
      <div ref={chatWindowRef} style={styles.chatWindow}>
        {showPrompts ? (
          <div style={styles.predefinedPrompts}>
            {predefinedPrompts.map((prompt, index) => (
              <button
                key={index}
                style={styles.promptButton}
                onClick={() => handlePredefinedPromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} style={styles.message}>
              <strong>{chat.role === 'user' ? 'User' : 'Bot'}:</strong> {chat.content}
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          placeholder="Type your message..."
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
      <button onClick={handleClear} style={styles.clearButton}>Clear Chat</button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },
  predefinedPrompts: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  promptButton: {
    padding: '10px',
    margin: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  chatWindow: {
    border: '1px solid #ccc',
    padding: '10px',
    height: '400px',
    overflowY: 'scroll',
    marginBottom: '20px',
  },
  message: {
    margin: '10px 0',
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
  },
  clearButton: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

