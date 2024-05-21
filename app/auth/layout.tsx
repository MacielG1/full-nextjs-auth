export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full grid place-items-center g-gradient-to-b from-slate-950 to-slate-800">
      {children}
    </div>
  );
}
