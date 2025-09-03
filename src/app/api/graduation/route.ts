import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

/**
 * GET /api/graduation
 * @description 졸업요건 정보를 조회합니다. (실제 API 서버 전환 시 GET /api/graduation?status=...)
 * @param {string} status - 학생 상태 (예: "SOPHOMORE", "FRESHMAN")
 * @returns {{ completedCredits: number, totalCredits: number, roadmap: any }}
 * @example
 *   GET /api/graduation?status=SOPHOMORE
 *   Response: { completedCredits, totalCredits, roadmap }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  const student = mockStudents[status];
  return NextResponse.json({
    completedCredits: student.completedCredits,
    totalCredits: student.totalCredits,
    roadmap: student.roadmap,
  });
}
