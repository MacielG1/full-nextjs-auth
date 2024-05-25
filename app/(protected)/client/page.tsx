'use client';

import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

export default function page() {
  const session = useSession();
  return (
    <div>
      <h2>Getting User data on Client Components</h2>
      <div className="flex flex-col gap-2 pt-3">
        <span>name: {session?.data?.user?.name}</span>
        <span>email: {session?.data?.user?.email}</span>
        <span>role: {session?.data?.user?.role}</span>
        <div>
          <span>Two Factor Authentication: </span>
          <Badge
            variant={
              session?.data?.user?.isTwoFactorEnabled
                ? 'secondary'
                : 'destructive'
            }
          >
            {session?.data?.user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <span>id: {session?.data?.user?.id}</span>
      </div>
    </div>
  );
}
