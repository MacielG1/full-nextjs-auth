'use client';

import { useSession } from 'next-auth/react';

export default function page() {
  const session = useSession();
  return (
    <div>
      <span>Role: {session?.data?.user?.role}</span>

      {session?.data?.user?.role === 'ADMIN' && (
        <div>
          <h1>Admin Page</h1>
          <div
            className="flex flex-row items-center justify-between
          border p-3
          "
          >
            <p>Admin-only API route</p>
          </div>
        </div>
      )}

      {session?.data?.user?.role === 'USER' && (
        <div>
          <h1>Unauthorized</h1>
          <p>You are not authorized to view this page</p>
        </div>
      )}
    </div>
  );
}
