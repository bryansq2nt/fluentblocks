"use client";

import { useEffect, useState } from "react";

interface UserProgress {
  id: string;
  userId: string;
  levelId: string;
  completed: boolean;
  score: number;
  lastAttempt: string;
  attempts: number;
}

export default function AirtableTestPage() {
  const [data, setData] = useState<UserProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Error fetching data");
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json.progress || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Airtable Test Page</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <table className="w-full border mt-4">
          <thead>
            <tr>
              <th className="border px-2">ID</th>
              <th className="border px-2">User</th>
              <th className="border px-2">Level</th>
              <th className="border px-2">Completed</th>
              <th className="border px-2">Score</th>
              <th className="border px-2">Last Attempt</th>
              <th className="border px-2">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="border px-2">{row.id}</td>
                <td className="border px-2">{row.userId}</td>
                <td className="border px-2">{row.levelId}</td>
                <td className="border px-2">{row.completed ? "Yes" : "No"}</td>
                <td className="border px-2">{row.score}</td>
                <td className="border px-2">{row.lastAttempt}</td>
                <td className="border px-2">{row.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 