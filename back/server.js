import express from 'express';
import { GoogleGenAI, Modality } from "@google/genai";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Configurar CORS para permitir requisições do seu frontend (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));

// Carrega a chave de API da variável de ambiente
const geminiApiKey = process.env.GEMINI_API_KEY || '';

if (!geminiApiKey) {
  console.error("Erro: A chave de API do Gemini não foi configurada. Certifique-se de que o arquivo .env está presente e contém GEMINI_API_KEY.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// Endpoint para melhorar o esboço
app.post('/api/melhorar-esboco', async (req, res) => {
  const { prompt, inlineData } = req.body;

  if (!prompt || !inlineData || !inlineData.data || !inlineData.mimeType) {
    return res.status(400).json({ error: 'Dados incompletos. Requer prompt e inlineData (mimeType e data).' });
  }

  try {
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: inlineData.mimeType,
          data: inlineData.data,
        },
      },
    ];

    console.log("Chamando a API do Gemini para gerar uma imagem...");

    // Refatorado para usar 'config' e 'responseModalities' como no seu exemplo
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const resultPart = response.candidates[0].content.parts.find(part => part.inlineData);
    const textPart = response.candidates[0].content.parts.find(part => part.text);

    if (resultPart && resultPart.inlineData) {
      res.json({
        success: true,
        imageData: resultPart.inlineData.data,
        mimeType: resultPart.inlineData.mimeType,
        text: textPart?.text // Opcional, caso queira retornar texto também
      });
    } else {
      res.status(500).json({ error: 'A API não retornou uma imagem, ou a resposta não está no formato esperado.' });
    }

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor de backend rodando em http://localhost:${port}`);
  console.log('Endpoint para melhoria de esboços: POST /api/melhorar-esboco');
});
