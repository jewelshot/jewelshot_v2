/**
 * Forgot Password Page
 */

import type { Metadata } from 'next';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | Jewelshot',
  description: 'Reset your Jewelshot password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
