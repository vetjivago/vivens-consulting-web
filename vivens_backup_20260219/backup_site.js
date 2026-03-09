
import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://www.vivenslab.com';
const BACKUP_DIR = './backup';

// Helper to download key files
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => { }); // Delete partial file
                console.error(`Failed to download ${url}: ${response.statusCode}`);
                resolve(false);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded: ${url}`);
                    resolve(true);
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            console.error(`Error downloading ${url}: ${err.message}`);
            reject(err);
        });
    });
};

// Main function
async function backup() {
    console.log('Starting backup...');

    // 1. Get index.html
    const indexDest = path.join(BACKUP_DIR, 'index.html');
    await downloadFile(BASE_URL, indexDest);

    // 2. Read index.html to find assets
    const indexContent = fs.readFileSync(indexDest, 'utf-8');

    // Regex to find assets (css, js, images in assets folder)
    // Looking for /assets/filename.ext
    const assetRegex = /\/assets\/[\w-]+\.\w+/g;
    const matches = indexContent.match(assetRegex) || [];

    const uniqueAssets = [...new Set(matches)];

    console.log(`Found ${uniqueAssets.length} assets to download.`);

    for (const assetPath of uniqueAssets) {
        const url = `${BASE_URL}${assetPath}`;
        const fileName = path.basename(assetPath);
        const dest = path.join(BACKUP_DIR, 'assets', fileName);

        await downloadFile(url, dest);
    }

    console.log('Backup complete.');
}

backup();
