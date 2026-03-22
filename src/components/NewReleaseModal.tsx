'use client';

import { useState, useEffect } from 'react';
import { CreateReleaseInput } from '@/types/release';

interface NewReleaseModalProps {
  onClose: () => void;
  onSubmit: (input: CreateReleaseInput) => void;
}

export default function NewReleaseModal({ onClose, onSubmit }: NewReleaseModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    onSubmit({
      name: name.trim(),
      date: new Date(date).toISOString(),
      additional_info: additionalInfo.trim() || undefined,
    });
    setName('');
    setDate('');
    setAdditionalInfo('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-lg bg-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-medium text-gray-900">New release</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded p-1 hover:bg-gray-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Release 1.0"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Due date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Additional info</label>
            <textarea
              value={additionalInfo}
              onChange={e => setAdditionalInfo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={2}
              placeholder="Optional"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!name.trim() || !date} 
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
