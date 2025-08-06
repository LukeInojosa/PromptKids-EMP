import React, { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/mgw62l8GPb/";

function ImageClassifierComponent() {
  const [imageFile, setImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const imageRef = useRef();

  // Carrega o modelo uma vez
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Limpa o objeto URL ao desmontar ou trocar imagem
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageSrc(URL.createObjectURL(file));
      setPrediction(null);
    }
  };

  const handleClassify = async () => {
    if (!model || !imageRef.current) return;
    setIsLoading(true);
    const predictions = await model.predict(imageRef.current);
    if (predictions?.length) {
      const best = predictions.reduce((a, b) => (a.probability > b.probability ? a : b));
      setPrediction({
        className: best.className,
        probability: best.probability,
      });
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "auto",
        textAlign: "center",
        padding: 20,
        fontFamily: "sans-serif",
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#333" }}>Image Classifier</h2>
      <p style={{ color: "#666" }}>
        Select an image to classify it using a Teachable Machine model.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ margin: "10px 0" }}
      />

      {imageSrc && (
        <div style={{ marginTop: 20 }}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Selected for classification"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 4,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            crossOrigin="anonymous"
          />

          <button
            onClick={handleClassify}
            disabled={isLoading || !!prediction || !model}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              fontSize: 16,
              cursor: isLoading || !!prediction || !model ? "not-allowed" : "pointer",
              backgroundColor: isLoading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
            }}
          >
            {isLoading ? "Classifying..." : "Classify Image"}
          </button>
        </div>
      )}

      {prediction && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#f9f9f9",
            border: "1px solid #eee",
            borderRadius: 5,
          }}
        >
          <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>Results</h3>
          <p>
            <strong>Class:</strong> {prediction.className}
          </p>
          <p>
            <strong>Confidence:</strong> {(prediction.probability * 100).toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageClassifierComponent;
