'use strict';

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const sourcePath = path.join(__dirname, '../dist/youtube-disliked');
const outPath = path.join(__dirname, '../dist/youtube-disliked/youtube-disliked.zip');

function zipDirectory(source, out) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

if (fs.existsSync(outPath)) {
    fs.unlinkSync(outPath);
}

zipDirectory(sourcePath, outPath)
    .then(() => {
        console.log(`\n\nCreated ZIP archive for path: '${sourcePath}'.`);
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });