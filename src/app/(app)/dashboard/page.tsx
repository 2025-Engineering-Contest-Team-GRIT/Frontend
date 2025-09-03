


import { DashboardView } from '@/components/views/DashboardView';
import { StudentStatus, Student } from '@/types';

export const dynamic = 'force-dynamic'; // SSR

async function getStudent(status: string): Promise<Student> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/student?status=${status}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
  return res.json();
}

export default async function DashboardPage() {
  const user = await getStudent(StudentStatus.SOPHOMORE);
  if (!user) return <div className="p-8">로딩 중...</div>;
  return <DashboardView student={user} setActiveView={() => {}} onViewPublicProfile={() => {}} />;
}
