import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const townsDir = path.join(process.cwd(), '../data_processing/towns');
    const files = fs.readdirSync(townsDir);
    const nodes = {};
    const links = [];

    files.forEach(file => {
        if (file.endsWith('_towns_data.json')) {
            const townData = JSON.parse(fs.readFileSync(path.join(townsDir, file), 'utf8'));

            townData.forEach(town => {
                const citizens = town.citizens;

                citizens.forEach(player => {
                    // Add player as node if doesn't exist yet
                    if (!nodes[player.id]) {
                        nodes[player.id] = {
                            id: player.id,
                            name: player.name,
                            avatar: player.avatar
                        };
                    }
                });

                // Create links between all citizens in this town
                for (let i = 0; i < citizens.length; i++) {
                    for (let j = i + 1; j < citizens.length; j++) {
                        links.push({
                            source: citizens[i].id,
                            target: citizens[j].id,
                            town: town.mapName
                        });
                    }
                }
            });
        }
    });

    return NextResponse.json({
        nodes: Object.values(nodes),
        links
    });
}
