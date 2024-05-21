export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full grid place-items-center bg-slate-900">
      {children}
    </div>
  );
}
