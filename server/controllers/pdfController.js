const fs = require('fs');
const path = require('path');
const pdf = require('pdf-poppler');
const Tesseract = require('tesseract.js');
const { v4: uuidv4 } = require('uuid');

// Function to convert PDF to images
const convertPdfToImages = async (pdfPath, outputDir) => {
    let options = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null // Converts all pages
    };

    try {
        await pdf.convert(pdfPath, options);
    } catch (error) {
        console.error('Error during PDF to image conversion:', error);
        throw error;
    }
};

// Function to perform OCR on each image file and delete it after extraction
const performOcrAndDeleteImages = async (imageDir) => {
    const files = fs.readdirSync(imageDir);
    let extractedText = '';

    for (const file of files) {
        const filePath = path.join(imageDir, file);

        if (path.extname(file) === '.jpg') { // Only process JPEG images
            try {
                // Perform OCR on the image
                const ocrResult = await Tesseract.recognize(filePath, 'eng', {
                    tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.-/: '
                });
                extractedText += ` ${ocrResult.data.text}`;
            } catch (error) {
                console.error('Error during OCR processing:', error);
            } finally {
                // Delete the image after OCR processing
                fs.unlinkSync(filePath);
            }
        }
    }
    return extractedText.trim();
};

// Main function to process the PDF from a file path
const processPDF = async (pdfPath) => {
    const outputDir = './images';

    try {
        // Step 1: Convert PDF to images
        await convertPdfToImages(pdfPath, outputDir);

        // Step 2: Perform OCR on each image and delete each after processing
        const extractedText = await performOcrAndDeleteImages(outputDir);

        return extractedText;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
    finally {
        fs.unlinkSync(pdfPath);
    }
};

module.exports = { processPDF };