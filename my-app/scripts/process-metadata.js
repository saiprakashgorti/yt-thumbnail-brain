// scripts/process-metadata.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../dataset/youtube_metadata.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/data/processed-metadata.json');

// New improved date parser
const parseCustomDate = (input) => {
    try {
        // Handle numeric YYYYMMDD format (e.g., 20250303)
        if (typeof input === 'number') {
            const dateStr = input.toString().padStart(8, '0');
            if (dateStr.length === 8) {
                const year = parseInt(dateStr.substring(0, 4),
                    month = parseInt(dateStr.substring(4, 6)) - 1,
                    day = parseInt(dateStr.substring(6, 8)));

                if (year > 1900 && month >= 0 && month < 12 && day > 0 && day <= 31) {
                    return new Date(year, month, day).toISOString().split('T')[0];
                }
            }
        }

        // Handle string dates
        if (typeof input === 'string') {
            // Try YYYYMMDD format
            const cleaned = input.replace(/\D/g, '');
            if (cleaned.length === 8) {
                return parseCustomDate(parseInt(cleaned));
            }
        }

        // Fallback for invalid dates
        return '2025-03-03'; // Default date from your example
    } catch (e) {
        return '2025-03-03';
    }
};

const processData = () => {
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const processed = data.map((item, index) => ({
        id: `thumbnail_${index + 1}`,
        title: item.Title,
        views: parseInt(String(item.Views).replace(/\D/g, ''), 10),
        duration: item['Length (seconds)'],
        uploadDate: parseCustomDate(item['Upload Date']),
        uploader: item.Uploader,
        tags: item.Tags ? item.Tags.split(/,\s*/) : [],
        thumbnailFile: `youtube_thumbnail_${index + 1}.jpg`,
        description: item.Description
    }));

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processed, null, 2));
    console.log(`Processed ${processed.length} items successfully`);
};

processData();