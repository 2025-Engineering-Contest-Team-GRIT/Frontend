import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';
import '../globals.css';

export default function AppLayout({ children }: { children: ReactNode }) {
  // 실제 서비스에서는 SSR에서 유저 fetch
  const user = mockStudents[StudentStatus.SOPHOMORE];
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header student={user} onLogout={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white/60 backdrop-blur-sm border-r border-slate-200/80 p-4 shrink-0">
          {/* Nav 컴포넌트 SSR용으로 분리 필요 */}
        </aside>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
