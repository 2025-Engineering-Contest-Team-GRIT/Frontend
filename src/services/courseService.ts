import { allCourses } from '@/data/mockData';

export async function fetchAllCourses() {
  await new Promise((r) => setTimeout(r, 100));
  return allCourses;
}
