import { useEffect, useRef, useState } from "react";
import axios from "axios";

const useCheckServiceStatus = (onServiceLive) => {
  const isLiveRef = useRef(false);
  const hasCheckedRef = useRef(false);
  const token = localStorage.getItem("userToken");
  // Add internal state to track service status
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const checkStatus = async () => {
      if (hasCheckedRef.current || isLiveRef.current) return;

      hasCheckedRef.current = true;

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

        console.log("API hit done", response.status);

        // CRITICAL FIX: Force immediate callback with true status
        isLiveRef.current = true;
        setIsLive(true);

        // Call the callback synchronously to ensure it runs
        if (typeof onServiceLive === "function") {
          console.log("Calling onServiceLive with true - IMMEDIATE");
          onServiceLive(true);

          // Call it again after a short delay as a backup
          setTimeout(() => {
            if (typeof onServiceLive === "function") {
              console.log("Calling onServiceLive with true - DELAYED BACKUP");
              onServiceLive(true);
            }
          }, 100);
        }
      } catch (error) {
        console.log("Service check failed", error.message);
        if (isSubscribed && typeof onServiceLive === "function") {
          onServiceLive(false);
        }
      }
    };

    // Call immediately
    checkStatus();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return isLive;
};

export default useCheckServiceStatus;
