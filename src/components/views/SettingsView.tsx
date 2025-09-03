'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';
import type { Student, Track } from '@/types';
import { CareerPath } from '@/types';
import { Card, IconWorld, IconLink, IconLock, IconSettings, IconTrophy, IconCalendar, IconUser, IconEye, IconEyeOff, RefreshButton } from '../common';
import { ConfirmationModal } from '../ConfirmationModal';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ enabled, onChange, disabled = false }: ToggleSwitchProps) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
      disabled ? 'cursor-not-allowed opacity-60' : ''
    } ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

interface DisplayOptionToggleProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const DisplayOptionToggle = ({
  label,
  description,
  icon,
  enabled,
  onChange,
  disabled = false,
}: DisplayOptionToggleProps) => (
  <div
    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      disabled ? 'bg-slate-50' : 'bg-white'
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg ${
          enabled && !disabled ? 'text-blue-600' : 'text-slate-400'
        } ${disabled ? 'bg-slate-100' : 'bg-slate-50'}`}
      >
        {icon}
      </div>
      <div>
        <label
          className={`font-semibold transition-colors ${
            disabled ? 'text-slate-500' : 'text-slate-800'
          }`}
        >
          {label}
        </label>
        <p
          className={`text-sm transition-colors ${
            disabled ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {description}
        </p>
      </div>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} disabled={disabled} />
  </div>
);

interface SettingsViewProps {
  student: Student;
  onSave: (student: Student) => void;
  onResetOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  student,
  onSave,
  onResetOnboarding,
}) => {
  const [editedStudent, setEditedStudent] = useState<Student>(student);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const profileUrl = useMemo(() => {
    return `https://hsuguidance.n-e.kr/profile/${editedStudent.studentId}`;
  }, [editedStudent.studentId]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(student) !== JSON.stringify(editedStudent);
  }, [student, editedStudent]);

  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleSave = () => {
    onSave(editedStudent);
    setToast({ message: '변경사항이 저장되었습니다.', type: 'success' });
  };

  const handleCancel = () => {
    setEditedStudent(student);
    setToast({ message: '변경사항이 취소되었습니다.', type: 'info' });
  };

  const handleResetConfirm = () => {
    onResetOnboarding();
    setIsConfirmModalOpen(false);
    setToast({ message: '설정이 초기화되었습니다.', type: 'success' });
  };

  const handleUpdate = <T extends keyof Student>(key: T, value: Student[T]) => {
    if (key === 'profileSharingEnabled' && !value) {
      setEditedStudent((prev) => ({
        ...prev,
        [key]: value,
        profileVisibility: 'private' as Student['profileVisibility'],
      }));
    } else {
      setEditedStudent((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleUpdateCareerPath = (index: number, newPath: CareerPath) => {
    const newPaths = [...editedStudent.careerPaths];
    const otherPath = newPaths[1 - index];

    // Prevent selecting the same path twice if the other path is not NONE
    if (newPath !== CareerPath.NONE && newPath === otherPath) {
      return;
    }

    newPaths[index] = newPath;

    // Filter out NONE values before creating tracks
    const validPaths = newPaths.filter((p) => p !== CareerPath.NONE);
    const newTracks = validPaths.map((p) => `${p} 트랙` as Track);
    while (newTracks.length < 2) {
      newTracks.push('트랙 미지정');
    }

    setEditedStudent((prev) => ({
      ...prev,
      careerPaths: newPaths,
      tracks: newTracks,
    }));
  };

  const handleUpdateDisplayOption = (key: string, value: boolean) => {
    setEditedStudent((prev) => ({
      ...prev,
      profileDisplayOptions: {
        showGrades: prev.profileDisplayOptions?.showGrades ?? false,
        showTimetable: prev.profileDisplayOptions?.showTimetable ?? false,
        showStudentId: prev.profileDisplayOptions?.showStudentId ?? false,
        ...prev.profileDisplayOptions,
        [key]: value,
      },
    }));
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setToast({ message: 'URL이 복사되었습니다.', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setToast({ message: 'URL 복사에 실패했습니다.', type: 'error' });
      console.error('Failed to copy URL:', error);
    }
  };

  const isSharingDisabled = !editedStudent.profileSharingEnabled;

  const visibilityOptions = [
    {
      id: 'public',
      label: '전체 공개',
  icon: <IconWorld />,
      description: '누구나 프로필을 볼 수 있습니다.',
    },
    {
      id: 'link_only',
      label: '링크 소유자만',
  icon: <IconLink />,
      description: '링크를 가진 사람만 볼 수 있습니다.',
    },
    {
      id: 'private',
      label: '비공개',
  icon: <IconLock />,
      description: '나만 볼 수 있습니다.',
    },
  ];

  const careerOptions = Object.values(CareerPath).map((p) => ({
    id: p,
    label: p,
  }));

  // ...existing code...
  return (
    <div className={`p-6 relative pb-28 ${fadeIn}`}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg">
          <IconSettings />
        </div>
        <span>설정</span>
      </h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 text-lg">프로필 공유 설정</h3>
            <RefreshButton
              onRefresh={async () => {
                /* 비어있는 함수 */
              }}
              text="프로필 정보 새로고침"
            />
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
              <div>
                <label className="font-semibold text-slate-800">
                  프로필 공유 활성화
                </label>
                <p className="text-sm text-slate-500">
                  외부에 내 프로필을 공유할 수 있도록 허용합니다.
                </p>
              </div>
              <ToggleSwitch
                enabled={editedStudent.profileSharingEnabled ?? false}
                onChange={(val) => handleUpdate('profileSharingEnabled', val)}
              />
            </div>

            <div
              className={`transition-opacity duration-300 ${
                isSharingDisabled ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="space-y-6 p-4 bg-slate-50 rounded-lg">
                <div>
                  <label className="font-semibold text-slate-800 mb-2 block">
                    공개 범위
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {visibilityOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          handleUpdate('profileVisibility', opt.id as Student['profileVisibility'])
                        }
                        disabled={isSharingDisabled}
                        className={`p-4 rounded-xl text-left transition-all border-2 ${
                          editedStudent.profileVisibility === opt.id
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                            : 'bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-slate-700">
                          {opt.icon} {opt.label}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {opt.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="profileUrl"
                    className="font-semibold text-slate-800 mb-2 block"
                  >
                    내 프로필 URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="profileUrl"
                      type="text"
                      readOnly
                      value={profileUrl}
                      disabled={isSharingDisabled}
                      className="w-full p-2 border border-slate-300 bg-slate-100 rounded-lg disabled:cursor-not-allowed"
                    />
                    <Button
                      onClick={handleCopyUrl}
                      disabled={isSharingDisabled}
                      variant="outline"
                      className="w-32 font-semibold"
                    >
                      {copied ? '복사됨!' : 'URL 복사'}
                    </Button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="profilePassword"
                    className="font-semibold text-slate-800 mb-2 block"
                  >
                    프로필 암호 (선택 사항)
                  </label>
                  <div className="relative">
                    <input
                      id="profilePassword"
                      type={showPassword ? 'text' : 'password'}
                      value={editedStudent.profileUrlPassword || ''}
                      onChange={(e) =>
                        handleUpdate('profileUrlPassword', e.target.value)
                      }
                      placeholder="암호 설정 시 URL에 포함됩니다."
                      disabled={isSharingDisabled}
                      className="w-full p-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition disabled:bg-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSharingDisabled}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 disabled:text-slate-400"
                    >
                      {showPassword ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4 text-lg">
            공개 프로필 표시 항목 설정
          </h3>
          <div className="space-y-2 bg-slate-50 rounded-lg p-2">
            <DisplayOptionToggle
              label="성적/GPA 표시"
              description="명함과 이수 과목 목록에 성적을 표시합니다."
              icon={<IconTrophy />}
              enabled={!!editedStudent.profileDisplayOptions?.showGrades}
              onChange={(val) => handleUpdateDisplayOption('showGrades', val)}
              disabled={isSharingDisabled}
            />
            <DisplayOptionToggle
              label="시간표 표시"
              description="공개 프로필에 현재 학기 시간표를 표시합니다."
              icon={<IconCalendar />}
              enabled={!!editedStudent.profileDisplayOptions?.showTimetable}
              onChange={(val) => handleUpdateDisplayOption('showTimetable', val)}
              disabled={isSharingDisabled}
            />
            <DisplayOptionToggle
              label="학번 표시"
              description="명함에 학번을 표시합니다."
              icon={<IconUser />}
              enabled={!!editedStudent.profileDisplayOptions?.showStudentId}
              onChange={(val) => handleUpdateDisplayOption('showStudentId', val)}
              disabled={isSharingDisabled}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700 text-lg">학습 설정 수정</h3>
            <RefreshButton
              onRefresh={async () => {
                /* 비어있는 함수 */
              }}
              text="수강 정보 새로고침"
            />
          </div>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md font-semibold text-slate-700 mb-2">
                주 트랙
              </h3>
              <select
                value={editedStudent.careerPaths[0] || CareerPath.NONE}
                onChange={(e) =>
                  handleUpdateCareerPath(0, e.target.value as CareerPath)
                }
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              >
                {careerOptions
                  .filter(
                    (opt) =>
                      opt.id === CareerPath.NONE ||
                      opt.id !== editedStudent.careerPaths[1]
                  )
                  .map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-700 mb-2">
                부 트랙
              </h3>
              <select
                value={editedStudent.careerPaths[1] || CareerPath.NONE}
                onChange={(e) =>
                  handleUpdateCareerPath(1, e.target.value as CareerPath)
                }
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              >
                {careerOptions
                  .filter(
                    (opt) =>
                      opt.id === CareerPath.NONE ||
                      opt.id !== editedStudent.careerPaths[0]
                  )
                  .map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-red-300 bg-red-50/50">
          <h3 className="font-bold text-red-800 mb-2 text-lg">위험 구역</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-red-700">초기 설정 초기화</p>
              <p className="text-sm text-red-600">
                모든 학습 설정을 초기화하고 온보딩을 다시 시작합니다.
              </p>
            </div>
            <Button
              onClick={() => setIsConfirmModalOpen(true)}
              variant="danger"
              className="font-semibold py-2 px-4 shadow-sm hover:shadow-md shadow-red-500/30"
            >
              초기화
            </Button>
          </div>
        </Card>
      </div>

      {hasChanges && (
        <div className="fixed bottom-0 left-0 lg:left-56 right-0 bg-white/70 backdrop-blur-lg border-t border-slate-200 p-4 z-40 animate-fade-in-up">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-slate-700 font-semibold">
              변경사항이 있습니다. 저장하시겠습니까?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="py-2 px-5 font-semibold"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                variant="primary"
                className="py-2 px-5 font-semibold shadow-md shadow-blue-500/30"
              >
                변경사항 저장
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleResetConfirm}
        title="설정을 초기화하시겠습니까?"
        message={
          <p>
            모든 학습 설정이 지워지고, 처음부터 다시 설정하게 됩니다.
            <br />
            이 작업은 되돌릴 수 없습니다.
          </p>
        }
        confirmButtonText="네, 초기화합니다"
      />
    </div>
  );
};
