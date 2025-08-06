import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/splash.css';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <h1>PROMPTKIDS</h1>
      <p>O jeito divertido e eficaz de aprender IA!</p>
      <button onClick={() => navigate('/trilha')}>COMEÇAR AGORA!</button>
    </div>
  );
}
