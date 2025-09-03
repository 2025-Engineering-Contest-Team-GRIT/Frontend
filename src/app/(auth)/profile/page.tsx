import { PublicProfileView } from '@/components/views/PublicProfileView';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export default function ProfilePage() {
  // SSR: 상태 관리용 no-op 핸들러 전달
  return (
    <PublicProfileView
      student={mockStudents[StudentStatus.SOPHOMORE]}
      onGoBack={() => {}}
      isExternal={false}
    />
  );
}
