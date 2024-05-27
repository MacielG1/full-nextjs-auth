'use client';

import { Button } from '@/components/ui/button';
import admin from '@/lib/actions/admin';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Page() {
  const session = useSession();

  async function testApiRoute() {
    const res = await fetch('/api/admin');
    if (res.ok) {
      const data = await res.json();
      toast.success(`API response: ${data.message}`);
    } else {
      toast.error('Not authorized');
    }
  }

  async function testServerAction() {
    const res = await admin();
    if (res?.success) {
      toast.success(`Server action response: ${res.success}`);
    } else {
      toast.error(res.error);
    }
  }
  return (
    <div className="text-center space-y-2">
      <span>Role: {session?.data?.user?.role}</span>
      {session?.data?.user?.role === 'USER' && (
        <div>
          <h2>Unauthorized</h2>
          <p>Below actions will only work for admins</p>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-2">
        <div
          className="flex flex-row items-center justify-between
          border p-3 gap-2
          "
        >
          <p>Admin-only API route</p>
          <Button onClick={testApiRoute} size="sm" variant="secondary">
            Test
          </Button>
        </div>
        <div
          className="flex flex-row items-center justify-between
          border p-3 gap-2
          "
        >
          <p>Admin-only Server Action</p>
          <Button size="sm" variant="secondary" onClick={testServerAction}>
            Test
          </Button>
        </div>
      </div>
    </div>
  );
}
