import Navbar from './_components/Navbar';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full text-white flex flex-col gap-8 items-center bg-slate-900">
      <Navbar />
      {children}
    </div>
  );
}
