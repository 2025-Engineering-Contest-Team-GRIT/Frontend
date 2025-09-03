import { NextResponse } from 'next/server';
import { allCourses } from '@/data/mockData';

export async function GET() {
  await new Promise((r) => setTimeout(r, 100));
  return NextResponse.json(allCourses);
}
