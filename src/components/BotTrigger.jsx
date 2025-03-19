import React from 'react'
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { useChatbot } from "../context/ChatbotContext";

const BotTrigger = ({ showChat, setShowChat }) => {
  const { currentPage } = useChatbot();
  
  const handleTriggerClick = () => {
    // Toggle the chat visibility
    setShowChat(!showChat);
    
    // If we're opening the chat and there are saved messages, go directly to chat page
    if (!showChat && localStorage.getItem("chats")) {
      // The context will already have the last active page
    }
  };
  
  return (
    <div className='bg-[#c41230] cursor-pointer hover:bg-[#c41230]/80 bottom-10 left-10 absolute h-fit w-fit p-2 rounded-full'>
        <HiChatBubbleLeftEllipsis onClick={handleTriggerClick} className="cursor-pointer text-3xl text-white" />
    </div>
  )
}

export default BotTrigger
