import React from "react";
import Chatbot from "./Chatbot";
import "./App.css";
import IccaLogo from "/logo.avif";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      <main className="main-content">
        <div className="header">
          <img src={IccaLogo} alt="ICCA Logo" className="icca-logo" />
          <h1 className="app-title">ICCA Culinary Guide</h1>
          <p className="app-subtitle">Your Culinary Career Assistant</p>
        </div>
        <Chatbot />
      </main>
    </div>
  );
}

export default App;
