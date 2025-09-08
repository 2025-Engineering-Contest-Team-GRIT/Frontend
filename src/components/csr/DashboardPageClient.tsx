'use client';

import { DashboardView } from '@/components/views/DashboardView';
import { StudentStatus } from '@/types';
import { useStudent } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useStore';

export function DashboardPageClient() {
  const { data: student, isLoading } = useStudent(StudentStatus.SOPHOMORE);
  const { navigateToView } = useNavigation();

  if (isLoading || !student) {
    return <div className="p-8">로딩 중...</div>;
  }

  const handleViewPublicProfile = () => {
    // Navigate to public profile
    console.log('Navigate to public profile');
  };

  return (
    <DashboardView 
      student={student} 
      setActiveView={navigateToView}
      onViewPublicProfile={handleViewPublicProfile}
    />
  );
}