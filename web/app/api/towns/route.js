import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const townsDir = path.join(process.cwd(), '../data_processing/towns');
    const townCounts = {};

    try {
        const files = fs.readdirSync(townsDir);

        files.forEach(file => {
            if (file.endsWith('_towns_data.json')) {
                const season = file.replace('_towns_data.json', '');
                const filePath = path.join(townsDir, file);
                const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                if (Array.isArray(fileData)) {
                    townCounts[season] = fileData.length;
                }
            }
        });

        return NextResponse.json(townCounts);
    } catch (error) {
        console.error('Failed to read town data:', error);
        return NextResponse.json({ error: 'Unable to fetch town data.' }, { status: 500 });
    }
}
