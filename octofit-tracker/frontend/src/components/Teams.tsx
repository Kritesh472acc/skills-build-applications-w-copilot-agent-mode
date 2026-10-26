import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Team = { _id?: string; name: string; mascot?: string; members: string[] };

export default function Teams() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ teams: Team[] }>('/api/teams').then(
      (data) => { if (active) setTeams(data.teams); },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="teams-heading">
      <h2 id="teams-heading" className="h4">Teams</h2>
      {error ? <p role="alert">Unable to load teams.</p> : teams === null ? (
        <p role="status">Loading teams...</p>
      ) : teams.length === 0 ? (
        <p>No teams yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <caption className="visually-hidden">Teams and membership totals</caption>
            <thead><tr><th scope="col">Team</th><th scope="col">Mascot</th><th scope="col">Members</th></tr></thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team._id ?? index}>
                  <th scope="row">{team.name}</th><td>{team.mascot ?? 'Not specified'}</td><td>{team.members.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
