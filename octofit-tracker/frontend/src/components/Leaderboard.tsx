import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Entry = { teamName: string; totalPoints: number; rank: number };

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ leaderboard: Entry[] }>('/api/leaderboard').then(
      (data) => { if (active) setEntries(data.leaderboard); },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading" className="h4">Leaderboard</h2>
      {error ? <p role="alert">Unable to load leaderboard.</p> : entries === null ? (
        <p role="status">Loading leaderboard...</p>
      ) : entries.length === 0 ? (
        <p>No rankings yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <caption className="visually-hidden">Team rankings by total activity points</caption>
            <thead><tr><th scope="col">Rank</th><th scope="col">Team</th><th scope="col">Points</th></tr></thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.rank}>
                  <td>{entry.rank}</td><th scope="row">{entry.teamName}</th><td>{entry.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
