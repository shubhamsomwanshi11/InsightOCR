const fs = require('fs');
const path = require('path');
const { exportImages } = import('pdf-export-images');
const Tesseract = require('tesseract.js');
const sharp = require('sharp'); // Include sharp for image processing

// Function to convert PDF to images
const convertPdfToImages = async (pdfPath, outputDir) => {
    try {
        const images = await exportImages(pdfPath, outputDir);
        return images; // Returns an array of image paths
    } catch (error) {
        console.error('Error during PDF to image conversion:', error);
        throw error;
    }
};

// Function to process images with sharp (enhancing image quality for OCR)
const preprocessImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .grayscale() // Convert to grayscale for better OCR accuracy
            .resize({ width: 1000 }) // Resize to a fixed width to normalize input
            .sharpen() // Enhance edges
            .toFile(outputPath);
    } catch (error) {
        throw error;
    }
};

// Function to perform OCR on each image file and delete it after extraction
const performOcrAndDeleteImages = async (imageDir) => {
    const files = fs.readdirSync(imageDir);
    let extractedText = '';

    for (const file of files) {
        const filePath = path.join(imageDir, file);
        const ext = path.extname(file).toLowerCase();

        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            try {
                // Preprocess the image using sharp
                const preprocessedPath = path.join(imageDir, `processed_${file}`);
                await preprocessImage(filePath, preprocessedPath);

                // Perform OCR on the preprocessed image
                const ocrResult = await Tesseract.recognize(preprocessedPath, 'eng', {
                    tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
                });

                extractedText += ` ${ocrResult.data.text}`;

                // Delete the preprocessed image
                fs.unlinkSync(preprocessedPath);
            } catch (error) {
            } finally {
                // Delete the original image after OCR processing
                fs.unlinkSync(filePath);
            }
        }
    }

    return extractedText.trim();
};

// Main function to process the PDF from a file path
const processPDF = async (pdfPath) => {
    const uniqueId = Date.now(); // Generate a unique directory name
    const outputDir = path.join('./images', `request_${uniqueId}`);

    try {
        // Create a unique output directory
        fs.mkdirSync(outputDir, { recursive: true });

        // Step 1: Convert PDF to images
        await convertPdfToImages(pdfPath, outputDir);

        // Step 2: Perform OCR on each image and delete them after processing
        const extractedText = await performOcrAndDeleteImages(outputDir);

        return extractedText;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    } finally {
        // Delete the unique output directory and all its contents
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }

        // Delete the PDF file
        if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }
    }
};

module.exports = { processPDF };