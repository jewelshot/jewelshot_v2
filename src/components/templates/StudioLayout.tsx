/**
 * Studio Layout (Template)
 * Main studio interface structure
 */

'use client';

import { AppHeader } from '@/components/organisms/AppHeader';
import { StudioLeftSidebar } from '@/components/organisms/StudioLeftSidebar';
import { StudioRightSidebar } from '@/components/organisms/StudioRightSidebar';
import { Canvas } from '@/components/organisms/Canvas';

export function StudioLayout() {
  return (
    <div className="flex h-screen flex-col bg-[#0A0A0B]">
      {/* Unified Header */}
      <AppHeader />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <StudioLeftSidebar />

        {/* Canvas Area */}
        <main className="flex-1 p-6">
          <Canvas />
        </main>

        {/* Right Sidebar */}
        <StudioRightSidebar />
      </div>
    </div>
  );
}
