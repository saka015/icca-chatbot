import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const TranscriptDetail = () => {
  const [transcriptData, setTranscriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `https://aiva-livid.vercel.app/api/analytics/f5ad5678-1cf2-426d-85ff-56a3d85df347/transcript/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setTranscriptData(response.data);
      } catch (error) {
        console.error("Error fetching transcript details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTranscript();
    }
  }, [userId]);

  // Format date for header
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Parse the transcript text into structured messages
  const parseTranscript = (transcriptText) => {
    if (!transcriptText) return [];

    // Split by "User:" and "Assistant:" markers
    const parts = transcriptText.split(/\n*(User:|Assistant:)\s*/g);

    const messages = [];
    let currentRole = null;

    // Process the parts to create message objects
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part === "User:") {
        currentRole = "user";
      } else if (part === "Assistant:") {
        currentRole = "bot";
      } else if (part.trim() && currentRole) {
        messages.push({
          role: currentRole,
          content: part.trim(),
        });
      }
    }

    return messages;
  };

  const messages = transcriptData?.transcripts
    ? parseTranscript(transcriptData.transcripts)
    : [];

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <div className="user-info">
          <h2>Conversation Transcript</h2>
          <p>User ID: {userId}</p>
          {transcriptData?.created_at && (
            <p>Date: {formatDate(transcriptData.created_at)}</p>
          )}
        </div>
        <button className="back-button" onClick={() => navigate("/transcript")}>
          <FaArrowLeft /> Back to List
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : messages.length > 0 ? (
        <div className="conversation-messages">
          {messages.map((message, index) => (
            <div key={index} className={`conversation-message ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          {transcriptData
            ? "Could not parse conversation data"
            : "No conversation data available"}
        </div>
      )}
    </div>
  );
};

export default TranscriptDetail;
