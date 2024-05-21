import { CircleCheck } from 'lucide-react';

export default function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="bg-green-500/15 p-3 flex rounded-md items-center justify-center gap-2 text-sm text-green-700">
      <CircleCheck size={16} />
      <span>{message}</span>
    </div>
  );
}
