'use client';

import { useEffect, useState } from 'react';
import { Release, CreateReleaseInput, RELEASE_STEPS } from '@/types/release';
import ReleaseCard from '@/components/ReleaseCard';
import NewReleaseModal from '@/components/NewReleaseModal';

export default function Home() {
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

  const deleteRelease = async (id: string) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchReleases();
      }
    } catch (error) {
      console.error('Failed to delete release:', error);
    }
  };

  const toggleStep = async (id: string, step: string) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle_step: step }),
      });
      if (response.ok) {
        await fetchReleases();
      }
    } catch (error) {
      console.error('Failed to toggle step:', error);
    }
  };

  const updateAdditionalInfo = async (id: string, additionalInfo: string) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additional_info: additionalInfo }),
      });
      if (response.ok) {
        await fetchReleases();
      }
    } catch (error) {
      console.error('Failed to update additional info:', error);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header - Fixed at top */}
        <div className="sticky top-0 z-10 mb-6 flex flex-col gap-4 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
              🚀 Release Checklist
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your releases, one step at a time
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:scale-95"
          >
            + New Release
          </button>
        </div>

        {/* Releases List */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
            <div className="text-center">
              <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="text-slate-500">Loading releases...</p>
            </div>
          </div>
        ) : releases.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12">
            <span className="mb-4 text-5xl">📋</span>
            <h3 className="mb-2 text-lg font-semibold text-slate-700">No releases yet</h3>
            <p className="text-slate-500">Create your first release to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                steps={RELEASE_STEPS}
                onToggleStep={toggleStep}
                onUpdateInfo={updateAdditionalInfo}
                onDelete={deleteRelease}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Release Modal */}
      {showNewModal && (
        <NewReleaseModal
          onClose={() => setShowNewModal(false)}
          onSubmit={createRelease}
        />
      )}
    </div>
  );
}
