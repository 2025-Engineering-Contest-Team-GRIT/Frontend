import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus, Student } from '@/types';

/**
 * GET /api/student
 * @description 학생 정보를 조회합니다. (실제 API 서버 전환 시 GET /api/student?status=...)
 * @param {string} status - 학생 상태 (예: "SOPHOMORE", "FRESHMAN")
 * @returns {Student} 학생 정보 객체
 * @example
 *   GET /api/student?status=SOPHOMORE
 *   Response: { id, name, studentId, ... }
 */
export async function GET(request: Request) {
  // 쿼리 파라미터로 status 지정 (예: ?status=SOPHOMORE)
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  return NextResponse.json(mockStudents[status]);
}
