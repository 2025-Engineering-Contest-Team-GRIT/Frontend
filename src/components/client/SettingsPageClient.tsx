'use client';

import { SettingsView } from '@/components/views/SettingsView';
import { StudentStatus } from '@/types';
import { useSettings, useUpdateSettings } from '@/hooks/useData';

export function SettingsPageClient() {
  const { data: student, isLoading } = useSettings(StudentStatus.SOPHOMORE);
  const updateSettings = useUpdateSettings();

  if (isLoading || !student) {
    return <div className="p-8">로딩 중...</div>;
  }

  const handleSave = (settings: any) => {
    updateSettings.mutate(settings);
  };

  const handleResetOnboarding = () => {
    // Reset onboarding logic
    console.log('Reset onboarding');
  };

  return (
    <SettingsView
      student={student}
      onSave={handleSave}
      onResetOnboarding={handleResetOnboarding}
    />
  );
}