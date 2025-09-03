

import { RoadmapView } from '@/components/views/RoadmapView';
import { StudentStatus, Roadmap } from '@/types';

export const dynamic = 'force-dynamic'; // SSR

async function getRoadmap(status: string): Promise<Roadmap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/roadmap?status=${status}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('로드맵 정보를 불러올 수 없습니다');
  return res.json();
}

export default async function RoadmapPage() {
  const roadmap = await getRoadmap(StudentStatus.SOPHOMORE);
  if (!roadmap) return <div className="p-8">로딩 중...</div>;
  const courses = roadmap.semesters.flatMap((s: any) => s.courses);
  const currentSemester = roadmap.semesters.length;
  return (
    <RoadmapView
      courses={courses}
      currentSemester={currentSemester}
      onCourseClick={() => {}}
      onRefresh={async () => {}}
    />
  );
}
