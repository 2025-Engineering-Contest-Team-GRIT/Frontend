
import { TimetableView } from '@/components/views/TimetableView';
import { StudentStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const dynamic = 'force-dynamic'; // SSR

async function fetchStudentApi(status: string) {
  const res = await fetch(`/api/student?status=${status}`);
  if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
  return res.json();
}
async function fetchTimetableApi(status: string) {
  const res = await fetch(`/api/timetable?status=${status}`);
  if (!res.ok) throw new Error('시간표 정보를 불러올 수 없습니다');
  return res.json();
}

export default function TimetablePage() {
  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', StudentStatus.SOPHOMORE],
    queryFn: () => fetchStudentApi(StudentStatus.SOPHOMORE),
  });
  const { data: timetable, isLoading: loadingTimetable } = useQuery({
    queryKey: ['timetable', StudentStatus.SOPHOMORE],
    queryFn: () => fetchTimetableApi(StudentStatus.SOPHOMORE),
  });

  if (loadingStudent || loadingTimetable || !student || !timetable) return <div className="p-8">로딩 중...</div>;

  const mergedStudent = { ...student, timetable };
  return <TimetableView student={mergedStudent} />;
}
