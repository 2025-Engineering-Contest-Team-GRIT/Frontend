import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function fetchGraduation(status: StudentStatus) {
  await new Promise((r) => setTimeout(r, 100));
  // 예시: 졸업요건 관련 데이터 반환
  const student = mockStudents[status];
  return {
    completedCredits: student.completedCredits,
    totalCredits: student.totalCredits,
    roadmap: student.roadmap,
  };
}
