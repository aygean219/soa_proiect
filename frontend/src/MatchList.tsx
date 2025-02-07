import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Match } from "./Types.tsx";

const MatchList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/matches/matches")
      .then((res) => res.json())
      .then((fetchedMatches) => setMatches(fetchedMatches));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Matches</h1>
        {!auth.isAuthenticated && (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Log in
          </button>
        )}
      </div>

      {auth.isAuthenticated ? (
        <p className="text-green-600 mb-4">Welcome back {auth.email} !</p>
      ) : (
        <p className="text-red-600 mb-4">
          Please log in before viewing match details
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match._id}
            className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold">{match.tournament}</h2>
            <p className="text-gray-700">
              {match.player1} <span className="font-bold">vs</span>{" "}
              {match.player2}
            </p>
            {auth.isAuthenticated && (
              <button
                onClick={() => navigate(`/matches/${match._id}`)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                See details
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList;
