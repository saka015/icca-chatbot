import { useEffect, useRef } from "react";
import axios from "axios";

const useCheckServiceStatus = (onServiceLive) => {
  // Add a ref to track if service is already live
  const isLiveRef = useRef(false);

  useEffect(() => {
    let pollingInterval;
    let isSubscribed = true;

    const checkStatus = async () => {
      // Skip check if service is already live
      if (isLiveRef.current) return;

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

        if (response.data && isSubscribed) {
          console.log("Service is live ✅");
          isLiveRef.current = true; // Mark service as live
          onServiceLive(true);
          // Clear the polling interval once service is live
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }
        }
      } catch (error) {
        // If it's a 500 error or any other error, keep showing loader
        console.log("Waiting for service to be ready...");
        if (isSubscribed) {
          onServiceLive(false);
        }
      }
    };

    // Only start polling if service isn't live yet
    if (!isLiveRef.current) {
      // Initial check
      checkStatus();

      // Start polling every 10 seconds
      pollingInterval = setInterval(checkStatus, 10000);
    }

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [onServiceLive]);
};

export default useCheckServiceStatus;
