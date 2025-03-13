"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function PlayerGraph() {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    fetch('/api/player-graph')
      .then(res => res.json())
      .then(data => setGraphData(data));
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900">
      {graphData && (
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={node => node.name}
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
        />
      )}
    </div>
  );
}
