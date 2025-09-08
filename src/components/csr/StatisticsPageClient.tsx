'use client';

import { StatisticsView } from '@/components/views/StatisticsView';
import { StudentStatus } from '@/types';
import { useStudent, useStatistics, useCourses } from '@/hooks/useData';

export function StatisticsPageClient() {
  const { data: student, isLoading: loadingStudent } = useStudent(StudentStatus.SOPHOMORE);
  const { data: statistics, isLoading: loadingStatistics } = useStatistics(StudentStatus.SOPHOMORE);
  const { data: allCourses, isLoading: loadingCourses } = useCourses();

  if (loadingStudent || loadingStatistics || loadingCourses || !student || !statistics || !allCourses) {
    return <div className="p-8">로딩 중...</div>;
  }

  return <StatisticsView student={student} allCourses={allCourses} />;
}