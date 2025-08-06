import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Trilha() {
  const navigate = useNavigate();

  return (
    <div className="trilha-container">
      <h2>Trilhas</h2>
      <button onClick={() => alert('Vídeo aula 1')}>▶ Aula 1</button>
      <button onClick={() => alert('Vídeo aula 2')}>▶ Aula 2</button>
      <button onClick={() => navigate('/desafio')}>🏆 Desafio</button>
    </div>
  );
}