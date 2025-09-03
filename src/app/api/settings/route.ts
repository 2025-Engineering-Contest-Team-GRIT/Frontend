import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

/**
 * GET /api/settings
 * @description 설정 정보를 조회합니다. (실제 API 서버 전환 시 GET /api/settings?status=...)
 * @param {string} status - 학생 상태 (예: "SOPHOMORE", "FRESHMAN")
 * @returns {Student} 학생 정보 객체 (설정용)
 * @example
 *   GET /api/settings?status=SOPHOMORE
 *   Response: { ...student }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  return NextResponse.json(mockStudents[status]);
}
