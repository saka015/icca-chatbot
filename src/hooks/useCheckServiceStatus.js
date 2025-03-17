import { useEffect } from "react";
import axios from "axios";

const useCheckServiceStatus = (onServiceLive) => {
  useEffect(() => {
    let retryCount = 0;
    let checkInterval;

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
          clearInterval(checkInterval);
          onServiceLive(true); // Notify component that service is live
        }
      } catch (error) {
        retryCount++;
        console.log(
          `Service status check failed (attempt ${retryCount}):`,
          error.message
        );
        onServiceLive(false); // Notify component that service is not live yet
      }
    };

    // Initial check
    checkStatus();

    // Continue checking every 5 seconds until successful
    checkInterval = setInterval(checkStatus, 5000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(checkInterval);
    };
  }, [onServiceLive]);
};

export default useCheckServiceStatus;
