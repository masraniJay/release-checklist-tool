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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Release Checklist
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your release process from start to finish
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + New Release
          </button>
        </div>

        {/* Releases List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading releases...
          </div>
        ) : releases.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">No releases yet. Create your first one!</p>
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
