export default function SeasonDisplay({ season, townCount }) {
	if (!season) return <p className="text-gray-500">Select a season...</p>;
  
	return (
	  <div className="bg-gray-800 text-green-400 p-4 rounded">
		<h2 className="text-xl font-bold mb-2">Season "{season}"</h2>
		<p className="text-lg">
		  Number of towns: <span className="font-semibold">{townCount}</span>
		</p>
	  </div>
	);
  }
  