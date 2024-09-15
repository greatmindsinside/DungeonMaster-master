import express, { json } from "express";
import cors from "cors";
import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(json());

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Securely store your API key on the server
});

// Function to query Hugging Face API
async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.blob(); // Get the result as a blob
  return result;
}

// Route to generate text (new route)
app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Specify the model you want to use
      messages: [{ role: "user", content: prompt }],
    });

    res.json(response); // Send the response back to the React app
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

// Route to generate an image using Hugging Face API
app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body

  try {
    const imageBlob = await query({ inputs: prompt });

    // Convert the Blob into a base64 string to send as a response
    const buffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Send the image as a base64-encoded string in the response
    res.json({ image: base64Image });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
