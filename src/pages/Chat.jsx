import React, { useState } from "react";
import "../App.css";
import IccaLogo from "/logo.avif";
import { Toaster } from "react-hot-toast";
import Chatbot from "../components/Chatbot";
import { MdDownload } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { LuSend } from "react-icons/lu";

function Chat() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

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
      setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  const sendTranscript = async () => {
    try {
      setIsSending(true);
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "https://aiva-livid.vercel.app/api/mail/transcript",
        {},
        {
          headers: {
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

  

  return (
    <div className="App">
      <main className="main-content">
        <div className="header">
          <button onClick={handleLogout} className="transcript-btn">
            {" "}
            Logout <IoIosLogOut />{" "}
          </button>
          <img src={IccaLogo} alt="ICCA Logo" className="icca-logo" />
          <h1 className="app-title">ICCA Culinary Guide</h1>
          <p className="app-subtitle">Your Culinary Career Assistant</p>
          <button
            className="transcript-btn"
            onClick={() => navigate("/transcript")}
          >
            Transcript
          </button>
          <button
            onClick={sendTranscript}
            className="transcript-btn"
            disabled={isSending}
          >
            {isSending
              ? "Sending Transcript to Email..."
              : "Send Transcript to Email"}{" "}
            {!isSending && <LuSend />}
          </button>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}

export default Chat;
