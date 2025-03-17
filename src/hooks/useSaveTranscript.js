import axios from "axios";

const useSaveTranscript = () => {
  const saveTranscript = async (chatHistory) => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.post(
        "https://aiva-livid.vercel.app/api/analytics/transcript",
        {
          chat_history: chatHistory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error saving transcript:", error);
    }
  };

  return saveTranscript;
};

export default useSaveTranscript;
