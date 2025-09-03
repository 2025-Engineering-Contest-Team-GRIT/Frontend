import { GraduationView } from '@/components/views/GraduationView';
import { StudentStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';

async function fetchStudentApi(status: string) {
  const res = await fetch(`/api/student?status=${status}`);
  if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
  return res.json();
}
async function fetchGraduationApi(status: string) {
  const res = await fetch(`/api/graduation?status=${status}`);
  if (!res.ok) throw new Error('졸업요건 정보를 불러올 수 없습니다');
  return res.json();
}

export const dynamic = 'force-dynamic'; // SSR

export default function GraduationPage() {
  const { data: student, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', StudentStatus.SOPHOMORE],
    queryFn: () => fetchStudentApi(StudentStatus.SOPHOMORE),
  });
  const { data: graduation, isLoading: loadingGraduation } = useQuery({
    queryKey: ['graduation', StudentStatus.SOPHOMORE],
    queryFn: () => fetchGraduationApi(StudentStatus.SOPHOMORE),
  });

  if (loadingStudent || loadingGraduation || !student || !graduation) return <div className="p-8">로딩 중...</div>;

  // graduation 데이터(credits, roadmap 등)를 student에 병합하여 전달
  const mergedStudent = { ...student, ...graduation };
  return <GraduationView student={mergedStudent} />;
}
