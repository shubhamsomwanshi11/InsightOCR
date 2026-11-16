import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { processImage } from './controllers/imageController.mjs';
import { processPDF } from './controllers/pdfController.mjs';

dotenv.config();

// The model is configurable because Gemini model versions are retired over time.
// "gemini-flash-latest" is Google's alias for the current Flash model.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 10);

let model;
try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        // Ask for raw JSON so the response can be parsed without stripping markdown fences.
        generationConfig: { responseMimeType: 'application/json' },
    });
} catch (error) {
    console.error("Error initializing GoogleGenerativeAI:", error);
}


const app = express();
const upload = multer({ dest: 'uploads/', limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 } });

const PORT = process.env.PORT || 9860;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://insightocr.vercel.app', 'https://insightocr.onrender.com']
}));

// Rejects files over the size limit with 413 instead of a generic 500.
const uploadSingleFile = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: `File is larger than ${MAX_FILE_SIZE_MB} MB` });
        }
        if (err) {
            return next(err);
        }
        next();
    });
};

app.post('/extract', uploadSingleFile, async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        let extractedText;

        if (file.mimetype === 'application/pdf') {
            extractedText = await processPDF(file.path);
        } else if (file.mimetype.startsWith('image/')) {
            extractedText = await processImage(file.path);
        } else {
            // The processors delete the upload when they finish; do it here for rejected files.
            await fs.promises.unlink(file.path).catch(() => {});
            return res.status(400).json({ error: 'Unsupported file type' });
        }

        if (!extractedText.trim()) {
            return res.status(422).json({ error: 'No text could be read from the file' });
        }

        const prompt = `Analyze the text below and extract only the relevant key-value pairs. If a field is present but incorrectly labeled, correct the label. Ignore text that does not belong to any field. Respond with a single JSON object and nothing else. If no relevant information is found, respond with {}.

Text to analyze:
"""
${extractedText}
"""`;

        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (aiError) {
            console.error(`Error during AI generation (model ${GEMINI_MODEL}):`, aiError);
            return res.status(502).json({ error: 'Error generating content from AI' });
        }

        if (result && result?.response?.candidates[0]?.content?.parts[0]?.text) {
            const extractedData = result?.response?.candidates[0]?.content?.parts[0]?.text;
            res.json({ extractedData: extractedData });
        } else {
            return res.status(502).json({ error: 'The AI model returned an empty response' });
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