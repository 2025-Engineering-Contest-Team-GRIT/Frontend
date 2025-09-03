import { NextResponse } from 'next/server';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get('status') as StudentStatus) || StudentStatus.SOPHOMORE;
  await new Promise((r) => setTimeout(r, 100));
  const student = mockStudents[status];
  return NextResponse.json({
    gpa: student.gpa,
    completedCredits: student.completedCredits,
    totalCredits: student.totalCredits,
    favoriteCourseIds: student.favoriteCourseIds,
  });
}
