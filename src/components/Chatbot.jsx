import React from "react";
import { useChatbot } from "../context/ChatbotContext";
import ChatbotHome from "../pages/chatbot/ChatbotHome";
import ChatbotChat from "../pages/chatbot/ChatbotChat";

export default function Chatbot({ setShowChat }) {
  const { currentPage } = useChatbot();

  // Render different "pages" based on currentPage state
  const renderChatbotPage = () => {
    switch (currentPage) {
      case "home":
        return <ChatbotHome setShowChat={setShowChat} />;
      case "chat":
        return <ChatbotChat setShowChat={setShowChat} />;
      default:
        return <ChatbotHome setShowChat={setShowChat} />;
    }
  };

  return <div>{renderChatbotPage()}</div>;
}
