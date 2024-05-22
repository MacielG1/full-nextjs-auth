import { auth, signOut } from '@/lib/auth';

export default async function page() {
  const session = await auth();

  async function handleLogout() {
    'use server';
    await signOut();
  }
  return (
    <div>
      <form action={handleLogout}>
        {JSON.stringify(session)}
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
