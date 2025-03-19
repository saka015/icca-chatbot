import React from "react";
import "../../App.css";
import IccaLogo from "/logo.avif";
import { Toaster } from "react-hot-toast";
import Chatbot from "../../components/Chatbot";
import { MdDownload } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import BotTrigger from "../../components/BotTrigger";
import { TbWorld } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { IoIosPaper } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import logo from "../../assets/icca-logo.svg";
import Logo from "../../assets/Logo";
import StartConversation from "../../components/StartConversation";
import { BsChatSquare } from "react-icons/bs";
import { useChatbot } from "../../context/ChatbotContext";

function ChatbotHome({ setShowChat }) {
  const { setCurrentPage } = useChatbot();

  const handleLogout = () => {
    try {
      // Clear all localStorage items
      localStorage.clear();

      // Show success message
      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      // Navigate to login page after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  const downloadTranscript = async () => {
    try {
      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/analytics/export/csv/f2411dd2-3167-42d6-9739-7582248e5d3e",
        {},
        { responseType: "blob" }
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

      toast.success("Transcript downloaded successfully");
    } catch (error) {
      console.error("Error downloading transcript:", error);
      toast.error("Failed to download transcript");
    }
  };

  return (
    <div className="bg-[#c41230] bottom-25 left-10 h-[500px] w-88 rounded-4xl overflow-hidden p- flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pb-20 rounded-4xl scrollbar-hide">
        <div className="flex flex-col items-center justify-center w-full pt-2 sticky top-0 z-10">
          <FiMinus
            onClick={() => setShowChat(false)}
            className="cursor-pointer absolute top-10 right-10 text-white text-xl"
          />
          <Logo />
          <p className="text-[10px] -mt-1 text-white text-left max-w-[120px]">
            INTERNATIONAL CENTER FOR CULINARY ARTS DUBAI
          </p>
        </div>

        <div className="p-2 bg-white rounded-4xl overflow-hidden flex flex-col items-center justify-center mt-2 -mx-1 relative z-20">
          <p className="text-black text-center text-base font-sf">
            Chat with AIVA
          </p>

          <StartConversation />

          <div className="flex flex-col gap-y-4 my-2 pb-4 w-full">
            <div className="flex w-full rounded-2xl shadow-xl p-3">
              <div className="w-2/3">
                <p className="text-black text-base">Take a virtual tour</p>
                <p className="text-gray-500 text-xs">
                  Get a World-Class Experience
                </p>
              </div>

              <div className="w-1/3 flex items-center justify-center">
                <TbWorld className="text-3xl text-[#c41230]" />
              </div>
            </div>
            <div className="flex w-full rounded-2xl shadow-xl p-3">
              <div className="w-2/3">
                <p className="text-black text-base">Speak with a counsellor</p>
                <p className="text-gray-500 text-xs">Request call back</p>
              </div>

              <div className="w-1/3 flex items-center justify-center">
                <FiPhoneCall className="text-3xl text-[#c41230]" />
              </div>
            </div>
            <div className="flex w-full rounded-2xl shadow-xl p-3">
              <div className="w-2/3">
                <p className="text-black text-base">WhatsApp Us</p>
                <p className="text-gray-500 text-xs">Connect on WhatsApp</p>
              </div>

              <div className="w-1/3 flex items-center justify-center">
                <FaWhatsapp className="text-3xl text-[#c41230]" />
              </div>
            </div>
            <div className="flex w-full rounded-2xl shadow-xl p-3">
              <div className="w-2/3">
                <p className="text-black text-base">Apply Now</p>
                <p className="text-gray-500 text-xs">Online Application</p>
              </div>

              <div className="w-1/3 flex items-center justify-center">
                <IoIosPaper className="text-3xl text-[#c41230]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full bottom-0 left-0 right-0 absolute bg-white shadow-md rounded-4xl border-t-0 rounded-t-none p-4 z-30 border-[4px] border-[#c41230]">
        <div className="flex w-full justify-around rounded-2xl shadow-xl p-2">
          <div className="text-[#c41230] flex flex-col items-center justify-center">
            <IoCallOutline className="rotate-135 text-2xl font-semibold" />
            <p className="text-base">Call</p>
          </div>
          <div
            className="text-[#c41230] flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setCurrentPage("chat")}
          >
            <BsChatSquare className="text-2xl font-semibold" />
            <p className="text-base">Chat</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ChatbotHome;
