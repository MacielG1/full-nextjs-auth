'use client';

import { useRouter } from 'next/navigation';

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
    return null;
  }

  return (
    <span onClick={handleClick} className="cursor-pointer">
      {children}
    </span>
  );
}
