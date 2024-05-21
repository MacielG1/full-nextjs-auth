'use client';

import Github from '../icons/github';
import Google from '../icons/google';
import { Button } from '../ui/button';

export default function Socials() {
  return (
    <div className="w-full flex items-center gap-2">
      <Button className="w-full" size="lg" variant="outline">
        <Google className="size-6" />
      </Button>
      <Button className="w-full" size="lg" variant="outline">
        <Github className="size-6" />
      </Button>
    </div>
  );
}
