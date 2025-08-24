
const fs = require('fs');
const path = require('path');

const soundsDirectory = path.join(__dirname, 'sounds');
const outputFilePath = path.join(__dirname, 'sounds-list.js');

fs.readdir(soundsDirectory, (err, files) => {
    if (err) {
        console.error('Error reading sounds directory:', err);
        return;
    }

    const sounds = files
        .filter(file => file.endsWith('.ogg'))
        .map(file => {
            const name = path.basename(file, '.ogg');
            return {
                name: name,
                path: `sounds/${file}`,
                category: 'Uncategorized'
            };
        });

    const outputContent = `const sounds = ${JSON.stringify(sounds, null, 4)};`;

    fs.writeFile(outputFilePath, outputContent, (err) => {
        if (err) {
            console.error('Error writing sounds-list.js:', err);
            return;
        }
        console.log('sounds-list.js generated successfully!');
    });
});
