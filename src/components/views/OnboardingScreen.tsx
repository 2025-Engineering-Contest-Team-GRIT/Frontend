"use client";

import React, { useState, useEffect } from "react";
import { Toast } from "../Toast";
import { fadeIn } from "../animations";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import type { StudyStyle, ConsentChoices, Track, AuthInfo } from "@/types";
import { CareerPath, CareerPathList } from "@/types";
import {
  Card,
  IconLock,
  IconTarget,
  IconSparkles,
  IconMap,
  IconCheck,
  IconUser,
  IconBook,
  IconCalendar,
  IconCpu,
  IconWorld,
  IconBarChart2,
  IconCube,
  IconBriefcase,
  IconMortarBoard,
  IconRocket,
  IconTrophy,
  IconChevronDown,
  IconChevronRight,
  IconX,
  IconCompass,
} from "../common";
import { PrivacyPolicyModal } from "../PrivacyPolicyModal";
import { InfoFetchResponse, RecommendProps } from "@/services/authService";

interface UserPreferences {
  careerPaths: CareerPath[];
  studyStyle: StudyStyle;
  interests: string[];
  minor: string;
  academicGoals: string[];
}

type OnboardingScreenProps = {
  authInfo: AuthInfo;
  onInfoFetch: () => Promise<InfoFetchResponse>;
  onRecommendRoadmaps: (recommandProps: RecommendProps) => Promise<boolean>;
  onComplete: () => void;
};

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { name: "데이터 연동", icon: <IconLock /> },
    { name: "학습 설계", icon: <IconTarget /> },
    { name: "AI 분석", icon: <IconSparkles /> },
    { name: "로드맵 확인", icon: <IconMap /> },
  ];
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto mb-8 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center text-center z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep > index
                  ? "bg-blue-600 border-blue-600 text-white"
                  : currentStep === index
                    ? "bg-white border-blue-600 text-blue-600 scale-110 shadow-lg"
                    : "bg-slate-100 border-slate-300 text-slate-400"
              }`}
            >
              {currentStep > index ? (
                <IconCheck />
              ) : (
                React.cloneElement(step.icon, { className: "w-6 h-6" })
              )}
            </div>
            <p
              className={`mt-2 text-xs font-semibold transition-colors duration-300 ${
                currentStep >= index ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-[-1rem] transition-all duration-500 ${
                currentStep > index ? "bg-blue-500" : "bg-slate-200"
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
  setPreferences,
  onOpenPolicy,
  onInfoFetch,
}: {
  consentChoices: ConsentChoices;
  setConsentChoices: (choices: ConsentChoices) => void;
  onNext: () => void;
  setPreferences: (fn: (prev: UserPreferences) => UserPreferences) => void;
  onOpenPolicy: () => void;
  onInfoFetch: () => Promise<InfoFetchResponse>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyChecked, setPolicyChecked] = useState(false);

  const handleFetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await onInfoFetch();
      if (result.success) {
        setPreferences((prev) => ({
          ...prev,
          careerPaths: result.track
            ? result.track
                .map((id) => {
                  console.log(
                    id,
                    CareerPathList,
                    id.replaceAll("트랙", ""),
                    id.replaceAll("트랙", "") as keyof typeof CareerPath,
                  );
                  const key = id.replaceAll("트랙", "") as keyof typeof CareerPath;
                  return CareerPath[key];
                })
                .filter((v) => v !== undefined)
            : [],
        }));
        onNext();
      } else {
        setError("데이터 연동에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      setError("데이터 연동 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl min-w-2xl container mx-auto p-8 backdrop-blur-sm bg-white/90 shadow-2xl border border-white/20 animate-fade-in">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-600 mb-4 shadow-lg animate-bounce-slow">
          <IconLock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          데이터 연동 안내
        </h2>
        <p className="text-slate-500 mt-2 mx-auto text-base leading-relaxed">
          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            '한성 길라잡이'
          </span>
          는 아래 정보를 바탕으로 맞춤형 서비스를 제공합니다.
          <br />
          아래 정보를 안전하게 연동합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-blue-100 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-blue-600 bg-white shadow-md">
            <IconUser className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800">기본 프로필 정보</p>
            <p className="text-sm text-slate-500">이름, 학번, 학과, 학년</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-purple-100 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-200">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-purple-600 bg-white shadow-md">
            <IconBook className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800">수강 과목 및 성적 정보</p>
            <p className="text-sm text-slate-500">이수한 과목, 성적, 학점</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl border-2 bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-green-100 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-400">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg text-green-600 bg-white shadow-md">
            <IconCalendar className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-slate-800">시간표 정보</p>
            <p className="text-sm text-slate-500">현재 학기 시간표 및 수강 일정</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-6">
        <input
          id="policy-check"
          type="checkbox"
          checked={policyChecked}
          onChange={(e) => setPolicyChecked(e.target.checked)}
          className="accent-blue-600 w-5 h-5 rounded border-slate-300 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
        <label htmlFor="policy-check" className="text-xs text-slate-600 select-none">
          <button
            type="button"
            onClick={onOpenPolicy}
            className="text-blue-600 hover:text-purple-600 hover:underline font-medium mr-1 transition-all duration-200"
          >
            개인정보 수집 및 이용 동의서
          </button>
          를 모두 읽고 동의합니다.
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mb-4 p-3 bg-red-50 rounded-lg border border-red-200 animate-pop">
          {error}
        </div>
      )}

      <Button
        onClick={handleFetch}
        variant="primary"
        className="w-full font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-purple-500/30 flex items-center justify-center gap-2 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isLoading || !policyChecked}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>데이터 연동 중...</span>
          </>
        ) : (
          "데이터 연동하기"
        )}
      </Button>
    </Card>
  );
};

const PreferencesStep = ({
  preferences,
  setPreferences,
  onNext,
  onPrev,
  onRecommendRoadmaps,
  authInfo,
  setStep,
  setAnalysisLoading,
}: {
  preferences: UserPreferences;
  setPreferences: (fn: (prev: UserPreferences) => UserPreferences) => void;
  onNext: () => void;
  onPrev: () => void;
  onRecommendRoadmaps: (recommandProps: RecommendProps) => Promise<boolean>;
  authInfo: AuthInfo;
  setStep: (step: number) => void;
  setAnalysisLoading: (loading: boolean) => void;
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [interestInput, setInterestInput] = useState("");

  const handleUpdate = (
    key: keyof UserPreferences,
    value: UserPreferences[keyof UserPreferences],
  ) => setPreferences((prev) => ({ ...prev, [key]: value }));
  const handleUpdateStudyStyle = (key: string, value: unknown) =>
    setPreferences((prev) => ({ ...prev, studyStyle: { ...prev.studyStyle, [key]: value } }));

  const handleSelectPath = (path: CareerPath) => {
    const newPaths = preferences.careerPaths.includes(path)
      ? preferences.careerPaths.filter((p: CareerPath) => p !== path)
      : [...preferences.careerPaths, path];

    if (newPaths.length <= 2) {
      handleUpdate("careerPaths", newPaths);
    }
  };

  const handleAddInterest = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      interestInput.trim() &&
      !preferences.interests.includes(interestInput.trim())
    ) {
      handleUpdate("interests", [...preferences.interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    handleUpdate(
      "interests",
      preferences.interests.filter((i) => i !== interest),
    );
  };

  const handleToggleGoal = (goal: string) => {
    const newGoals = preferences.academicGoals.includes(goal)
      ? preferences.academicGoals.filter((g: string) => g !== goal)
      : [...preferences.academicGoals, goal];
    handleUpdate("academicGoals", newGoals);
  };

  const careerOptions = [
    {
      id: CareerPath.MOBILE_SOFTWARE,
      label: "모바일소프트웨어",
      icon: <IconCpu />,
      description: "iOS/Android 앱 개발",
    },
    {
      id: CareerPath.WEB_ENGINEERING,
      label: "웹공학",
      icon: <IconWorld />,
      description: "웹 서비스 개발",
    },
    {
      id: CareerPath.BIG_DATA,
      label: "빅데이터",
      icon: <IconBarChart2 />,
      description: "데이터 분석 및 처리",
    },
    {
      id: CareerPath.DIGITAL_CONTENTS_VR,
      label: "디지털콘텐츠·가상현실",
      icon: <IconCube />,
      description: "VR/AR, 게임 개발",
    },
  ];

  const studyStyleOptions = {
    creditLoad: [
      { id: "light", label: "가벼운 (12-15학점)" },
      { id: "normal", label: "보통 (16-18학점)" },
      { id: "heavy", label: "많은 (19-21학점)" },
    ],
    preference: [
      { id: "theory", label: "이론 중심" },
      { id: "balanced", label: "균형 잡힌" },
      { id: "practice", label: "실습 중심" },
    ],
    ratio: [
      { id: "major", label: "전공 위주" },
      { id: "balanced", label: "균형 잡힌" },
      { id: "general", label: "교양 중심" },
    ],
  };

  const academicGoals = [
    { id: "employment", label: "취업 준비", icon: <IconBriefcase /> },
    { id: "graduate", label: "대학원 진학", icon: <IconMortarBoard /> },
    { id: "startup", label: "창업", icon: <IconRocket /> },
    { id: "certification", label: "자격증 취득", icon: <IconTrophy /> },
  ];

  const isCareerPathValid = preferences.careerPaths.length === 2;
  return (
    <Card className="max-w-4xl container mx-auto p-8">
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
            <span className="text-purple-500 font-bold">1.</span> 트랙을 선택해주세요. (최대 2개)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerOptions.map((career) => (
              <button
                key={career.id}
                onClick={() => handleSelectPath(career.id)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${
                  preferences.careerPaths.includes(career.id)
                    ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500"
                    : "bg-white hover:border-purple-300"
                } ${preferences.careerPaths.length >= 2 && !preferences.careerPaths.includes(career.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={
                  preferences.careerPaths.length >= 2 &&
                  !preferences.careerPaths.includes(career.id)
                }
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
                  {key === "creditLoad"
                    ? "학기 당 수강 학점"
                    : key === "preference"
                      ? "이론/실습 선호도"
                      : "전공/교양 비중"}
                </label>
                <div className="flex bg-slate-100 p-1 rounded-lg mt-1">
                  {options.map((option: { id: string; label: string }) => (
                    <button
                      key={option.id}
                      onClick={() => handleUpdateStudyStyle(key, option.id)}
                      className={`flex-1 text-sm py-2 rounded-md font-semibold transition-all duration-200 ${
                        (preferences.studyStyle as unknown as Record<string, string>)[key] ===
                        option.id
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-slate-500 hover:bg-white/50"
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
                  onChange={(e) => handleUpdate("minor", e.target.value)}
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
                          ? "bg-purple-100 border-purple-500 text-purple-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                      }`}
                    >
                      {goal.icon}
                      <span>{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="interests"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
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

      <div className="mt-8 flex flex-col gap-2">
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="w-1/3 font-bold py-3 px-4 rounded-xl"
            onClick={onPrev}
          >
            이전
          </Button>
          <Button
            onClick={async () => {
              const recommandProps = {
                student_id: authInfo.userId,
                track_ids:
                  preferences.careerPaths.length > 0
                    ? preferences.careerPaths.map(
                        (path) => careerOptions.findIndex((option) => option.id === path) + 1,
                      )
                    : [0],
                learning_style: {
                  credits_per_semester:
                    studyStyleOptions.creditLoad.find(
                      (opt) => opt.id === preferences.studyStyle.creditLoad,
                    )?.label || "보통 (16-18학점)",
                  style_preference:
                    studyStyleOptions.preference.find(
                      (opt) => opt.id === preferences.studyStyle.preference,
                    )?.label || "균형 잡힌",
                  ratio_preference:
                    studyStyleOptions.ratio.find((opt) => opt.id === preferences.studyStyle.ratio)
                      ?.label || "균형 잡힌",
                },
                advanced_settings: {
                  tech_stack: preferences.interests.join(", ") || "",
                },
              };
              setAnalysisLoading(true);
              setStep(3);
              const result = await onRecommendRoadmaps(recommandProps);
              if (!result) {
                setStep(2);
              }
              setAnalysisLoading(false);
            }}
            variant="primary"
            className="w-2/3 font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/30"
            disabled={!isCareerPathValid}
          >
            AI 분석 시작
          </Button>
        </div>
        {!isCareerPathValid && (
          <div className="text-red-500 text-sm text-center mt-2">
            트랙을 2개 모두 선택해야 AI 분석을 시작할 수 있습니다.
          </div>
        )}
      </div>
    </Card>
  );
};

const AnalysisStep = ({
  onNext,
  analysisLoading,
}: {
  onNext: () => void;
  analysisLoading: boolean;
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [done, setDone] = useState(false);

  const messages = [
    "수강 이력을 분석하고 있습니다...",
    "AI가 맞춤형 로드맵을 생성하고 있습니다...",
    "추천 과목을 선별하고 있습니다...",
  ];
  useEffect(() => {
    if (!analysisLoading) return;
    let interval: NodeJS.Timeout | null = null;

    setDone(false);
    setProgress(0);
    setCurrentMessage(0);

    // Step 1: 0~33%, Step 2: 34~66%, Step 3: 67~70% (wait for analysisLoading)
    let stage = 0;

    const advanceStage = () => {
      stage += 1;
      setCurrentMessage(stage);
    };

    const runProgress = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (stage === 0 && prev < 33) {
            return prev + 4;
          }
          if (stage === 1 && prev < 66) {
            return prev + 4;
          }
          if (stage === 2 && prev < 70) {
            return prev + 3;
          }
          return prev;
        });
      }, 100);
    };

    // Stage 1: 0~33%
    runProgress();
    const t1 = setTimeout(() => {
      advanceStage(); // message 1 -> 2
      runProgress();
      const t2 = setTimeout(() => {
        advanceStage(); // message 2 -> 3
        runProgress();
      }, 2000);
      // Cleanup t2 on unmount
      return () => clearTimeout(t2);
    }, 2000);

    return () => {
      if (interval) clearInterval(interval);
      clearTimeout(t1);
    };
  }, [analysisLoading]);

  useEffect(() => {
    let fastInterval: NodeJS.Timeout | null = null;
    // When analysisLoading === false, quickly fill to 100% and go next
    if (!analysisLoading && progress >= 70 && currentMessage === 2 && !done) {
      fastInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (fastInterval) clearInterval(fastInterval);
            setDone(true);
            setTimeout(onNext, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
    }
    return () => {
      if (fastInterval) clearInterval(fastInterval);
    };
  }, [analysisLoading, progress, currentMessage, done, onNext]);

  return (
    <Card className="max-w-2xl container mx-auto p-8 text-center">
      <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 mb-6 animate-pulse">
        <IconSparkles />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">AI 분석 중...</h2>
      <p className="text-slate-500 mb-8">{messages[currentMessage]}</p>
      <ProgressBar value={progress} max={100} className="mb-4" showLabel />
      {done && <div className="text-emerald-600 font-bold mt-4">AI 분석이 완료되었습니다!</div>}
    </Card>
  );
};

const CompletionStep = ({ onFinish, onBack }: { onFinish: () => void; onBack: () => void }) => (
  <Card className="max-w-2xl mx-auto p-8 container text-center">
    <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
      <IconCheck />
    </div>

    <h2 className="text-2xl font-bold text-slate-800 mb-4">로드맵 생성 완료!</h2>
    <p className="text-slate-500 mb-8">당신만의 맞춤형 학습 로드맵이 준비되었습니다.</p>

    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
      {[
        { icon: <IconMap />, title: "맞춤형 로드맵", desc: "AI가 분석한 최적의 수강 경로" },
        { icon: <IconTrophy />, title: "성취 목표", desc: "단계별 학습 목표와 마일스톤" },
        { icon: <IconCalendar />, title: "학기별 계획", desc: "체계적인 시간표 및 일정 관리" },
        { icon: <IconSparkles />, title: "AI 추천", desc: "지속적인 맞춤형 과목 추천" },
      ].map((feature, index) => (
        <div key={index} className="p-4 bg-slate-50 rounded-lg">
          <div className="text-blue-600 mb-2">{feature.icon}</div>
          <h4 className="font-semibold text-slate-800">{feature.title}</h4>
          <p className="text-xs text-slate-500">{feature.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <Button
        onClick={onBack}
        variant="secondary"
        className="w-full sm:w-1/3 font-bold py-3 px-4 rounded-xl"
      >
        재설정
      </Button>
      <Button
        onClick={onFinish}
        variant="primary"
        className="w-full sm:w-2/3 font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/30"
      >
        한성 길라잡이 시작하기
      </Button>
    </div>
    <p className="text-xs text-slate-400 mt-4">
      로드맵은 언제든지 &apos;로드맵&apos; 탭에서 수정하고 자세히 볼 수 있어요.
    </p>
  </Card>
);

export const OnboardingScreen = ({
  authInfo,
  onComplete,
  onRecommendRoadmaps,
  onInfoFetch,
}: OnboardingScreenProps) => {
  const [step, setStep] = useState(1);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [consentChoices, setConsentChoices] = useState<ConsentChoices>({
    profile: true,
    courses: true,
    timetable: true,
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    careerPaths: [],
    studyStyle: {
      creditLoad: "normal",
      preference: "balanced",
      ratio: "balanced",
    },
    interests: [],
    minor: "",
    academicGoals: [],
  });

  const handleFinish = () => {
    const tracks = preferences.careerPaths
      .filter((p) => p !== CareerPath.NONE)
      .map((p) => `${p} 트랙` as Track);
    while (tracks.length < 2) {
      tracks.push("트랙 미지정");
    }
    setToast({ message: "로드맵이 생성되었습니다!", type: "success" });
    setTimeout(() => {
      setToast(null);
      onComplete();
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
            setPreferences={setPreferences}
            onOpenPolicy={() => setIsPolicyModalOpen(true)}
            onInfoFetch={onInfoFetch}
          />
        );
      case 2:
        return (
          <PreferencesStep
            preferences={preferences}
            setPreferences={setPreferences}
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
            onRecommendRoadmaps={onRecommendRoadmaps}
            authInfo={authInfo}
            setStep={setStep}
            setAnalysisLoading={setAnalysisLoading}
          />
        );
      case 3:
        return <AnalysisStep onNext={() => setStep(4)} analysisLoading={analysisLoading} />;
      case 4:
        return <CompletionStep onFinish={handleFinish} onBack={() => setStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col relative overflow-hidden ${fadeIn}`}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/40 to-purple-400/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300/40 to-pink-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse-glow"></div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full opacity-40 animate-float animation-delay-3000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center gap-3 text-slate-700 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg">
            <IconCompass className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            한성 길라잡이
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center p-4 sm:p-6">
        <div className="animate-fade-up">
          <ProgressIndicator currentStep={step} />
        </div>
        <div className="animate-fade-in animation-delay-200">{renderStep()}</div>
      </main>

      {/* Modals */}
      {isPolicyModalOpen && <PrivacyPolicyModal onClose={() => setIsPolicyModalOpen(false)} />}
    </div>
  );
};
