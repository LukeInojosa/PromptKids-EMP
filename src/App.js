import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Trilha from './pages/Trilha';
import Desafio from './pages/Desafio';
import Classificar from './pages/Classificar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/trilha" element={<Trilha />} />
        <Route path="/desafio" element={<Desafio />} />
        <Route path="/classificar" element={<Classificar />} />
      </Routes>
    </Router>
  );
}

export default App;