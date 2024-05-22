import { signOut } from '@/lib/auth';

export default function page() {
  async function handleLogout() {
    'use server';
    await signOut();
  }
  return (
    <div>
      <form action={handleLogout}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
