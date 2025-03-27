// scripts/preprocess.js
const Jimp = require('jimp');
const { createWorker } = require('tesseract.js');

const analyzeThumbnail = async (imagePath) => {
    const image = await Jimp.read(imagePath);
    const worker = await createWorker();

    // Text detection
    await worker.loadLanguage('eng');
    const { data: { text } } = await worker.recognize(imagePath);

    // Color analysis
    const dominantColor = image.getPixelColor(0, 0);

    return {
        hasText: text.length > 0,
        primaryColor: Jimp.intToRGBA(dominantColor),
        contrastRatio: image.contrast()
    };
};