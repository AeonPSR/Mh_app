import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'mh_user',
  host: 'localhost',
  database: 'mh_player_graph',
  password: 'yourpassword',
  port: 5432,
});

export async function GET(request, context) {
  const { season } = await context.params; // Await params explicitly

  const client = await pool.connect();
  try {
    const playersRes = await client.query(`
      SELECT DISTINCT p.id, p.name, p.avatar
      FROM players p
      INNER JOIN player_links pl ON p.id IN (pl.player1_id, pl.player2_id)
      WHERE pl.season = $1
    `, [season]);
//LIMIT 100
    const linksRes = await client.query(`
      SELECT player1_id AS source, player2_id AS target
      FROM player_links
      WHERE season = $1
    `, [season]);
//LIMIT 100
    return NextResponse.json({
      nodes: playersRes.rows,
      links: linksRes.rows,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load graph data' }, { status: 500 });
  } finally {
    client.release();
  }
}

// Required to dynamically parse params in Next.js App Router
export async function generateStaticParams() {
  return [{ season: 'beta' }, { season: 'alpha' }, { season: 's15' }, { season: 's16' }];
}
