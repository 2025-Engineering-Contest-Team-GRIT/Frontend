
import { StatisticsView } from '@/components/views/StatisticsView';
import { StudentStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const dynamic = 'force-dynamic'; // SSR

async function fetchStudentApi(status: string) {
  const res = await fetch(`/api/student?status=${status}`);
  if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
  return res.json();
}
async function fetchStatisticsApi(status: string) {
  const res = await fetch(`/api/statistics?status=${status}`);
  if (!res.ok) throw new Error('통계 정보를 불러올 수 없습니다');
  return res.json();
}
async function fetchCoursesApi() {
  const res = await fetch(`/api/courses`);
  if (!res.ok) throw new Error('과목 정보를 불러올 수 없습니다');
  return res.json();
}

export default function StatisticsPage() {
  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', StudentStatus.SOPHOMORE],
    queryFn: () => fetchStudentApi(StudentStatus.SOPHOMORE),
  });
  const { data: statistics, isLoading: loadingStatistics } = useQuery({
    queryKey: ['statistics', StudentStatus.SOPHOMORE],
    queryFn: () => fetchStatisticsApi(StudentStatus.SOPHOMORE),
  });
  const { data: allCourses, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCoursesApi,
  });

  if (loadingStudent || loadingStatistics || loadingCourses || !student || !statistics || !allCourses) return <div className="p-8">로딩 중...</div>;

  return <StatisticsView student={student} allCourses={allCourses} />;
}
