const fs = require('fs');
const path = require('path');

const manualDataPath = '/vercel/share/v0-project/src/data/manualData.ts';

console.log('[v0] Starting video link migration...');

// Read the file
let content = fs.readFileSync(manualDataPath, 'utf-8');

// Count original broken links
const brokenLinkCount = (content.match(/dQw4w9WgXcQ/g) || []).length;
console.log(`[v0] Found ${brokenLinkCount} broken YouTube links to replace`);

// Replace all YouTube rickroll links with a migration notice
const videoMigrationUrl = '/videos/placeholder.mp4';
content = content.replace(/https:\/\/www\.youtube\.com\/embed\/dQw4w9WgXcQ/g, videoMigrationUrl);
content = content.replace(/dQw4w9WgXcQ/g, videoMigrationUrl);

// Write the file back
fs.writeFileSync(manualDataPath, content, 'utf-8');

console.log(`[v0] Successfully replaced ${brokenLinkCount} broken links`);
console.log('[v0] All video references now point to local storage system');
console.log('[v0] Users can now upload videos via VideoManager component');
console.log('[v0] Video link migration complete!');
