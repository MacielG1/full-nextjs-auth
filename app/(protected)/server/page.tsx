import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <h2>Getting User data on Server Components</h2>
      <div className="flex flex-col gap-2 pt-3">
        <span>name: {session?.user?.name}</span>
        <span>email: {session?.user?.email}</span>
        <span>role: {session?.user?.role}</span>
        <div>
          <span>Two Factor Authentication: </span>
          <Badge
            variant={
              session?.user?.isTwoFactorEnabled ? 'secondary' : 'destructive'
            }
          >
            {session?.user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <span>id: {session?.user?.id}</span>
      </div>
    </div>
  );
}
