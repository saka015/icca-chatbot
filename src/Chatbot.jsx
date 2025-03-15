import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chatHistory")) || [];
    } catch (error) {
      console.error("Error parsing chat history from localStorage:", error);
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history to localStorage:", error);
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
      console.log('Sending request to API...');
      const response = await axios.post("https://aiva-livid.vercel.app/api/chat", 
        { prompt: promptToSend },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          }
        }
      );

      console.log("API Response:", response);

      // Extract the response text and remove the trailing "{}"
      let responseText = response.data;
      if (typeof responseText === 'string' && responseText.endsWith("{}")) {
        responseText = responseText.slice(0, -2).trim();
      }

      // Add bot message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: responseText }
      ]);

    } catch (error) {
      console.error("Error fetching response:", error);
      console.log("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "bot",
          content:
            "I apologize, but I'm having trouble connecting to the server. Please try again later.",
        },
      ]);

    } finally {
      setBotTyping(false);
      setLoading(false);
      setCurrentPrompt("");
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {" "}
            {msg.content.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < msg.content.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        ))}
        {botTyping && messages.length > 0 && (
          <div className="message bot">Typing{typingDots}</div>
        )}
        <div ref={chatEndRef} />
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
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="send-button"
        >
          {loading ? "Send" : "Send"}
        </button>
      </div>
    </div>
  );
}