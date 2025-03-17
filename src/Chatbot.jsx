import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import useCheckServiceStatus from './hooks/useCheckServiceStatus';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [isServiceLive, setIsServiceLive] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useCheckServiceStatus((status) => {
    if (status) {
      setIsServiceLive(true);
      // Start the completion animation
      const loaderContainer = document.querySelector('.loader-container');
      if (loaderContainer) {
        loaderContainer.classList.add('show-success');
        setTimeout(() => {
          document.querySelector('.success-check').style.opacity = '1';
        }, 500);
        
        setTimeout(() => {
          loaderContainer.style.opacity = '0';
          setTimeout(() => {
            setShowLoader(false);
          }, 500);
        }, 4000);
      }
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("chats", JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (botTyping) {
      const intervalId = setInterval(() => {
        setTypingDots((dots) => {
          if (dots.length < 3) {
            return dots + ".";
          } else {
            return "";
          }
        });
      }, 500);

      return () => clearInterval(intervalId);
    } else {
      setTypingDots("");
    }
  }, [botTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setBotTyping(true);

    const promptToSend = showPrompt ? `user said ${input}` : input;
    setCurrentPrompt(promptToSend);

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      // Format chat history from current messages state
      const chat_history = messages.map(msg => ({
        [msg.role === 'user' ? 'user' : 'assistant']: msg.content
      }));

      console.log('Sending request to API...');
      const response = await axios.post("https://aiva-livid.vercel.app/api/chat",
        { 
          prompt: promptToSend,
          chat_history: chat_history 
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );

      // console.log("API Response:", response);

      let responseText = response.data;
      if (typeof responseText === 'string' && responseText.endsWith("{}")) {
        responseText = responseText.slice(0, -2).trim();
      }

      // Hide typing indicator once we start showing the response
      setBotTyping(false);
      
      // Add the bot message and stream the response
      setMessages((prevMessages) => [...prevMessages, { role: "bot", content: "" }]);
      
      let currentText = "";
      for (let i = 0; i < responseText.length; i++) {
        currentText += responseText[i];
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = {
            role: "bot",
            content: currentText
          };
          return newMessages;
        });
        await new Promise(resolve => setTimeout(resolve, 20));
      }

    } catch (error) {
      console.error("Error fetching response:", error);
      setBotTyping(false);
      setMessages((prevMessages) => [...prevMessages, {
        role: "bot",
        content: "I apologize, but I'm having trouble connecting to the server. Please try again later."
      }]);
    } finally {
      setLoading(false);
      setCurrentPrompt("");
    }
  };

  function getCurrentRotation(element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;

  if (matrix === 'none') return 0;
  const values = matrix.split('(')[1].split(')')[0].split(',');
  const a = values[0];
  const b = values[1];
  return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

const startProgressBar = () => {
  const progressBar = document.querySelector('.progress');
  let width = 0;
  let speed = 50; // Initial speed (lower number = faster)

  const interval = setInterval(() => {
    if (width >= 90) {
      // Slow down significantly at 90%
      speed = 500;
      if (!isServiceLive) {
        // Only increment occasionally while waiting for service
        if (Math.random() < 0.1) { // 10% chance to increment
          width = Math.min(width + 0.5, 95);
        }
      } else {
        // Complete the progress bar when service is live
        width = 100;
        clearInterval(interval);
      }
    } else {
      // Normal progression up to 90%
      width += 0.5;
    }
    
    if (progressBar) {
      progressBar.style.width = `${width}%`;
    }

    if (width >= 100) {
      clearInterval(interval);
    }
  }, speed);

  return interval;
};

useEffect(() => {
  const intervalId = startProgressBar();
  return () => clearInterval(intervalId);
}, [isServiceLive]); // Depend on isServiceLive to complete the bar when service is ready

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {showLoader ? (
          <div className="loader-container">
            <div className="loader">
              <div className="fries">🍟</div>
              <div className="drink">🥤</div>
              <div className="progress-bar">
                <div className="progress"></div>
              </div>
              <div className="loading-text">Connecting to server!</div>
            </div>
            <div className="success-check">
              <div className="check-circle">
                <div className="checkmark">✓</div>
              </div>
              <div className="success-text">Start your chat!</div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                {msg.content.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < msg.content.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            ))}
            {botTyping && (
              <div className={`typing-indicator ${messages.length === 0 ? 'typing-indicator-first' : ''}`}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your question..."
          className="chat-input"
          disabled={!isServiceLive}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !isServiceLive}
          className="send-button"
        >
          {loading ? "Send" : "Send"}
        </button>
      </div>
    </div>
  );
}