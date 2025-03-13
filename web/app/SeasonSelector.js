export default function SeasonSelector({ seasons, selectedSeason, setSelectedSeason }) {
	return (
	  <div className="mb-4">
		<label className="mr-2 font-semibold">Season:</label>
		<select
		  className="bg-gray-800 text-green-400 p-2 rounded"
		  value={selectedSeason}
		  onChange={(e) => setSelectedSeason(e.target.value)}
		>
		  {seasons.map((season) => (
			<option key={season} value={season}>
			  {season}
			</option>
		  ))}
		</select>
	  </div>
	);
  }
  