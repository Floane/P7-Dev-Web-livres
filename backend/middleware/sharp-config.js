const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const inputPath = req.file.path;
    const outputFilename = req.file.filename.split('.')[0] + '.webp';
    const outputPath = path.join('images', outputFilename);

    sharp(inputPath)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
            fs.unlink(inputPath, () => {});
            req.file.filename = outputFilename;
            req.file.path = outputPath;
            next();
        })
        .catch(error => res.status(500).json({ error }));
};