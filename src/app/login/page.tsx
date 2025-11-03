/**
 * Login Page
 */

import type { Metadata } from 'next';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { LoginForm } from '@/components/organisms/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Jewelshot',
  description: 'Sign in to your Jewelshot account',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
