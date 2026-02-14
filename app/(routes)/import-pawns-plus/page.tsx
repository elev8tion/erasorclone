'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportPawnsPlus() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleImport = async () => {
    setLoading(true);
    setStatus('Generating visualizations...');

    try {
      const response = await fetch('/api/import-visualizations', {
        method: 'POST'
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Importing to localStorage...');

        // Import to localStorage
        localStorage.setItem('erasor_users', JSON.stringify(result.data.users));
        localStorage.setItem('erasor_teams', JSON.stringify(result.data.teams));

        // Merge with existing files
        const existingFiles = JSON.parse(localStorage.getItem('erasor_files') || '[]');
        const allFiles = [...existingFiles, ...result.data.files];
        localStorage.setItem('erasor_files', JSON.stringify(allFiles));

        // Set current user and team if not exists
        if (!localStorage.getItem('erasor_current_user')) {
          localStorage.setItem('erasor_current_user', JSON.stringify(result.data.currentUser));
        }
        if (!localStorage.getItem('erasor_current_team')) {
          localStorage.setItem('erasor_current_team', JSON.stringify(result.data.currentTeam));
        }

        setStatus(`✅ Successfully imported ${result.data.files.length} files!`);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setStatus('❌ Error importing files: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Import Pawns Plus Visualizations
        </h1>
        <p className="text-gray-300 mb-8">
          This will import 8 comprehensive visualization files for the Pawns Plus backend:
        </p>

        <ul className="text-left text-gray-400 mb-8 space-y-2">
          <li>📊 1. Database Schema ERD</li>
          <li>🏗️ 2. API Architecture</li>
          <li>🔐 3. Authentication & JWT Flow</li>
          <li>🎫 4. Pawn Ticket Creation Flow</li>
          <li>👤 5. Customer Management</li>
          <li>📦 6. Inventory System</li>
          <li>💰 7. Store Transactions</li>
          <li>🎯 8. Use Case Layer (CQRS)</li>
        </ul>

        {status && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg text-white">
            {status}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Importing...' : 'Import Visualizations'}
        </button>

        <p className="text-gray-500 mt-4 text-sm">
          Files will be added to your dashboard
        </p>
      </div>
    </div>
  );
}
