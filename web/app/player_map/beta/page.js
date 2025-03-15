"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function BetaGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch('/api/player-graph/beta')
      .then(res => res.json())
      .then(data => setGraphData(data));
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);
        }}
        linkDirectionalParticles={1}
        linkDirectionalParticleSpeed={0.005}
      />
    </div>
  );
}
