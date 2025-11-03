/**
 * Signup Page
 */

import type { Metadata } from 'next';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { SignupForm } from '@/components/organisms/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up | Jewelshot',
  description: 'Create your Jewelshot account',
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
