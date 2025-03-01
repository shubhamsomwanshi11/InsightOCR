import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { processImage } from './controllers/imageController.mjs';
import { processPDF } from './controllers/pdfController.mjs';

dotenv.config();
let model;
try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
} catch (error) {
    console.error("Error initializing GoogleGenerativeAI:", error);
}


const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 9860;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://insightocr.vercel.app', 'https://insightocr.onrender.com']
}));

app.post('/extract', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        let extractedText;

        if (file.mimetype === 'application/pdf') {
            extractedText = await processPDF(file.path);
            // return res.status(400).json({ error: 'Unsupported file type' });
        } else if (file.mimetype.startsWith('image/')) {
            extractedText = await processImage(file.path);
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        if (!extractedText.trim()) {
            return res.status(500).json({ error: 'Failed to extract text from the file' });
        }

        const prompt = JSON.stringify(`Analyze the provided text, and extract only relevant key-value pairs. If a field is present but incorrectly labeled, correct it. If any text is irrelevant to these fields, ignore it entirely. Provide only a structured JSON object as the. If no relevant information is found, respond with an empty JSON object "{}" and nothing else. Text to analyze: "${extractedText}".`);

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (aiError) {
            console.error('Error during AI generation:', aiError);
            return res.status(500).json({ error: 'Error generating content from AI' });
        }

        if (result && result?.response?.candidates[0]?.content?.parts[0]?.text) {
            const extractedData = result?.response?.candidates[0]?.content?.parts[0]?.text;
            res.json({ extractedData: extractedData });
        } else {
            return res.status(500).json({ error: 'Failed to generate response', prompt: prompt });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error extracting data or generating output' });
    }
});

app.get('/health', (req, res) => {  
    res.json({ status: 'ok' });
});


const PING_INTERVAL = 14 * 60 * 1000;
setInterval(async () => {
    try {
        const response = await axios.get('https://insightocr.onrender.com/health');
        console.log(`Self-ping successful: ${response.status}`);
    } catch (error) {
        console.error('Self-ping failed:', error);
    }
}, PING_INTERVAL);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});