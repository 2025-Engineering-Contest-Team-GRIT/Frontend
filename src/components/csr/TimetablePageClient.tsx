'use client';

import { TimetableView } from '@/components/views/TimetableView';
import { StudentStatus } from '@/types';
import { useStudent, useTimetable } from '@/hooks/useData';

export function TimetablePageClient() {
  const { data: student, isLoading: loadingStudent } = useStudent(StudentStatus.SOPHOMORE);
  const { data: timetable, isLoading: loadingTimetable } = useTimetable(StudentStatus.SOPHOMORE);

  if (loadingStudent || loadingTimetable || !student || !timetable) {
    return <div className="p-8">로딩 중...</div>;
  }

  const mergedStudent = { ...student, timetable };
  return <TimetableView student={mergedStudent} />;
}