'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import LoginForm from './LoginForm';

type Props = {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
};

export default function LoginButton({
  children,
  mode = 'redirect',
  asChild,
}: Props) {
  const router = useRouter();

  function handleClick() {
    router.push('/auth/login');
  }

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="bg-transparent p-0 w-auto">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
}
