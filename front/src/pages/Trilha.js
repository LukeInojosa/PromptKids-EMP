import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Trilha() {
  const navigate = useNavigate();

  return (
    <div className="trilha-container">
      <h2>Trilhas</h2>
      <button onClick={() => alert('Vídeo aula 1')}>▶ Classificação</button>
      <button onClick={() => navigate('/desafio')}>🏆 Desafio Classificação</button>
      <button onClick={() => alert('Vídeo aula 2')}>▶ Generativa</button>
      <button onClick={() => navigate('/melhorar-esboco')}>🎨 Melhorar Esboço</button>
    </div>
  );
}