

import { SettingsView } from '@/components/views/SettingsView';
import { StudentStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';

async function fetchSettingsApi(status: string) {
  const res = await fetch(`/api/settings?status=${status}`);
  if (!res.ok) throw new Error('설정 정보를 불러올 수 없습니다');
  return res.json();
}

export default function SettingsPage() {
  const { data: student, isLoading } = useQuery({
    queryKey: ['settings', StudentStatus.SOPHOMORE],
    queryFn: () => fetchSettingsApi(StudentStatus.SOPHOMORE),
  });

  if (isLoading || !student) return <div className="p-8">로딩 중...</div>;

  return (
    <SettingsView
      student={student}
      onSave={() => {}}
      onResetOnboarding={() => {}}
    />
  );
}
