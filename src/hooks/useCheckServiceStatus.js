import { useEffect } from "react";
import axios from "axios";

const useCheckServiceStatus = (onServiceLive) => {
  useEffect(() => {
    const checkStatus = async () => {
      try {
        console.log("Checking API status...");
        const response = await axios.post(
          "https://aiva-livid.vercel.app/api/chat",
          {
            prompt: "test",
            chat_history: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );

        if (response.data) {
          console.log("Service is live ✅");
          onServiceLive(true);
        }
      } catch (error) {
        console.log("Service status check failed:", error.message);
        // Show interface even if service check fails
        onServiceLive(true);
      }
    };

    // Single check on component mount
    checkStatus();
  }, [onServiceLive]);
};

export default useCheckServiceStatus;
