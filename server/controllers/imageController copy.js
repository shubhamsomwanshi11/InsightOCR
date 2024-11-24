const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');
const processImage = async (filePath) => {
    try {
        // Read the file as a buffer to avoid file locking issues
        const data = await fs.promises.readFile(filePath);

        // Process the image in memory with sharp
        const processedImageBuffer = await sharp(data)
            .resize({ width: 2000 })
            .grayscale()
            .toFormat('jpeg', { quality: 40 })  
            .toBuffer();

        // Use Tesseract to extract text from the processed image buffer
        const result = await Tesseract.recognize(processedImageBuffer, 'eng', {
            tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.-/: ',
        });

        // Delete the original image file after processing
        await fs.promises.unlink(filePath);

        return result.data.text || '';
    } catch (error) {
        console.error('Error processing image:', error);

        // Ensure the file is deleted even if there was an error
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }

        throw error;
    }
};

module.exports = { processImage };