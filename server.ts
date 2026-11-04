import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Google Gen AI client on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Multi-turn Gemini Chatbot Endpoint
 */
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.8-flash', persona = 'companion', studentName = 'Student' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Ensure valid non-deprecated model name
    const validModel = model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

    if (!aiClient) {
      return res.status(200).json({
        fallback: true,
        reply: `Hello ${studentName}, I'm right here with you. Take a slow breath. You don't have to carry all this academic pressure alone. How are you feeling right in this moment?`,
        model: validModel,
      });
    }

    const systemInstruction = `You are Soothely AI, a deeply empathetic, kind, and practical student companion for school and college students. 
You specialize in helping students with:
1. Exam anxiety, fear of failure, and post-exam disappointment
2. Procrastination freeze and breaking down overwhelming homework into 15-minute unhurried micro-steps
3. Imposter syndrome in classes and seminars
4. Burnout and reminding students that rest is biologically necessary for learning.

Style: Warm, emotionally validating, conversational, never clinical or robotic, never lecturing or scolding. Address the student as "${studentName}".
Safety: If the student expresses acute crisis or thoughts of self-harm, gently provide immediate crisis numbers: Call/text 988 or text HOME to 741741.`;

    // Map conversation history to contents
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await aiClient.models.generateContent({
      model: validModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "I'm right here with you. Take a slow breath.";

    return res.json({
      reply: replyText,
      model: validModel,
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(200).json({
      fallback: true,
      error: error.message || 'Error communicating with Gemini model',
      reply: `Take a gentle breath. While connecting to the server, I want you to remember: you are not defined by single test scores, and doing just 5 minutes of study today is enough to rebuild momentum.`,
    });
  }
});

/**
 * Music Generation Endpoint (Lyria Preview + Ambient Synthesis fallback)
 */
app.post('/api/music/generate', async (req, res) => {
  try {
    const { prompt = 'Gentle lo-fi ambient study music with soft rain and piano', duration = 'clip' } = req.body;
    const model = duration === 'full' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

    if (!aiClient) {
      return res.status(200).json({
        success: true,
        mode: 'procedural',
        message: 'Procedural study soundscape active. You can generate custom calming tones with the built-in ambient synthesizer.',
        prompt,
      });
    }

    try {
      const response = await aiClient.models.generateContentStream({
        model,
        contents: prompt,
      });

      const audioChunks: Buffer[] = [];
      let lyrics = '';
      let mimeType = 'audio/mpeg';

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (audioChunks.length === 0 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
          }
          if (part.text) {
            lyrics += part.text;
          }
        }
      }

      if (audioChunks.length > 0) {
        const audioBase64 = Buffer.concat(audioChunks).toString('base64');
        return res.json({
          success: true,
          mode: 'lyria',
          audioDataUrl: `data:${mimeType};base64,${audioBase64}`,
          lyrics,
          model,
        });
      } else {
        return res.json({
          success: true,
          mode: 'procedural',
          message: 'Audio generation completed with procedural ambient synthesis.',
        });
      }
    } catch (lyriaErr: any) {
      console.warn('Lyria API not accessible or paid key declined. Using procedural ambient studio fallback:', lyriaErr.message);
      return res.json({
        success: true,
        mode: 'procedural',
        fallback: true,
        message: 'Using Soothely procedural audio synthesizer for study sessions.',
        errorNotice: lyriaErr.message,
      });
    }
  } catch (error: any) {
    console.error('Music generation route error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate music' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const portNumber = Number(PORT) || 3000;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Soothely AI Server listening on port ${portNumber}`);
  });
}

startServer();
