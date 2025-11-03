/**
 * Studio Page (Protected)
 * Main application workspace - will be built in Phase C
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio | Jewelshot',
  description: 'Create stunning jewelry photos with AI',
};

export default function StudioPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A0A0B] via-purple-950/20 to-[#0A0A0B]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">🎨 Studio</h1>
        <p className="mt-4 text-gray-400">Coming soon in Phase C...</p>
      </div>
    </div>
  );
}
