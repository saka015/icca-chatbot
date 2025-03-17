import React from "react";
import "../App.css";
import IccaLogo from "/logo.avif";
import { Toaster } from "react-hot-toast";
import Chatbot from "../components/Chatbot";
import { MdDownload } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

function Chat() {

    const downloadTranscript = async () => {
        try {
            const response = await axios.post(
                "https://aiva-livid.vercel.app/api/analytics/export/csv/f2411dd2-3167-42d6-9739-7582248e5d3e",
                {},
                { responseType: 'blob' }
            );

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: 'text/csv' });
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chat-transcript.csv';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Transcript downloaded successfully');
        } catch (error) {
            console.error('Error downloading transcript:', error);
            toast.error('Failed to download transcript');
        }
    };

  return (
    <div className="App">
      <main className="main-content">
        <div className="header">
          <img src={IccaLogo} alt="ICCA Logo" className="icca-logo" />
          <h1 className="app-title">ICCA Culinary Guide</h1>
          <p className="app-subtitle">Your Culinary Career Assistant</p>
          <button onClick={downloadTranscript} className="transcript-btn"> Transcript <MdDownload/> </button>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}

export default Chat;
