import { useEffect, useRef } from "react";
import axios from "axios";

const useCheckServiceStatus = (onServiceLive) => {
  const isLiveRef = useRef(false);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    let pollingInterval;
    let isSubscribed = true;

    const checkStatus = async () => {
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && isSubscribed) {
          console.log("Service is live ✅");
          isLiveRef.current = true;
          onServiceLive(true);
          if (pollingInterval) {
            clearInterval(pollingInterval);
          }
        }
      } catch (error) {
        console.log("Waiting for service to be ready...");
        if (isSubscribed) {
          onServiceLive(false);
        }
      }
    };

    if (!isLiveRef.current) {
      checkStatus();
      pollingInterval = setInterval(checkStatus, 5000); // Check every 5 seconds
    }

    return () => {
      isSubscribed = false;
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [onServiceLive]);
};

export default useCheckServiceStatus;
