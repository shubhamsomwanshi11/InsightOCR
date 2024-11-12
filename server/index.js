const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const routes = require('./routes/routes');


const { processImage } = require('./controllers/imageController');
const { processPDF } = require('./controllers/pdfController');

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 9860;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://insightocr.vercel.app'
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});