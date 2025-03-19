import { createContext, useContext, useState, useEffect } from "react";

const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  // Try to get the last active page from localStorage, default to "home"
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("chatbotCurrentPage");
    return savedPage || "home";
  });

  // Save the current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatbotCurrentPage", currentPage);
  }, [currentPage]);

  return (
    <ChatbotContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}; 