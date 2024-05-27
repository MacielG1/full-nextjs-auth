'use client';

import { signIn } from 'next-auth/react';
import Github from '../icons/github';
import Google from '../icons/google';
import { Button } from '../ui/button';
import { defaultLoginRedirect } from '@/middleware';
import { useSearchParams } from 'next/navigation';

export default function Socials() {
  const searchParams = useSearchParams();
  const previousUrl = searchParams.get('previousUrl');

  function handleClick(provider: 'google' | 'github') {
    signIn(provider, { callbackUrl: previousUrl || defaultLoginRedirect });
  }

  return (
    <div className="w-full flex items-center gap-2">
      <Button
        onClick={() => handleClick('google')}
        className="w-full"
        size="lg"
        variant="outline"
      >
        <Google className="size-6" />
      </Button>
      <Button
        onClick={() => handleClick('github')}
        className="w-full"
        size="lg"
        variant="outline"
      >
        <Github className="size-6" />
      </Button>
    </div>
  );
}
