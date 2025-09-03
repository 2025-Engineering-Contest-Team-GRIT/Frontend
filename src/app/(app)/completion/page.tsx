

import { CompletionStatusView } from '@/components/views/CompletionStatusView';
import { StudentStatus, Student, AllCourses } from '@/types';

export const dynamic = 'force-dynamic'; // SSR

async function getStudent(status: string): Promise<Student> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/student?status=${status}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
  return res.json();
}
async function getCompletion(status: string): Promise<{ allCourses: AllCourses[] }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/completion?status=${status}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('이수현황 정보를 불러올 수 없습니다');
  return res.json();
}

export default async function CompletionPage() {
  // SSR-safe fetch
  const [student, completion] = await Promise.all([
    getStudent(StudentStatus.SOPHOMORE),
    getCompletion(StudentStatus.SOPHOMORE),
  ]);

  if (!student || !completion) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <CompletionStatusView
      student={student}
      allCourses={completion.allCourses}
      onToggleFavorite={() => {}}
      onToggleRoadmap={() => {}}
    />
  );
}
