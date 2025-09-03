import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function fetchStatistics(status: StudentStatus) {
  await new Promise((r) => setTimeout(r, 100));
  // 예시: 통계 데이터는 학생 객체에서 일부 필드만 반환
  const student = mockStudents[status];
  return {
    gpa: student.gpa,
    completedCredits: student.completedCredits,
    totalCredits: student.totalCredits,
    favoriteCourseIds: student.favoriteCourseIds,
  };
}
