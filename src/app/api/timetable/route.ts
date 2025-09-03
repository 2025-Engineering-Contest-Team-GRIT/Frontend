import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus, TimetableSlot } from '@/types';

/**
 * GET /api/timetable
 * @description 시간표 정보를 조회합니다. (실제 API 서버 전환 시 GET /api/timetable?status=...)
 * @param {string} status - 학생 상태 (예: "SOPHOMORE", "FRESHMAN")
 * @returns {TimetableSlot[]} 시간표 배열
 * @example
 *   GET /api/timetable?status=SOPHOMORE
 *   Response: [ { day, startTime, endTime, courseName, ... }, ... ]
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  return NextResponse.json(mockStudents[status].timetable || []);
}
