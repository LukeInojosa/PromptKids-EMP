import React, { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/mgw62l8GPb/";

function Classificar() {
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const imageRef = useRef();

  // Carrega o modelo da Teachable Machine uma única vez ao montar o componente
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load the Teachable Machine model:", error);
      }
    };
    loadModel();
  }, []);

  // Limpa o objeto URL ao desmontar o componente ou ao trocar de imagem para evitar vazamento de memória
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  // Lida com a mudança do arquivo de imagem no input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageSrc(URL.createObjectURL(file));
      setPrediction(null); // Reseta a predição para a nova imagem
    }
  };

  // Lida com a classificação da imagem
  const handleClassify = async () => {
    if (!model || !imageRef.current) return;
    setIsLoading(true);
    const predictions = await model.predict(imageRef.current);
    if (predictions?.length) {
      // Encontra a melhor predição (com a maior probabilidade)
      const best = predictions.reduce((a, b) => (a.probability > b.probability ? a : b));
      setPrediction({
        className: best.className,
        probability: best.probability,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="classificar-container">
      <h2>Classificador de Imagens</h2>
      <p>Selecione uma imagem para classificá-la usando um modelo de IA.</p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ margin: "10px 0" }}
      />

      {imageSrc && (
        <div>
          <div className="image-preview">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Selecionada para classificação"
              crossOrigin="anonymous"
            />
          </div>

          <button
            onClick={handleClassify}
            disabled={isLoading || !!prediction || !model}
          >
            {isLoading ? "Classificando..." : "Classificar Imagem"}
          </button>
        </div>
      )}

      {prediction && (
        <div className="results-box">
          <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>Resultados</h3>
          <p>
            <strong>Classe:</strong> {prediction.className === "Class 1"? "Verde": "Amarelo"}
          </p>
          <p>
            <strong>Confiança:</strong> {(prediction.probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default Classificar;