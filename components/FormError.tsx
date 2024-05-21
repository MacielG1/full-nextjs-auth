import { CircleAlert } from 'lucide-react';

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 flex rounded-md items-center justify-center gap-2 text-sm text-destructive">
      <CircleAlert size={16} />
      <span>{message}</span>
    </div>
  );
}
