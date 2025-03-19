import React, { useState } from "react";
import BotTrigger from "../components/BotTrigger";
import Chatbot from "../components/Chatbot";

const Home = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="z-10 h-full w-full">
      <BotTrigger showChat={showChat} setShowChat={setShowChat} />
      <div
        className={`fixed bottom-10 left-10 transition-all duration-500 ease-in-out ${
          showChat
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full pointer-events-none"
        }`}
      >
        <Chatbot setShowChat={setShowChat} />
      </div>
    </div>
  );
};

export default Home;
