import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import useCheckServiceStatus from "../hooks/useCheckServiceStatus";
import useSaveTranscript from "../hooks/useSaveTranscript";
import image1 from "/src/assets/1.avif";
import image2 from "/src/assets/2.avif";
import image3 from "/src/assets/3.avif";
import image4 from "/src/assets/4.avif";
import image5 from "/src/assets/5.avif";
import image6 from "/src/assets/6.avif";

// Add this debounce utility function at the top of the file
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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
  const [currentLoaderIndex, setCurrentLoaderIndex] = useState(0);

  // Add a new ref to track if we're currently processing a message
  const isProcessingRef = useRef(false);

  const saveTranscript = useSaveTranscript();

  const loaderData = [
    {
      text:
        "ICCA Dubai is a world-class culinary training center established in 2005, offering internationally recognized programs accredited by City & Guilds, London.",
      image: image1,
    },
    {
      text:
        'Recognized among the "Top 10 Culinary Institutes in the World," ICCA Dubai provides an award-winning learning experience to aspiring chefs, artisans, and entrepreneurs globally.',
      image: image2,
    },
    {
      text:
        "As the first school of its kind in the Middle East, ICCA Dubai has over 20 years of continued excellence in culinary education.",
      image: image3,
    },
    {
      text:
        "ICCA Dubai offers 100% internship and work placement, with 86% of UAE hospitality brands serviced, and has successfully trained over 12,000 students.",
      image: image4,
    },
    {
      text:
        "The institute provides turnkey culinary career programs, equipping students with the necessary skills to excel in the culinary industry.",
      image: image5,
    },
    {
      text:
        "ICCA Dubai's state-of-the-art facilities and award-winning training kitchens offer professionals the opportunity to enhance their skills through Continuous Professional Development (CPD) programs.",
      image: image6,
    },
  ];

  const isServiceLiveFromHook = useCheckServiceStatus((status) => {
    console.log("Service status callback received:", status);
    if (status) {
      console.log("Setting service as live and hiding loader");
      setIsServiceLive(true);
      setShowLoader(false);
    }
  });

  useEffect(() => {
    if (isServiceLiveFromHook) {
      console.log("Service is live from hook return value");
      setIsServiceLive(true);
      setShowLoader(false);
    }
  }, [isServiceLiveFromHook]);

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

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        // Reset to 0 if we reach the end, otherwise increment
        setCurrentLoaderIndex((prev) =>
          prev >= loaderData.length - 1 ? 0 : prev + 1
        );
      }, 3000); // Change slide every 3 seconds
      return () => clearTimeout(timer);
    }
  }, [currentLoaderIndex, showLoader, loaderData.length]);

  const sendMessage = async () => {
    if (!input.trim() || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoading(true);
    setBotTyping(true);

    const promptToSend = showPrompt ? `user said ${input}` : input;
    setCurrentPrompt(promptToSend);

    // Create user message
    const userMessage = { role: "user", content: input };

    // Update messages with user input
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const chat_history = messages.map((msg) => ({
        [msg.role === "user" ? "user" : "assistant"]: msg.content,
      }));

      const token = localStorage.getItem("userToken");

      console.log("Sending request to API...");

      // Add empty bot message to start with
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: "" },
      ]);

      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/chat",
        {
          prompt: promptToSend,
          chat_history: chat_history,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let responseText = response.data;
      if (typeof responseText === "string" && responseText.endsWith("{}")) {
        responseText = responseText.slice(0, -2).trim();
      }

      // Check if the response starts with "User:" or similar patterns
      // and remove the user's question from the response
      const cleanedResponse = responseText.replace(
        /^(User|Human|Q):.*?\n\n?(Assistant|A|Bot)?:?\s*/is,
        ""
      );

      // Simulate typing effect for the response
      let displayedText = "";
      const characters = cleanedResponse.split("");

      // Update the bot message character by character
      for (let i = 0; i < characters.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 20)); // 20ms typing speed
        displayedText += characters[i];

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          // Update the last message (which is the bot's response)
          newMessages[newMessages.length - 1] = {
            role: "bot",
            content: displayedText,
          };
          return newMessages;
        });
      }

      setBotTyping(false);

      // Create transcript with latest user query and bot response
      const chatHistoryForTranscript = [
        ...chat_history,
        { user: input },
        { assistant: cleanedResponse },
      ];

      // Save the transcript
      saveTranscript(chatHistoryForTranscript);
    } catch (error) {
      console.error("Error fetching response:", error);
      setBotTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "bot",
          content:
            "I apologize, but I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
      setCurrentPrompt("");
      isProcessingRef.current = false;
    }
  };

  // Create a debounced version of sendMessage
  const debouncedSendMessage = React.useCallback(
    debounce(() => {
      if (!isProcessingRef.current) {
        sendMessage();
      }
    }, 1000),
    [input, messages]
  );

  function getCurrentRotation(element) {
    const style = window.getComputedStyle(element);
    const matrix = style.transform;

    if (matrix === "none") return 0;
    const values = matrix.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];
    return Math.round(Math.atan2(b, a) * (180 / Math.PI));
  }

  useEffect(() => {
    if (showLoader) {
      const progressBar = document.querySelector(".progress");
      let width = 0;
      let speed = 50; // Initial speed

      const interval = setInterval(() => {
        if (width >= 90) {
          speed = 500;
          if (!isServiceLive) {
            // Slowly increment while waiting for service
            if (Math.random() < 0.1) {
              width = Math.min(width + 0.5, 95);
            }
          } else {
            // Complete the progress when service is live
            width = 100;
            clearInterval(interval);
          }
        } else {
          width += 0.5;
        }

        if (progressBar) {
          progressBar.style.width = `${width}%`;
        }

        if (width >= 100) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [showLoader, isServiceLive]);

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {showLoader ? (
          <div className="loader-container">
            <div className="loader">
              <div className="loader-content">
                {loaderData.map((item, index) => (
                  <div
                    key={index}
                    className={`loader-item ${
                      index === currentLoaderIndex ? "active" : ""
                    }`}
                  >
                    <div className="loader-image-container">
                      <img src={item.image} alt={`Loader image ${index + 1}`} />
                      <p className="loader-text">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="loading-status">
                <div className="progress-bar">
                  <div className="progress"></div>
                </div>
                <p className="status-text">
                  {isServiceLive ? "Connected!" : "Connecting to server..."}
                </p>
              </div>
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
              <div
                className={`typing-indicator ${
                  messages.length === 0 ? "typing-indicator-first" : ""
                }`}
              >
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      <div
        className="chat-input-area"
        style={{ display: isServiceLive ? "flex" : "none" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isProcessingRef.current) {
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
