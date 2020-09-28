import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { TweetComponent, TweetList } from "./tweets"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TweetComponent />
      </header>
    </div>
  );
}

export default App;
