import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url, "http://localhost");
    const season = searchParams.get("season");

    if (!season) {
        return NextResponse.json({ error: "Season parameter is required" }, { status: 400 });
    }

    const graphPath = path.join(process.cwd(), `../data_processing/player_graphs/${season}_graph.json`);

    try {
        const graphData = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
        return NextResponse.json(graphData);
    } catch (error) {
        console.error(`Error loading graph for season ${season}:`, error);
        return NextResponse.json({ error: `Graph data for season ${season} not available` }, { status: 404 });
    }
}
