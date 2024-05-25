import { logout } from '@/lib/actions/logout';
import { useSession } from 'next-auth/react';

export default async function page() {
  // const session = useSession();

  return (
    <div>
      <form action={logout}>
        {/* {JSON.stringify(session)} */}
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
