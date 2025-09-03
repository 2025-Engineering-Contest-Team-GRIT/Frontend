import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function fetchRoadmap(status: StudentStatus) {
  await new Promise((r) => setTimeout(r, 100));
  // 예시: 로드맵 관련 데이터 반환
  return mockStudents[status].roadmap;
}
