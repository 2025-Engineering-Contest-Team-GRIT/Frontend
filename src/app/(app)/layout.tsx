import { ReactNode } from "react";
import { CSRNavigation } from "@/components/client/Navigation";
import "../globals.css";
import { HeaderClientWrapper } from "@/components/client/wrapper/HeaderClientWrapper";

export default function AppLayout({ children }: { children: ReactNode }) {
  // 실제 서비스에서는 SSR에서 유저 fetch

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <HeaderClientWrapper />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white/60 backdrop-blur-sm border-r border-slate-200/80 p-4 shrink-0">
          <CSRNavigation />
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
