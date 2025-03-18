import React from "react";
import botPic from "../assets/bot-pic.png";
import { RiSendPlaneLine } from "react-icons/ri";
const StartConversation = () => {
  return (
    <div className="w-full rounded-2xl shadow-xl p-3">
      <p className="text-xs text-black">Conversations</p>

      <div className=" flex items-center justify-center gap-2 my-2">
        <div className="">
          <img width={90} height={90} src={botPic} alt="" />
        </div>
        <div className="text-gray-500">
          <h3 className="text-base font-sf">AIVA</h3>
          <p className="text-xs font-sf">
            Hi! I am AIVA Your Personal Culinary Career AI Assistant
          </p>
        </div>
      </div>
      <button className="bg-[#c41230] flex justify-between px-12 items-center gap-2 w-full rounded-2xl font-normal text-base  text-white py-2 cursor-pointer border hover:border-[#c41230] hover:bg-white hover:text-[#c41230]">
        {" "}
        Send Us a Message <RiSendPlaneLine className="rotate-45" />
      </button>
    </div>
  );
};

export default StartConversation;
