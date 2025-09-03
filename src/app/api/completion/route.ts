import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

/**
 * GET /api/completion
 * @description 이수현황 정보를 조회합니다. (실제 API 서버 전환 시 GET /api/completion?status=...)
 * @param {string} status - 학생 상태 (예: "SOPHOMORE", "FRESHMAN")
 * @returns {{ allCourses: any[], favoriteCourseIds: string[] }}
 * @example
 *   GET /api/completion?status=SOPHOMORE
 *   Response: { allCourses, favoriteCourseIds }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  const student = mockStudents[status];
  return NextResponse.json({
    allCourses: student.roadmap.semesters.flatMap(s => s.courses),
    favoriteCourseIds: student.favoriteCourseIds,
  });
}
