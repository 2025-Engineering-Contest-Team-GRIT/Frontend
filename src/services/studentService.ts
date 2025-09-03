import { StudentStatus } from '@/types';
import { mockStudents } from '@/data/mockData';

export async function fetchStudent(status: StudentStatus) {
  // 실제 환경에서는 fetch('/api/student') 등으로 대체
  await new Promise((r) => setTimeout(r, 100)); // mock delay
  return mockStudents[status];
}
