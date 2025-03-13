"use client";
import { useEffect, useState } from 'react';
import SeasonSelector from './SeasonSelector';
import SeasonDisplay from './SeasonDisplay';

export default function Home() {
  const [seasonsData, setSeasonsData] = useState({});
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    fetch('/api/towns')
      .then((res) => res.json())
      .then((data) => {
        setSeasonsData(data);
        setSelectedSeason(Object.keys(data)[0]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono p-8">
      <h1 className="text-3xl font-semibold mb-6">MyHordes Season Dashboard</h1>
      <SeasonSelector
        seasons={Object.keys(seasonsData)}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />
      <SeasonDisplay
        season={selectedSeason}
        townCount={seasonsData[selectedSeason]}
      />
    </div>
  );
}
