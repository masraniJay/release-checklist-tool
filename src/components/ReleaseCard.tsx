'use client';

import { useState } from 'react';
import { Release, ReleaseStep } from '@/types/release';

interface ReleaseCardProps {
  release: Release;
  steps: readonly string[];
  onToggleStep: (id: string, step: string) => void;
  onUpdateInfo: (id: string, info: string) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  planned: 'bg-gray-100 text-gray-700',
  ongoing: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

export default function ReleaseCard({
  release,
  steps,
  onToggleStep,
  onUpdateInfo,
  onDelete,
}: ReleaseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [infoText, setInfoText] = useState(release.additional_info || '');

  const handleSaveInfo = () => {
    onUpdateInfo(release.id, infoText);
    setIsEditing(false);
  };

  const handleCancelInfo = () => {
    setInfoText(release.additional_info || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{release.name}</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[release.status]}`}
            >
              {release.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{formatDate(release.date)}</p>
        </div>
        <button
          onClick={() => onDelete(release.id)}
          className="self-start rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          Delete
        </button>
      </div>

      {/* Steps */}
      <div className="mb-4">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Checklist</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {steps.map((step) => {
            const isCompleted = release.completed_steps?.includes(step as ReleaseStep);
            return (
              <label
                key={step}
                className={`flex items-center gap-2 rounded-md border p-2.5 transition-colors cursor-pointer ${
                  isCompleted
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => onToggleStep(release.id, step)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm ${
                    isCompleted ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {step}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Additional Info</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              placeholder="Add notes about this release..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveInfo}
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelInfo}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {infoText || (
              <span className="italic text-gray-400">No additional information</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
