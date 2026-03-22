'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Release, RELEASE_STEPS } from '@/types/release';

export default function ReleaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(({ id: releaseId }) => {
      setId(releaseId);
      fetchRelease(releaseId);
    });
  }, [params]);

  const fetchRelease = async (releaseId: string) => {
    try {
      const response = await fetch(`/api/releases/${releaseId}`);
      if (response.ok) {
        const data = await response.json();
        setRelease(data);
        setInfoText(data.additional_info || '');
      }
    } catch (error) {
      console.error('Failed to fetch release:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = async (step: string) => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle_step: step }),
      });
      if (response.ok) {
        const data = await response.json();
        setRelease(data);
      }
    } catch (error) {
      console.error('Failed to toggle step:', error);
    }
  };

  const saveInfo = async () => {
    try {
      const response = await fetch(`/api/releases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ additional_info: infoText }),
      });
      if (response.ok) {
        const data = await response.json();
        setRelease(data);
        setIsEditingInfo(false);
      }
    } catch (error) {
      console.error('Failed to save info:', error);
    }
  };

  const deleteRelease = async () => {
    if (!confirm('Delete this release?')) return;
    try {
      await fetch(`/api/releases/${id}`, { method: 'DELETE' });
      router.push('/');
    } catch (error) {
      console.error('Failed to delete release:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-gray-500 text-sm">Loading...</div>;
  }

  if (!release) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <button onClick={() => router.push('/')} className="text-blue-600 text-sm">Go back</button>
      </div>
    );
  }

  const completedCount = release.completed_steps?.length || 0;
  const totalCount = RELEASE_STEPS.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return { bg: 'bg-green-50', text: 'text-green-700', label: 'done' };
      case 'ongoing': return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'ongoing' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'planned' };
    }
  };

  const statusColor = getStatusColor(release.status);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="flex justify-center">
          <div className="w-full max-w-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-900">Release details</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex justify-center py-4">
        <div className="w-full max-w-lg px-4">
          {/* Release Header */}
          <div className="mb-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-base font-medium text-gray-900">{release.name}</h1>
                <p className="text-xs text-gray-500 mt-1">{formatDate(release.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                  {statusColor.label}
                </span>
                <button onClick={deleteRelease} className="text-xs text-gray-500 hover:text-gray-700">
                  Delete
                </button>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-700">Progress</span>
                <span className="text-gray-500">{completedCount} / {totalCount} steps completed</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    completedCount === totalCount ? 'bg-green-500' : completedCount > 0 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="border border-gray-200 rounded-lg mb-4">
            <div className="px-4 py-2 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900">Checklist</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {RELEASE_STEPS.map((step) => {
                const isCompleted = release.completed_steps?.includes(step as never);
                return (
                  <label key={step} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleStep(step)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm flex-1 ${isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                      {step}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="border border-gray-200 rounded-lg">
            <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">Additional info</h2>
              {!isEditingInfo && (
                <button onClick={() => setIsEditingInfo(true)} className="text-xs text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              )}
            </div>
            <div className="px-4 py-3">
              {isEditingInfo ? (
                <div>
                  <textarea
                    value={infoText}
                    onChange={(e) => setInfoText(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={saveInfo} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingInfo(false);
                        setInfoText(release.additional_info || '');
                      }}
                      className="px-3 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${infoText ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                  {infoText || 'No additional information'}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
