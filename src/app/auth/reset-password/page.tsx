/**
 * Reset Password Page
 */

import type { Metadata } from 'next';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Jewelshot',
  description: 'Set your new password',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
