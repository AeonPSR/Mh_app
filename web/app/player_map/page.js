"use client";
import PlayerGraph from '../PlayerGraph';

export default function GraphPage() {
  return (
    <div className="bg-gray-900 text-green-400 font-mono">
      <h1 className="text-3xl p-4">Player Interaction Graph</h1>
      <PlayerGraph />
    </div>
  );
}
