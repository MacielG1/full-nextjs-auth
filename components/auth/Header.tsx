import { LockKeyhole } from 'lucide-react';

export default function Header({ label }: { label: string }) {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-wide flex items-center">
        <LockKeyhole size={30} className="mr-2" /> Auth
      </h1>
      <p className="text-sm text-muted-foreground ">{label}</p>
    </div>
  );
}
