import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function fetchCompletion(status: StudentStatus) {
  await new Promise((r) => setTimeout(r, 100));
  // 예시: 이수현황 관련 데이터 반환
  const student = mockStudents[status];
  return {
    allCourses: student.roadmap.semesters.flatMap(s => s.courses),
    favoriteCourseIds: student.favoriteCourseIds,
  };
}
