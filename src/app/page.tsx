'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Release, CreateReleaseInput } from '@/types/release';
import NewReleaseModal from '@/components/NewReleaseModal';

export default function Home() {
  const router = useRouter();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  const fetchReleases = async () => {
    try {
      const response = await fetch('/api/releases');
      if (response.ok) {
        const data = await response.json();
        setReleases(data);
      }
    } catch (error) {
      console.error('Failed to fetch releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRelease = async (input: CreateReleaseInput) => {
    try {
      const response = await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (response.ok) {
        await fetchReleases();
        setShowNewModal(false);
      }
    } catch (error) {
      console.error('Failed to create release:', error);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const getStatusBadge = (status: string) => {
    const config = {
      planned: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'planned' },
      ongoing: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'ongoing' },
      done: { bg: 'bg-green-50', text: 'text-green-700', label: 'done' },
    };
    const c = config[status as keyof typeof config] || config.planned;
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgress = (release: Release) => {
    const completed = release.completed_steps?.length || 0;
    const total = 8;
    const percent = Math.round((completed / total) * 100);
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${percent === 100 ? 'bg-green-500' : percent > 0 ? 'bg-blue-500' : 'bg-gray-400'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{completed}/{total}</span>
      </div>
    );
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-gray-500 text-sm">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-medium text-gray-900">Release Checklist</h1>
              <button
                onClick={() => setShowNewModal(true)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                + New release
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex justify-center py-4">
        <div className="w-full max-w-2xl px-4">
          {releases.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">No releases yet. Create your first release!</p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Release</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Progress</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {releases.map((release) => (
                    <tr key={release.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <span className="text-sm text-gray-900">{release.name}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-sm text-gray-600">{formatDate(release.date)}</span>
                      </td>
                      <td className="px-4 py-2.5">{getStatusBadge(release.status)}</td>
                      <td className="px-4 py-2.5">{getProgress(release)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => router.push(`/release/${release.id}`)}
                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showNewModal && (
        <NewReleaseModal
          onClose={() => setShowNewModal(false)}
          onSubmit={createRelease}
        />
      )}
    </div>
  );
}
