import React, { useState } from 'react';
import '../styles/desafio.css';
import { useNavigate } from 'react-router-dom';
const cores = [
  { id: 1, src: 'https://singlecolorimage.com/get/ffe600/100x100', cor: 'amarela' },
  { id: 2, src: 'https://singlecolorimage.com/get/00ff00/100x100', cor: 'verde' },
  { id: 3, src: 'https://singlecolorimage.com/get/ffe600/100x100', cor: 'amarela' },
  { id: 4, src: 'https://singlecolorimage.com/get/00ff00/100x100', cor: 'verde' }
];

export default function Desafio() {
  const navigate = useNavigate();
  const [classificadas, setClassificadas] = useState({ amarela: [], verde: [] });

  const onDrop = (cor) => (ev) => {
    ev.preventDefault();
    const corId = parseInt(ev.dataTransfer.getData('text/plain'));
    if (!classificadas[cor].includes(corId)) {
      setClassificadas({
        ...classificadas,
        [cor]: [...classificadas[cor], corId]
      });
    }
  };

  const allowDrop = ev => ev.preventDefault();

  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData('text/plain', id);
  };

  // Cores que ainda não foram classificadas
  const naoClassificadas = cores.filter(f =>
    !classificadas.verde.includes(f.id) && !classificadas.amarela.includes(f.id)
  );

  return (
    <div>
      <h3>Classifique as imagens:</h3>
      <div className="area-classificacao">
        <div className="zona" onDrop={onDrop('amarela')} onDragOver={allowDrop}>
          <div>Cores amarelas</div>
          {classificadas.amarela.map(id => {
            const cor = cores.find(f => f.id === id);
            return (
              <img
                key={cor.id}
                src={cor.src}
                alt="cor"
                className="fruta"
                draggable={false}
                style={{ opacity: 1 }}
              />
            );
          })}
        </div>
        <div className="zona" onDrop={onDrop('verde')} onDragOver={allowDrop}>
          <div>Cores verdes</div>
          {classificadas.verde.map(id => {
            const cor = cores.find(f => f.id === id);
            return (
              <img
                key={cor.id}
                src={cor.src}
                alt="cor"
                className="fruta"
                draggable={false}
                style={{ opacity: 1 }}
              />
            );
          })}
        </div>
      </div>
      <div className="frutas">
        {naoClassificadas.map(f =>
          <img
            key={f.id}
            src={f.src}
            alt="cor"
            draggable
            onDragStart={(e) => onDragStart(e, f.id)}
            className="fruta"
          />
        )}
      </div>
      <button onClick={() => navigate('/classificar')}>Classificar</button>
    </div>
  );
}
