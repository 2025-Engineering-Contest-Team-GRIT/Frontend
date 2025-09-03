'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';
import { Button } from '../Button';
import { ProgressBar } from '../ProgressBar';
import type { Student, StudyStyle, ConsentChoices, Track } from '@/types';
import { CareerPath } from '@/types';
import { Card, IconLock, IconTarget, IconSparkles, IconMap, IconCheck, IconUser, IconBook, IconCalendar, IconCpu, IconWorld, IconBarChart2, IconCube, IconBriefcase, IconMortarBoard, IconRocket, IconTrophy, IconChevronDown, IconChevronRight, IconX, IconCompass } from '../common';
import { ConfirmationModal } from '../ConfirmationModal';
import { PrivacyPolicyModal } from '../PrivacyPolicyModal';

interface UserPreferences {
  careerPaths: CareerPath[];
  studyStyle: StudyStyle;
  interests: string[];
  minor: string;
  academicGoals: string[];
}

type OnboardingScreenProps = {
  student: Student;
  onComplete: (updatedStudent: Student) => void;
  onExit: () => void;
};

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
  { name: '데이터 연동', icon: <IconLock /> },
  { name: '학습 설계', icon: <IconTarget /> },
  { name: 'AI 분석', icon: <IconSparkles /> },
  { name: '로드맵 확인', icon: <IconMap /> },
  ];
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-8 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center text-center z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep > index
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : currentStep === index
                  ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-lg'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              {currentStep > index ? <IconCheck /> : React.cloneElement(step.icon, { className: 'w-6 h-6' })}
            </div>
            <p
              className={`mt-2 text-xs font-semibold transition-colors duration-300 ${
                currentStep >= index ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-[-1rem] transition-all duration-500 ${
                currentStep > index ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const DataIntegrationStep = ({
  consentChoices,
  setConsentChoices,
  onNext,
  onOpenPolicy,
}: {
  consentChoices: ConsentChoices;
  setConsentChoices: (choices: ConsentChoices) => void;
  onNext: () => void;
  onOpenPolicy: () => void;
}) => {
  const integrationOptions = [
    {
      id: 'profile' as keyof ConsentChoices,
      label: '기본 프로필 정보',
      description: '이름, 학번, 학과, 학년 정보',
  icon: <IconUser />,
      required: true,
    },
    {
      id: 'courses' as keyof ConsentChoices,
      label: '수강 과목 및 성적 정보',
      description: '이수한 과목, 성적, 학점 정보',
  icon: <IconBook />,
      required: false,
    },
    {
      id: 'timetable' as keyof ConsentChoices,
      label: '시간표 정보',
      description: '현재 학기 시간표 및 수강 일정',
  icon: <IconCalendar />,
      required: false,
    },
  ];

  const handleToggle = (id: keyof ConsentChoices) => {
    if (id === 'profile') return; // Required field
    setConsentChoices({ ...consentChoices, [id]: !consentChoices[id] });
  };

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
          <IconLock />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">데이터 연동 안내</h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          &apos;한성 길라잡이&apos;는 종합정보시스템의 정보를 바탕으로 맞춤형 서비스를 제공합니다. 연동할 데이터를 선택해주세요.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {integrationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleToggle(option.id)}
            disabled={option.required}
            className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              consentChoices[option.id]
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            } ${option.required ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg text-blue-600 bg-blue-100">
              {option.icon}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-slate-800 flex items-center gap-2">
                {option.label}
                {option.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">필수</span>}
              </p>
              <p className="text-sm text-slate-500">{option.description}</p>
            </div>
            <div className="ml-auto">
              {consentChoices[option.id] ? (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <IconCheck />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-slate-500 mb-6">
        <button onClick={onOpenPolicy} className="text-blue-600 hover:underline font-medium">
          개인정보 수집 및 이용 동의서
        </button>
        를 확인해주세요.
      </div>

      <Button onClick={onNext} variant="primary" className="w-full font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30">
        다음 단계로
      </Button>
    </Card>
  );
};

const PreferencesStep = ({
  preferences,
  setPreferences,
  onNext,
}: {
  preferences: UserPreferences;
  setPreferences: (fn: (prev: UserPreferences) => UserPreferences) => void;
  onNext: () => void;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [interestInput, setInterestInput] = useState('');

  const handleUpdate = (key: keyof UserPreferences, value: UserPreferences[keyof UserPreferences]) =>
    setPreferences((prev) => ({ ...prev, [key]: value }));
  const handleUpdateStudyStyle = (key: string, value: unknown) =>
    setPreferences((prev) => ({ ...prev, studyStyle: { ...prev.studyStyle, [key]: value } }));

  const handleSelectPath = (path: CareerPath) => {
    const newPaths = preferences.careerPaths.includes(path)
      ? preferences.careerPaths.filter((p: CareerPath) => p !== path)
      : [...preferences.careerPaths, path];

    if (newPaths.length <= 2) {
      handleUpdate('careerPaths', newPaths);
    }
  };

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim() && !preferences.interests.includes(interestInput.trim())) {
      handleUpdate('interests', [...preferences.interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    handleUpdate('interests', preferences.interests.filter((i) => i !== interest));
  };

  const handleToggleGoal = (goal: string) => {
    const newGoals = preferences.academicGoals.includes(goal)
      ? preferences.academicGoals.filter((g: string) => g !== goal)
      : [...preferences.academicGoals, goal];
    handleUpdate('academicGoals', newGoals);
  };

  const careerOptions = [
  { id: CareerPath.MOBILE_SOFTWARE, label: '모바일소프트웨어', icon: <IconCpu />, description: 'iOS/Android 앱 개발' },
  { id: CareerPath.WEB_ENGINEERING, label: '웹공학', icon: <IconWorld />, description: '웹 서비스 개발' },
  { id: CareerPath.BIG_DATA, label: '빅데이터', icon: <IconBarChart2 />, description: '데이터 분석 및 처리' },
  { id: CareerPath.DIGITAL_CONTENTS_VR, label: '디지털콘텐츠·가상현실', icon: <IconCube />, description: 'VR/AR, 게임 개발' },
  ];

  const studyStyleOptions = {
    creditLoad: [
      { id: 'light', label: '가벼운 (12-15학점)' },
      { id: 'normal', label: '보통 (16-18학점)' },
      { id: 'heavy', label: '많은 (19-21학점)' },
    ],
    preference: [
      { id: 'theory', label: '이론 중심' },
      { id: 'balanced', label: '균형 잡힌' },
      { id: 'practice', label: '실습 중심' },
    ],
    ratio: [
      { id: 'major', label: '전공 위주' },
      { id: 'balanced', label: '균형 잡힌' },
      { id: 'general', label: '교양 중심' },
    ],
  };

  const academicGoals = [
  { id: 'employment', label: '취업 준비', icon: <IconBriefcase /> },
  { id: 'graduate', label: '대학원 진학', icon: <IconMortarBoard /> },
  { id: 'startup', label: '창업', icon: <IconRocket /> },
  { id: 'certification', label: '자격증 취득', icon: <IconTrophy /> },
  ];

  return (
    <Card className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
          <IconTarget />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">학습 설계</h2>
        <p className="text-slate-500 mt-2">당신만의 맞춤형 로드맵을 만들어보세요.</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3">
            <span className="text-purple-500 font-bold">1.</span> 관심있는 진로를 선택해주세요. (최대 2개)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerOptions.map((career) => (
              <button
                key={career.id}
                onClick={() => handleSelectPath(career.id)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  preferences.careerPaths.includes(career.id)
                    ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500'
                    : 'bg-white hover:border-purple-300'
                } ${preferences.careerPaths.length >= 2 && !preferences.careerPaths.includes(career.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={preferences.careerPaths.length >= 2 && !preferences.careerPaths.includes(career.id)}
              >
                <div className="flex items-center gap-3 font-bold text-slate-700">
                  {career.icon} {career.label}
                </div>
                <p className="text-xs text-slate-500 mt-2">{career.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3">
            <span className="text-purple-500 font-bold">2.</span> 선호하는 학습 스타일을 알려주세요.
          </h3>
          <div className="space-y-4">
            {Object.entries(studyStyleOptions).map(([key, options]) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-600">
                  {key === 'creditLoad' ? '학기 당 수강 학점' : key === 'preference' ? '이론/실습 선호도' : '전공/교양 비중'}
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg mt-1">
                  {options.map((option: { id: string; label: string }) => (
                    <button
                      key={option.id}
                      onClick={() => handleUpdateStudyStyle(key, option.id)}
                      className={`flex-1 text-sm py-2 rounded-md font-semibold transition-all duration-200 ${
                        (preferences.studyStyle as unknown as Record<string, string>)[key] === option.id
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-slate-500 hover:bg-white/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            {isAdvancedOpen ? <IconChevronDown /> : <IconChevronRight />}
            <span>고급 설정 (선택사항)</span>
          </button>

          {isAdvancedOpen && (
            <div className="mt-4 space-y-6 p-6 bg-slate-50 rounded-lg">
              <div>
                <label htmlFor="minor" className="text-sm font-medium text-slate-700 mb-2 block">
                  복수전공/부전공
                </label>
                <input
                  id="minor"
                  type="text"
                  value={preferences.minor}
                  onChange={(e) => handleUpdate('minor', e.target.value)}
                  placeholder="e.g., 경영학과, 디자인과"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">학업 목표</label>
                <div className="grid grid-cols-2 gap-3">
                  {academicGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleToggleGoal(goal.id)}
                      className={`p-3 rounded-lg font-semibold text-center transition-all border-2 flex items-center justify-center gap-2 ${
                        preferences.academicGoals.includes(goal.id)
                          ? 'bg-purple-100 border-purple-500 text-purple-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300'
                      }`}
                    >
                      {goal.icon}
                      <span>{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="interests" className="text-sm font-medium text-slate-700 mb-2 block">
                  관심 기술/분야
                </label>
                <div className="space-y-2">
                  <input
                    id="interests"
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={handleAddInterest}
                    placeholder="관심 기술을 입력하고 Enter를 누르세요 (예: React, Python, AI)"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                  />
                  <div className="flex flex-wrap gap-2">
                    {preferences.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {interest}
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <IconX />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Button variant="secondary" className="w-1/3 font-bold py-3 px-4 rounded-xl">
          이전
        </Button>
        <Button onClick={onNext} variant="primary" className="w-2/3 font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/30">
          AI 분석 시작
        </Button>
      </div>
    </Card>
  );
};

const AnalysisStep = ({ onNext }: { onNext: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    '종합정보시스템에서 데이터를 가져오는 중...',
    '수강 이력을 분석하고 있습니다...',
    'AI가 맞춤형 로드맵을 생성하고 있습니다...',
    '추천 과목을 선별하고 있습니다...',
    '최적의 학습 경로를 계산하고 있습니다...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onNext, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onNext]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <Card className="max-w-2xl mx-auto p-8 text-center">
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 mb-6 animate-pulse">
  <IconSparkles />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-4">AI 분석 중...</h2>
      <p className="text-slate-500 mb-8">{messages[currentMessage]}</p>

  <ProgressBar value={progress} max={100} className="mb-4" showLabel />
    </Card>
  );
};

const CompletionStep = ({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) => (
  <Card className="max-w-2xl mx-auto p-8 text-center">
    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
  <IconCheck />
    </div>

    <h2 className="text-2xl font-bold text-slate-800 mb-4">로드맵 생성 완료!</h2>
    <p className="text-slate-500 mb-8">당신만의 맞춤형 학습 로드맵이 준비되었습니다.</p>

    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
      {[
  { icon: <IconMap />, title: '맞춤형 로드맵', desc: 'AI가 분석한 최적의 수강 경로' },
  { icon: <IconTrophy />, title: '성취 목표', desc: '단계별 학습 목표와 마일스톤' },
  { icon: <IconCalendar />, title: '학기별 계획', desc: '체계적인 시간표 및 일정 관리' },
  { icon: <IconSparkles />, title: 'AI 추천', desc: '지속적인 맞춤형 과목 추천' },
      ].map((feature, index) => (
        <div key={index} className="p-4 bg-slate-50 rounded-lg">
          <div className="text-blue-600 mb-2">{feature.icon}</div>
          <h4 className="font-semibold text-slate-800">{feature.title}</h4>
          <p className="text-xs text-slate-500">{feature.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <Button onClick={onBack} variant="secondary" className="w-full sm:w-1/3 font-bold py-3 px-4 rounded-xl">
        재설정
      </Button>
      <Button onClick={onFinish} variant="primary" className="w-full sm:w-2/3 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30">
        한성 길라잡이 시작하기
      </Button>
    </div>
    <p className="text-xs text-slate-400 mt-4">로드맵은 언제든지 &apos;로드맵&apos; 탭에서 수정하고 자세히 볼 수 있어요.</p>
  </Card>
);

  const [step, setStep] = useState(1);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const [consentChoices, setConsentChoices] = useState<ConsentChoices>(
    student.consentChoices || {
      profile: true,
      courses: true,
      timetable: true,
    }
  );

  const [preferences, setPreferences] = useState<UserPreferences>({
    careerPaths: student.careerPaths || [],
    studyStyle: student.studyStyle || {
      creditLoad: 'normal',
      preference: 'balanced',
      ratio: 'balanced',
    },
    interests: student.interests || [],
    minor: '',
    academicGoals: [],
  });

  const handleFinish = () => {
    const tracks = preferences.careerPaths
      .filter((p) => p !== CareerPath.NONE)
      .map((p) => `${p} 트랙` as Track);
    while (tracks.length < 2) {
      tracks.push('트랙 미지정');
    }

    const updatedStudent: Student = {
      ...student,
      careerPaths: preferences.careerPaths,
      tracks,
      studyStyle: preferences.studyStyle,
      interests: preferences.interests,
      consentChoices,
    };

    setToast({ message: '로드맵이 생성되었습니다!', type: 'success' });
    setTimeout(() => {
      setToast(null);
      onComplete(updatedStudent);
    }, 1000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <DataIntegrationStep
            consentChoices={consentChoices}
            setConsentChoices={setConsentChoices}
            onNext={() => setStep(2)}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
          />
        );
      case 2:
        return <PreferencesStep preferences={preferences} setPreferences={setPreferences} onNext={() => setStep(3)} />;
      case 3:
        return <AnalysisStep onNext={() => setStep(4)} />;
      case 4:
        return <CompletionStep onFinish={handleFinish} onBack={() => setStep(2)} />;
      default:
        return null;
    }
  };

  // ...existing code...
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden ${fadeIn}`}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center gap-2 text-slate-700">
          <IconCompass />
          <span className="font-bold text-lg">한성 길라잡이</span>
        </div>
        <button
          onClick={() => setIsExitModalOpen(true)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <IconX />
          <span className="hidden sm:inline">나중에 설정</span>
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center p-4 sm:p-6">
        <ProgressIndicator currentStep={step} />
        {renderStep()}
      </main>

      {/* Modals */}
      {isPolicyModalOpen && <PrivacyPolicyModal onClose={() => setIsPolicyModalOpen(false)} />}

      {isExitModalOpen && (
        <ConfirmationModal
          isOpen={isExitModalOpen}
          onClose={() => setIsExitModalOpen(false)}
          onConfirm={onExit}
          title="설정을 나중에 하시겠습니까?"
          message={
            <p>
              지금 설정하지 않으면 맞춤형 기능을 이용할 수 없습니다.
              <br />
              언제든지 설정에서 다시 진행할 수 있어요.
            </p>
          }
          confirmButtonText="네, 나중에 할게요"
        />
      )}
    </div>
  );
};
