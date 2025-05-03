import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';


export default function Main() {
  return (
    <div className="hero">
      <h1>Main</h1>
      <p>Change the trajectory of your life.</p>
      <p> Build good habits</p>
      <button>Explore</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
  