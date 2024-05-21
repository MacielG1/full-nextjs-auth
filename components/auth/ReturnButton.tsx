'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

type Props = {
  label: string;
  href: string;
};

export default function ReturnButton({ label, href }: Props) {
  return (
    <Button variant="link" className="w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
