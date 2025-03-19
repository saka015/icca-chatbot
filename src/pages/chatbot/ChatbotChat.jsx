import React, { useState, useRef, useEffect } from "react";
import { FiMinus, FiArrowLeft } from "react-icons/fi";
import { useChatbot } from "../../context/ChatbotContext";
import axios from "axios";
import toast from "react-hot-toast";
import useCheckServiceStatus from "../../hooks/useCheckServiceStatus";
import useSaveTranscript from "../../hooks/useSaveTranscript";
import Portal from "../../components/Portal";
import image1 from "/src/assets/1.avif";
import image2 from "/src/assets/2.avif";
import image3 from "/src/assets/3.avif";
import image4 from "/src/assets/4.avif";
import image5 from "/src/assets/5.avif";
import image6 from "/src/assets/6.avif";
import botPic from "../../assets/bot-pic.png";
import { FaChevronLeft } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";

const ChatbotChat = ({ setShowChat }) => {
  const { setCurrentPage } = useChatbot();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [isServiceLive, setIsServiceLive] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [currentLoaderIndex, setCurrentLoaderIndex] = useState(0);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const optionsMenuRef = useRef(null);
  const dotsButtonRef = useRef(null);
  const chatEndRef = useRef(null);
  const isProcessingRef = useRef(false);
  const saveTranscript = useSaveTranscript();
  const token = localStorage.getItem("userToken");
  const [typingDots, setTypingDots] = useState("");
  const [responseStarted, setResponseStarted] = useState(false);

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

  useCheckServiceStatus((status) => {
    if (status) {
      setIsServiceLive(true);
      // Start the completion animation
      const loaderContainer = document.querySelector(".loader-container");
      if (loaderContainer) {
        loaderContainer.classList.add("show-success");
        setTimeout(() => {
          document.querySelector(".success-check").style.opacity = "1";
        }, 500);

        setTimeout(() => {
          loaderContainer.style.opacity = "0";
          setTimeout(() => {
            setShowLoader(false);
          }, 500);
        }, 4000);
      }
    }
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load saved messages from localStorage when component mounts
    try {
      const savedChats = localStorage.getItem("chats");
      if (savedChats) {
        setMessages(JSON.parse(savedChats));
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    if (messages.length > 0) {
      try {
        localStorage.setItem("chats", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages]);

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

            // Start the completion animation
            const loaderContainer = document.querySelector(".loader-container");
            if (loaderContainer) {
              loaderContainer.classList.add("show-success");
              setTimeout(() => {
                document.querySelector(".success-check").style.opacity = "1";
              }, 500);

              setTimeout(() => {
                loaderContainer.style.opacity = "0";
                setTimeout(() => {
                  setShowLoader(false);
                }, 500);
              }, 4000);
            }
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

  // Close any open modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showOptionsMenu &&
        !optionsMenuRef.current?.contains(e.target) &&
        !dotsButtonRef.current?.contains(e.target)
      ) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsMenu]);

  // Add useEffect for typing dots animation
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
    if (!input.trim() || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setLoading(true);
    setBotTyping(true);
    setResponseStarted(false); // Reset response started state

    // Create user message
    const userMessage = { role: "user", content: input };

    // Update messages with user input
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const chat_history = messages.map((msg) => ({
        [msg.role === "user" ? "user" : "assistant"]: msg.content,
      }));

      console.log("Sending request with chat history:", chat_history);
      console.log("Current input:", input);

      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/chat",
        {
          prompt: input,
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

      console.log("Received response:", responseText);

      // Clean up the response if needed
      const cleanedResponse = responseText.replace(
        /^(User|Human|Q):.*?\n\n?(Assistant|A|Bot)?:?\s*/is,
        ""
      );

      // Simulate typing effect for the response
      setResponseStarted(true);
      setBotTyping(false); // Hide typing indicator once response starts

      // Add empty bot message to show typing effect
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: "" },
      ]);

      // Update the bot message character by character
      let displayedText = "";
      const characters = cleanedResponse.split("");

      for (let i = 0; i < characters.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2));
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

      // Save transcript with the updated messages
      const updatedMessages = [
        ...messages,
        userMessage,
        { role: "bot", content: cleanedResponse },
      ];
      saveTranscript(updatedMessages);
    } catch (error) {
      console.error("Error fetching response:", error);
      setBotTyping(false);
      setResponseStarted(true);
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
      isProcessingRef.current = false;
    }
  };

  const handleCloseChat = () => {
    setShowCloseModal(true);
  };

  const cancelCloseChat = () => {
    setShowCloseModal(false);
  };

  const confirmCloseChat = () => {
    // Clear chat history
    localStorage.removeItem("chats");
    setMessages([]);
    setShowCloseModal(false);
    setCurrentPage("home");
  };

  const handleMinimizeChat = () => {
    setShowChat(false);
  };

  const handleThreeDots = (e) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  // Download data from API
  const downloadTranscript = async () => {
    try {
      setShowOptionsMenu(false);

      // Show loading toast
      const toastId = toast.loading("Downloading data...");

      // Make API request to download data
      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/analytics/export/csv/f2411dd2-3167-42d6-9739-7582248e5d3e",
        {},
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chat-transcript.csv";

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast.success("Data downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Failed to download data. Please try again.");
    }
  };

  // Updated send transcript function
  const sendTranscript = async () => {
    try {
      setIsSending(true);
      setShowOptionsMenu(false); // Close the options menu when sending
      const token = localStorage.getItem("userToken");

      // Format the chat history similar to how it was done in the old code
      const formattedChatHistory = messages.map((msg) => ({
        [msg.role === "user" ? "user" : "assistant"]: msg.content,
      }));

      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/mail/transcript",
        { chat_history: formattedChatHistory }, // Include the chat history in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Transcript sent to email successfully");
    } catch (error) {
      console.error("Error sending transcript:", error);
      toast.error("Failed to send transcript to email");
    } finally {
      setIsSending(false);
    }
  };

  const saveChat = () => {
    // Implement save chat functionality
    saveTranscript(messages);
    setShowOptionsMenu(false);
  };

  return (
    <div className="bg-[#c41230] bottom-25 left-10 h-[500px] w-88 rounded-4xl overflow-hidden pb-1  flex flex-col">
      <div className="flex-1 overflow-y-hidden overflow-x-hidden px-2 pb-14 rounded-4xl scrollbar-hide">
        {/* Custom header for chat page */}
        <div className="flex items-center justify-between w-full pt-2 sticky top-0 z-10 px-2">
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center text-white hover:bg-white/10 p-2 rounded-full"
          >
            <FaChevronLeft className="text-xl" />
          </button>

          <div className="flex items-center justify-start gap-2 my-2">
            <div className="">
              <img
                className="border-2 border-white rounded-full"
                width={40}
                height={40}
                src={botPic}
                alt=""
              />
            </div>
            <div className="text-gray-500">
              <h3 className="text-base font-sf font-light text-white">AIVA</h3>
              <p className="text-[10px] font-sf text-gray-300">
                Culinary Career AI Assistant
              </p>
            </div>
          </div>

          {/* Options menu container with fixed positioning */}
          <div className="flex items-center gap-2 relative">
            <div className="options-menu-container">
              <button
                ref={dotsButtonRef}
                onClick={handleThreeDots}
                className="cursor-pointer text-white text-xl hover:bg-white/10 p-1 rounded-full flex items-center justify-center"
              >
                <HiDotsHorizontal />
              </button>

              {/* Absolutely positioned menu with fixed coordinates */}
              {showOptionsMenu && (
                <div
                  ref={optionsMenuRef}
                  className="fixed bg-white rounded-md shadow-lg py-1 z-[9999]"
                  style={{
                    top: "10px",
                    right: "-75px",
                  }}
                >
                  <button
                    onClick={downloadTranscript}
                    className="block cursor-pointer w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                  >
                    Download Data
                  </button>
                  <button
                    onClick={sendTranscript}
                    disabled={isSending}
                    className="block cursor-pointer w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 items-center"
                  >
                    {isSending ? (
                      <>
                        <span className="mr-1">Sending...</span>
                        <div className="animate-spin h-3 w-3 border-2 border-gray-500 border-t-transparent rounded-full ml-auto"></div>
                      </>
                    ) : (
                      "Send Transcript to Email"
                    )}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCloseChat}
              className="cursor-pointer text-white text-xl hover:bg-white/10 p-1 rounded-full flex items-center justify-center"
            >
              <IoCloseOutline />
            </button>

            <button
              onClick={handleMinimizeChat}
              className="cursor-pointer text-white text-xl hover:bg-white/10 p-1 rounded-full flex items-center justify-center"
            >
              <FiMinus />
            </button>
          </div>
        </div>

        <div className="p-2 mb-2 bg-white rounded-xl overflow-hidden flex flex-col mt-2 -mx-1 relative z-20 h-full">
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
                        <img
                          src={item.image}
                          alt={`Loader image ${index + 1}`}
                        />
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
              <div className="chat-messages flex-1 overflow-y-auto p-4 mb-8 bg-gray-100 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-4 p-4 bg-yellow-100 rounded-lg">
                    Start a conversation with AIVA
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message p-3 my-2 rounded-lg shadow-sm ${
                        msg.role === "user"
                          ? "bg-blue-100 ml-auto max-w-[80%] text-blue-900"
                          : "bg-pink-100 mr-auto max-w-[80%] text-pink-900"
                      }`}
                    >
                      <div className="font-bold text-xs mb-1">
                        {msg.role === "user" ? "You:" : "AIVA:"}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  ))
                )}
                {botTyping && !responseStarted && (
                  <div className="typing-indicator bg-pink-100 p-2 rounded-lg inline-block">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input area */}
              <div className="chat-input-area my-4 mb-8 p-2">
                <div className="flex w-full">
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
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-[#c41230] text-white p-2 rounded-r-lg"
                  >
                    {loading ? "..." : "Send"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add back the close chat confirmation modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] rounded-4xl h-full w-full">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto w-56 ">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Close Chat
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Do you really want to close this chat? Your conversation history
              will be deleted.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelCloseChat}
                className=" bg-gray-200 cursor-pointer text-gray-800 rounded-4xl px-3 py-1 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmCloseChat}
                className="py-1 cursor-pointer bg-[#c41230] text-white rounded-4xl px-3 hover:bg-[#a30f28]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotChat;
