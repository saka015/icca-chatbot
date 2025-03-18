import React from 'react'
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";

const BotTrigger = ({ showChat, setShowChat }) => {
  return (
    <div className='bg-[#c41230] cursor-pointer hover:bg-[#c41230]/80 bottom-10 left-10 absolute h-fit w-fit p-2 rounded-full'>
        <HiChatBubbleLeftEllipsis onClick={() => setShowChat(!showChat)} className="cursor-pointer text-3xl text-white" />
    </div>
  )
}

export default BotTrigger
