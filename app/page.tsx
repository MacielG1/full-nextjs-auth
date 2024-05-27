import LoginButton from '@/components/auth/LoginButton';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';
import { Open_Sans } from 'next/font/google';

const font = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col text-white items-center justify-center bg-slate-900">
      <div className="space-y-6 text-center">
        <h1
          className={`text-6xl font-semibold flex items-center gap-1 ${font.className}`}
        >
          <LockKeyhole size={50} className="mr-2" />
          Auth
        </h1>
        <p className="text-lg"> Next.js Auth </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="secondary" size="lg">
              Enter
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
