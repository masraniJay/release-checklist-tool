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

const statusConfig = {
  planned: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: 'Planned',
    icon: '📝'
  },
  ongoing: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'In Progress',
    icon: '🔄'
  },
  done: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Completed',
    icon: '✅'
  },
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
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const completedCount = release.completed_steps?.length || 0;
  const totalCount = steps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const config = statusConfig[release.status];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className={`border-b ${config.border} bg-gradient-to-r ${config.bg} px-4 py-3 md:px-6`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">{release.name}</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}
            >
              <span>{config.icon}</span>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:self-end">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{formatDate(release.date)}</p>
              <p className="text-xs text-slate-500">{formatTime(release.date)}</p>
            </div>
            <button
              onClick={() => onDelete(release.id)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              title="Delete release"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Progress</span>
            <span className="text-slate-500">{completedCount} of {totalCount} steps</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? 'bg-emerald-500' : progressPercent > 0 ? 'bg-amber-500' : 'bg-slate-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4 md:p-6">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Checklist</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {steps.map((step) => {
            const isCompleted = release.completed_steps?.includes(step as ReleaseStep);
            return (
              <label
                key={step}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleStep(release.id, step)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-emerald-500 checked:bg-emerald-500"
                  />
                  <svg
                    className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span
                  className={`text-sm font-medium ${
                    isCompleted ? 'text-slate-800' : 'text-slate-600'
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
      <div className="border-t border-slate-100 bg-slate-50 p-4 md:px-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">📝 Notes</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              rows={3}
              placeholder="Add notes about this release..."
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveInfo}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={handleCancelInfo}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
            {infoText || (
              <span className="italic text-slate-400">No additional information</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
