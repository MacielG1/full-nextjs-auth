'use client';

import { logout } from '@/lib/actions/logout';

export default function LogoutButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="cursor-pointer " onClick={() => logout()}>
      {children}
    </span>
  );
}
