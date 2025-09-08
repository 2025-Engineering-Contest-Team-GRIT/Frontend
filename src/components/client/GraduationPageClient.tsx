'use client';

import { GraduationView } from '@/components/views/GraduationView';
import { StudentStatus } from '@/types';
import { useStudent, useGraduation } from '@/hooks/useData';

export function GraduationPageClient() {
  const { data: student, isLoading: loadingStudent } = useStudent(StudentStatus.SOPHOMORE);
  const { data: graduation, isLoading: loadingGraduation } = useGraduation(StudentStatus.SOPHOMORE);

  if (loadingStudent || loadingGraduation || !student || !graduation) {
    return <div className="p-8">로딩 중...</div>;
  }

  // graduation 데이터(credits, roadmap 등)를 student에 병합하여 전달
  const mergedStudent = { ...student, ...graduation };
  return <GraduationView student={mergedStudent} />;
}