import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function fetchTimetable(status: StudentStatus) {
  await new Promise((r) => setTimeout(r, 100));
  return mockStudents[status].timetable || [];
}
