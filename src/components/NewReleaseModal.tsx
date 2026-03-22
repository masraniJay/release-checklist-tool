'use client';

import { useState, useRef, useEffect } from 'react';
import { CreateReleaseInput } from '@/types/release';

interface NewReleaseModalProps {
  onClose: () => void;
  onSubmit: (input: CreateReleaseInput) => void;
}

export default function NewReleaseModal({ onClose, onSubmit }: NewReleaseModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Prevent backdrop click when interacting with datetime picker
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Don't close if clicking on the modal content
    if (modalRef.current && modalRef.current.contains(e.target as Node)) {
      return;
    }
    // Don't close if clicking on a datetime picker popup
    const target = e.target as HTMLElement;
    if (target.closest('[role="dialog"]') || target.closest('.react-datepicker') || target.closest('input[type="datetime-local"]')) {
      return;
    }
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Focus name input on mount
  useEffect(() => {
    setTimeout(() => {
      const nameInput = document.getElementById('release-name');
      nameInput?.focus();
    }, 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    onSubmit({
      name: name.trim(),
      date: new Date(date).toISOString(),
      additional_info: additionalInfo.trim() || undefined,
    });

    // Reset form
    setName('');
    setDate('');
    setAdditionalInfo('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="flex w-full max-w-lg flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="rounded-t-2xl bg-white px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Create New Release</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - scrollable */}
        <div 
          ref={contentRef}
          className="overflow-y-auto bg-white px-6 py-4"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="release-name" className="mb-2 block text-sm font-semibold text-slate-700">
                Release Name <span className="text-red-500">*</span>
              </label>
              <input
                id="release-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="e.g., Release 1.0"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="release-date" className="mb-2 block text-sm font-semibold text-slate-700">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                id="release-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                required
              />
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="release-info" className="mb-2 block text-sm font-semibold text-slate-700">
                Notes <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="release-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                rows={4}
                placeholder="Add any notes about this release..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || !date}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-200"
              >
                Create Release
              </button>
            </div>
          </form>
        </div>

        {/* Footer - fixed */}
        <div className="rounded-b-2xl bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Press <kbd className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to cancel
          </p>
        </div>
      </div>
    </div>
  );
}
