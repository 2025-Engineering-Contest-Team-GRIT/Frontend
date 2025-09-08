'use client';

import { CompletionStatusView } from '@/components/views/CompletionStatusView';
import { StudentStatus } from '@/types';
import { useStudent, useCourses } from '@/hooks/useData';

export function CompletionPageClient() {
  const { data: student, isLoading: loadingStudent } = useStudent(StudentStatus.SOPHOMORE);
  const { data: allCourses, isLoading: loadingCourses } = useCourses();

  if (loadingStudent || loadingCourses || !student || !allCourses) {
    return <div className="p-8">로딩 중...</div>;
  }

  const handleToggleFavorite = (courseId: string) => {
    // Toggle favorite logic
    console.log('Toggle favorite:', courseId);
  };

  const handleToggleRoadmap = (courseId: string) => {
    // Toggle roadmap logic
    console.log('Toggle roadmap:', courseId);
  };

  return (
    <CompletionStatusView
      student={student}
      allCourses={allCourses}
      onToggleFavorite={handleToggleFavorite}
      onToggleRoadmap={handleToggleRoadmap}
    />
  );
}