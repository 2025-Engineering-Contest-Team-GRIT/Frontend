
import { OnboardingScreen } from '@/components/views/OnboardingScreen';
import { mockStudents } from '@/data/mockData';
import { StudentStatus } from '@/types';

export default function OnboardingPage() {
  // SSR: 상태 관리용 no-op 핸들러 전달
  return (
    <OnboardingScreen
      student={mockStudents[StudentStatus.FRESHMAN]}
      onComplete={() => {}}
      onExit={() => {}}
    />
  );
}
