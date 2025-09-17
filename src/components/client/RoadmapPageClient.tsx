'use client';

import { RoadmapView } from '@/components/views/RoadmapView';
import { StudentStatus } from '@/types';
import { useRoadmap } from '@/hooks/useData';
import { useCourseSelection } from '@/hooks/useStore';

export function RoadmapPageClient() {
  const { data: roadmap, isLoading, refetch } = useRoadmap(StudentStatus.SOPHOMORE);
  const { openCourseModal } = useCourseSelection();

  if (isLoading || !roadmap) {
    return <div className="p-8">로딩 중...</div>;
  }

  const courses = roadmap.semesters.flatMap((s: any) => s.courses);
  const currentSemester = roadmap.semesters.length;

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <RoadmapView
      courses={courses}
      currentSemester={currentSemester}
      onCourseClick={openCourseModal}
      onRefresh={handleRefresh}
    />
  );
}