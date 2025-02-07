import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Match } from "./Types.tsx"; // Assuming you have a Match type defined
import { useAuth } from "./AuthContext.tsx";

const MatchDetailsPage = () => {
  const { matchId } = useParams(); // Capture the match ID from URL
  const [match, setMatch] = useState<Match | null>(null);

  // Fetch the specific match data when the component is mounted or when matchId changes
  useEffect(() => {
    fetch(`http://localhost/matches/matches/${matchId}`) // Update to your backend endpoint for fetching a match
      .then((res) => res.json())
      .then((fetchedMatch) => setMatch(fetchedMatch));
  }, [matchId]);

  const auth = useAuth();

  const onBuyTicket = () => {
    // Assuming there's an endpoint to purchase a ticket for the match
    fetch(`http://localhost/tickets/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: auth.token }), // Pass the user's auth token
    })
      .then(() => {
        alert("Ticket purchased successfully!");
      })
      .catch((err) => {
        console.log(err);
        alert("Could not buy ticket!");
      });
  };

  if (!match) {
    return <div>Loading match details...</div>; // Show a loading message while fetching match data
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{match.tournament}</h2>
        <p className="text-xl mb-2">
          {match.player1} <span className="font-bold">vs</span> {match.player2}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {match.court}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {new Date(match.date).toLocaleString()}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Price:</strong> ${match.price}
        </p>

        {auth.isAuthenticated ? (
          <button
            onClick={onBuyTicket}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Buy Ticket
          </button>
        ) : (
          <p className="text-red-600 mt-4">Please log in to buy a ticket.</p>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPage;
