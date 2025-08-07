import { useState, useEffect } from 'react';

// URL do seu endpoint de backend
const API_ENDPOINT = 'http://localhost:3001/api/melhorar-esboco';

function MelhorarEsboco() {
  const [esbocoFile, setEsbocoFile] = useState(null);
  const [esbocoSrc, setEsbocoSrc] = useState(null);
  const [imagemMelhoradaSrc, setImagemMelhoradaSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (esbocoSrc) URL.revokeObjectURL(esbocoSrc);
    };
  }, [esbocoSrc]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEsbocoFile(file);
      setEsbocoSrc(URL.createObjectURL(file));
      setImagemMelhoradaSrc(null);
      setError(null);
    }
  };

  const handleImproveSketch = async () => {
    if (!esbocoFile) {
      setError('Por favor, selecione um arquivo de imagem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImagemMelhoradaSrc(null);

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const base64Image = event.target.result.split(',')[1];
        
        const data = {
          prompt: "Melhore este esboço para que pareça uma foto realista.",
          inlineData: {
            mimeType: esbocoFile.type,
            data: base64Image,
          },
          responseModalities: ["IMAGE", "TEXT"]
        };

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Falha na geração da imagem. Verifique o servidor.');
        }

        const result = await response.json();
        
        // Converte a imagem Base64 retornada para um Object URL para exibição
        const blob = await fetch(`data:${result.mimeType};base64,${result.imageData}`).then(res => res.blob());
        const improvedImageURL = URL.createObjectURL(blob);

        setImagemMelhoradaSrc(improvedImageURL);
        setIsLoading(false);
      };

      reader.readAsDataURL(esbocoFile);

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="classificar-container" style={{ maxWidth: '800px' }}>
      <h2>Melhorar Esboço com IA</h2>
      <p>Carregue um esboço e veja uma versão mais realista gerada pela IA.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ margin: "20px 0" }}
      />

      {esbocoSrc && (
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Seu Esboço</h3>
            <div className="image-preview">
              <img
                src={esbocoSrc}
                alt="Esboço original"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '15px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  border: '3px solid #5d5df9'
                }}
              />
            </div>
            <button
              onClick={handleImproveSketch}
              disabled={isLoading}
              style={{ marginTop: '20px' }}
            >
              {isLoading ? "Gerando..." : "Melhorar Esboço"}
            </button>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3>Versão Melhorada</h3>
            {isLoading && <p>Aguarde, a IA está trabalhando...</p>}
            {imagemMelhoradaSrc && (
              <div style={{ position: 'relative', marginTop: '20px' }}>
                <img
                  src={imagemMelhoradaSrc}
                  alt="Esboço melhorado"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    border: '3px solid #ffb12c'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#fff',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}>
                  IMAGEM GERADA PELA IA
                </div>
              </div>
            )}
            {!esbocoSrc && !isLoading && <p>Nenhuma imagem para melhorar.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default MelhorarEsboco;