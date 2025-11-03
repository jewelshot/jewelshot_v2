/**
 * Studio Page
 * Main application workspace
 */

import type { Metadata } from 'next';
import { StudioLayout } from '@/components/templates/StudioLayout';

export const metadata: Metadata = {
  title: 'Studio | Jewelshot',
  description: 'Create stunning jewelry photos with AI',
};

export default function StudioPage() {
  return <StudioLayout />;
}
