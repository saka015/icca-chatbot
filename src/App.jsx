import React from 'react';
import Chatbot from './Chatbot';
import './App.css';
import Pizza from '/pizza.png';
import Burger from '/burger.png';
import Coffee from '/cofee.png';
import ChefGif from '/sef.gif';
import IccaLogo from '/logo.avif'; 
// import IccaLogo from '/logo.avif'; 

function App() {
  return (
    <div className="App">
      {/* <div className="background-images"> */}
        {/* <img src={Pizza} alt="Pizza" className="background-image pizza" loading="lazy" />
        <img src={Burger} alt="Burger" className="background-image burger" loading="lazy" />
        <img src={Coffee} alt="Coffee" className="background-image coffee" loading="lazy" />
        <img src={ChefGif} alt="Chef" className="background-image chef" loading="lazy" /> */}
      {/* </div> */}
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