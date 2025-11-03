/**
 * Gallery Page
 * View and manage AI-generated images
 */

'use client';

import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getGalleryImages, deleteImage, type GalleryImage } from '@/lib/gallery/queries';
import { GalleryGrid } from '@/components/organisms/GalleryGrid';
import { GalleryFilterBar } from '@/components/molecules/GalleryFilterBar';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    jewelryType?: string;
    mode?: string;
    sortBy?: 'newest' | 'oldest';
    searchQuery?: string;
  }>({});

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const result = await getGalleryImages(filters);
      if (result.success && result.data) {
        setImages(result.data);
      }
      setIsLoading(false);
    };

    fetchImages();
  }, [filters]);

  // Handle delete
  const handleDelete = async (imageId: string) => {
    const result = await deleteImage(imageId);
    if (result.success) {
      // Remove from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      alert(`Failed to delete image: ${result.error}`);
    }
  };

  // Handle download
  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0B]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                <span className="text-lg font-bold">💎</span>
              </div>
              <span className="text-lg font-bold">Jewelshot</span>
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-6">
              <Link
                href="/studio"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Studio
              </Link>
              <Link href="/gallery" className="text-sm font-medium text-purple-400">
                Gallery
              </Link>
              <Link
                href="/login"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Gallery</h1>
          <p className="text-gray-400">
            {isLoading
              ? 'Loading your images...'
              : `${images.length} image${images.length !== 1 ? 's' : ''} in your gallery`}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8">
          <GalleryFilterBar onFilterChange={setFilters} />
        </div>

        {/* Gallery Grid */}
        <GalleryGrid
          images={images}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
