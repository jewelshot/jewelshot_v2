/**
 * Settings Page
 * User profile and account settings
 */

'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, uploadAvatar } from '@/lib/profile/actions';
import { AppHeader } from '@/components/organisms/AppHeader';
import { Avatar } from '@/components/atoms/Avatar';
import { ProfileForm } from '@/components/molecules/ProfileForm';
import { PasswordChangeForm } from '@/components/molecules/PasswordChangeForm';
import { StorageStats } from '@/components/molecules/StorageStats';
import { DangerZone } from '@/components/molecules/DangerZone';

export default function SettingsPage() {
  const [profile, setProfile] = useState<{
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    storage_used: number;
    ai_generation_count: number;
    created_at: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setProfile(result.data);
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);
    if (result.success && result.avatarUrl && profile) {
      setProfile({ ...profile, avatar_url: result.avatarUrl });
    } else {
      alert(result.error || 'Failed to upload avatar');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="text-center">
          <p className="text-gray-400">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <AppHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile & Avatar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="mb-6 text-center">
                <Avatar
                  src={profile.avatar_url}
                  alt={profile.full_name || 'User'}
                  size="xl"
                  editable
                  onUpload={handleAvatarUpload}
                  className="mx-auto mb-4"
                />
                <h2 className="mb-1 text-lg font-semibold text-white">
                  {profile.full_name || 'Anonymous User'}
                </h2>
                <p className="text-sm text-gray-400">{profile.email}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Member since {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

            {/* Storage Stats */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Storage & Usage</h3>
              <StorageStats
                used={profile.storage_used}
                limit={1024 * 1024 * 1024} // 1GB default limit
                generationCount={profile.ai_generation_count}
              />
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="space-y-8 lg:col-span-2">
            {/* Profile Information */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold text-white">Profile Information</h3>
              <ProfileForm
                initialData={{
                  fullName: profile.full_name,
                  email: profile.email,
                }}
              />
            </div>

            {/* Password Change */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-6 text-lg font-semibold text-white">Change Password</h3>
              <PasswordChangeForm />
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-6 text-lg font-semibold text-red-400">Danger Zone</h3>
              <DangerZone />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
