import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Workout = { _id?: string; title: string; reason: string; minutes?: number; difficulty?: string };

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const userEmail = 'mona@example.com';
    getJson<{ suggestions: Workout[] }>(`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`).then(
      (data) => { if (active) setWorkouts(data.suggestions); },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="workouts-heading">
      <h2 id="workouts-heading" className="h4">Workout suggestions</h2>
      {error ? <p role="alert">Unable to load workout suggestions.</p> : workouts === null ? (
        <p role="status">Loading workout suggestions...</p>
      ) : workouts.length === 0 ? (
        <p>No workout suggestions yet.</p>
      ) : (
        <ul className="list-group list-group-flush">
          {workouts.map((workout, index) => (
            <li className="list-group-item px-0" key={workout._id ?? index}>
              <h3 className="h5">{workout.title}</h3>
              <p>{workout.reason}</p>
              {workout.minutes !== undefined && <p className="mb-1">{workout.minutes} minutes</p>}
              {workout.difficulty && <p className="mb-0">Difficulty: {workout.difficulty}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
