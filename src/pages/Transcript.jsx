import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Transcript = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          "https://aiva-livid.vercel.app/api/analytics/f5ad5678-1cf2-426d-85ff-56a3d85df347/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setData(response.data);
      } catch (error) {
        console.error("Error fetching transcript data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Function to handle row click
  const handleRowClick = (userId) => {
    navigate(`/transcript/${userId}`);
  };

  // Function to get sentiment badge class
  const getSentimentClass = (sentiment) => {
    if (!sentiment) return "sentiment-na";

    sentiment = sentiment.toLowerCase();
    if (sentiment.includes("positive")) return "sentiment-positive";
    if (sentiment.includes("negative")) return "sentiment-negative";
    return "sentiment-neutral";
  };

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <h1>User Transcripts</h1>
        <button className="back-button" onClick={() => navigate("/chat")}>
          <FaArrowLeft /> Back to Chat
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : data.length > 0 ? (
        <table className="transcript-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id} onClick={() => handleRowClick(user.id)}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <span
                    className={`sentiment-badge ${getSentimentClass(
                      user.sentiment
                    )}`}
                  >
                    {user.sentiment || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data">No transcript data available</div>
      )}
    </div>
  );
};

export default Transcript;
