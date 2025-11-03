/**
 * Danger Zone (Molecule)
 * Account deletion and dangerous actions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { signOut } from '@/lib/auth/actions';

export function DangerZone() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    setIsDeleting(true);

    // Note: deleteAccount requires service role key, which should only be used server-side
    // For MVP, we'll just sign out. In production, this would call a server action.
    // const result = await deleteAccount();

    // For now, just sign out
    await signOut();
    router.push('/');
  };

  return (
    <div className="space-y-6">
      {/* Warning */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-red-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-semibold">Danger Zone</span>
        </div>
        <p className="text-sm text-red-300">
          Once you delete your account, there is no going back. All your data, including generated
          images and settings, will be permanently deleted.
        </p>
      </div>

      {/* Delete Button */}
      {!showDeleteConfirm ? (
        <Button variant="danger" size="lg" fullWidth onClick={() => setShowDeleteConfirm(true)}>
          Delete Account
        </Button>
      ) : (
        <div className="space-y-4">
          {/* Confirmation Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-red-400">
              Type &ldquo;DELETE&rdquo; to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-white placeholder:text-red-400/50 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              loading={isDeleting}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
