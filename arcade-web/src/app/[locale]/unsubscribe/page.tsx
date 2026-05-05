import { Suspense } from 'react';
import UnsubscribeClient from './UnsubscribeClient';

export const metadata = {
  title: 'Manage Email Preferences',
  description: 'Update your newsletter preferences or unsubscribe.',
};

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground opacity-50 text-lg font-medium">Loading...</div>
      </div>
    }>
      <UnsubscribeClient />
    </Suspense>
  );
}
