/**
 * Profile Form (Molecule)
 * Edit user profile information
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { updateProfile } from '@/lib/profile/actions';

interface ProfileFormProps {
  initialData: {
    fullName: string | null;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const result = await updateProfile({ full_name: fullName });

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Full Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      {/* Email (Read-only) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
        <Input type="email" value={initialData.email} disabled />
        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            message.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
        Save Changes
      </Button>
    </form>
  );
}
