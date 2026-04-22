import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
