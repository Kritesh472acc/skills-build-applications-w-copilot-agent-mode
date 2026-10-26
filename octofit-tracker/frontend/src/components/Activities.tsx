import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Activity = { _id?: string; type: string; minutes: number; points: number };

export default function Activities() {
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    getJson<{ activities: Activity[] }>('/api/activities').then(
      (data) => { if (active) setActivities(data.activities); },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="activities-heading">
      <h2 id="activities-heading" className="h4">Activities</h2>
      {error ? <p role="alert">Unable to load activities.</p> : activities === null ? (
        <p role="status">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p>No activities yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <caption className="visually-hidden">Recorded activities</caption>
            <thead><tr><th scope="col">Activity</th><th scope="col">Minutes</th><th scope="col">Points</th></tr></thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={activity._id ?? index}>
                  <td>{activity.type}</td><td>{activity.minutes}</td><td>{activity.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
