import React, { useState } from "react";
import BotTrigger from "../components/BotTrigger";
// import Chatbot from '../components/Chatbot'
import Chat from "./Chat";
const Home = () => {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="z-10 h-full w-full">
      <BotTrigger showChat={showChat} setShowChat={setShowChat} />
      {showChat && <Chat />}
    </div>
  );
};

export default Home;
