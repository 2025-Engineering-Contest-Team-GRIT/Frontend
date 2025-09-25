"use client";

import React, { useState, useMemo } from "react";
import { usePlans } from "@/hooks/useData";
import type { TrackProgress, Certification } from "@/types";
import { AuthInfo, plan } from "@/types";
import type { GraduationInfo } from "@/types";
import {
  Card,
  IconCube,
  IconBook,
  IconTrophy,
  IconMortarBoard,
  IconRocket,
  IconArrowLeft,
  IconChevronRight,
} from "../common";
import { ProgressBar } from "../ProgressBar";
import { Button } from "../Button";
import { Toast } from "../Toast";
import { useSimulationStore } from "@/store";
// 시뮬레이션 추가 모달 컴포넌트 (간단 목업)
const AddPlanModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
        <h4 className="font-bold text-slate-800 text-base">새 시뮬레이션 추가</h4>
        <input
          className="border border-slate-200 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
          placeholder="시뮬레이션 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button
            className="flex-1 px-3 py-2 rounded bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600"
            onClick={() => {
              if (name.trim()) {
                onAdd(name);
                setName("");
              }
            }}
          >
            추가
          </button>
          <button
            className="flex-1 px-3 py-2 rounded bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export type GraduationViewProps = {
  graduationInfo: GraduationInfo;
  onCertificationChange?: (type: string, isCompleted: boolean) => Promise<boolean>;
  authInfo?: AuthInfo | null;
};

export const GraduationView: React.FC<GraduationViewProps> = ({
  graduationInfo,
  onCertificationChange,
  authInfo,
}) => {
  // 시뮬레이션 추가 모달 상태 및 목업 데이터
  const [addModalOpen, setAddModalOpen] = useState(false);
  // 시뮬레이션(플랜) 데이터 불러오기
  const {
    data: plans,
    isLoading: loadingPlans,
    refetch: refetchPlans,
  } = usePlans(authInfo ?? null);
  // 실제 plans가 없을 때도 목업 1개는 항상 보이게
  const mockPlan: plan = {
    plan_id: 0,
    plan_name: "2025년 2학기 시뮬레이션",
    created_at: new Date().toISOString(),
  };
  // plans가 없으면 목업 1개, 있으면 plans만
  const displayPlans = plans && plans.length > 0 ? plans : [mockPlan];
  const [planActionLoading, setPlanActionLoading] = useState(false);
  // plan 카드 액션 핸들러(아직 미구현)
  const handleViewPlan = (plan: plan) => {
    // TODO: 시뮬레이션 상세 보기 로직
  };
  const handleDeletePlan = async (plan: plan) => {
    // TODO: 시뮬레이션 삭제 로직
  };
  const handleRefreshPlans = async () => {
    setPlanActionLoading(true);
    await refetchPlans();
    setPlanActionLoading(false);
  };
  // 인증 요건 설명 매핑 (예시)
  const certificationDescriptions: Record<
    string,
    { label: string; description: string; icon: React.ReactNode; type: string }
  > = {
    "캡스톤디자인 발표회 작품 출품": {
      label: "캡스톤디자인 발표회 작품 출품",
      description:
        "필수 캡스톤디자인 과목을 이수해야 합니다. 관련 과목 이수 시 자동으로 완료 처리됩니다.",
      icon: <IconCube />,
      type: "capstone",
    },
    "졸업 논문": {
      label: "졸업 논문",
      description: "지도교수님과 상의하여 논문을 작성하고 심사를 통과해야 합니다.",
      icon: <IconBook />,
      type: "thesis",
    },
    "전공 관련 자격증/공모전 입상": {
      label: "전공 관련 자격증/공모전 입상",
      description: "관련 성과를 제출하여 교수회의 심사를 통과해야 합니다.",
      icon: <IconTrophy />,
      type: "award",
    },
  };

  const [selectedCertification, setSelectedCertification] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  // 시뮬레이션 스토어에서 데이터 가져오기
  const {
    roadmapCourses,
    changedTracks,
    userTracks,
    graduationInfo: storeGraduationInfo,
  } = useSimulationStore();

  // 시뮬레이션 데이터가 적용된 졸업 진도 계산
  const updatedGraduationInfo = useMemo(() => {
    if (!storeGraduationInfo || (!roadmapCourses.length && !Object.keys(changedTracks).length)) {
      return graduationInfo;
    }

    // 기본 졸업 정보를 복사
    const updated = JSON.parse(JSON.stringify(graduationInfo)) as GraduationInfo;

    // 시뮬레이션으로 추가된 과목들의 학점 계산
    let totalAdditionalCredits = 0;
    const trackCreditMap: Record<
      number,
      { mandatory: number; elective: number; foundation: number }
    > = {};

    // 추가된 과목들 처리
    roadmapCourses.forEach((course) => {
      const trackId = course.track_id;
      if (trackId == null) return; // track_id가 없는 경우 스킵

      totalAdditionalCredits += course.credits;

      if (!trackCreditMap[trackId]) {
        trackCreditMap[trackId] = { mandatory: 0, elective: 0, foundation: 0 };
      }

      switch (course.course_type) {
        case "전공필수":
          trackCreditMap[trackId].mandatory += course.credits;
          break;
        case "전공선택":
          trackCreditMap[trackId].elective += course.credits;
          break;
        case "전공기초":
          trackCreditMap[trackId].foundation += course.credits;
          break;
      }
    });

    // 총 학점 업데이트
    updated.total_completed_credits += totalAdditionalCredits;

    // 트랙별 진도 업데이트
    updated.track_progress_list = updated.track_progress_list.map((track) => {
      const trackId = userTracks.find((t) => t.track_name === track.track_name)?.track_id;
      if (trackId && trackCreditMap[trackId]) {
        const additionalCredits = trackCreditMap[trackId];
        return {
          ...track,
          major_required: {
            ...track.major_required,
            completed_credits: track.major_required.completed_credits + additionalCredits.mandatory,
          },
          major_basic: {
            ...track.major_basic,
            completed_credits: track.major_basic.completed_credits + additionalCredits.foundation,
          },
          major_subtotal: {
            ...track.major_subtotal,
            completed_credits:
              track.major_subtotal.completed_credits +
              additionalCredits.mandatory +
              additionalCredits.elective +
              additionalCredits.foundation,
          },
        };
      }
      return track;
    });

    return updated;
  }, [graduationInfo, roadmapCourses, changedTracks, userTracks, storeGraduationInfo]);

  // 충족 여부 계산 (업데이트된 정보 사용)
  const allTracksMet = updatedGraduationInfo.track_progress_list.every(
    (track: TrackProgress) =>
      track.major_basic.completed_credits >= track.major_basic.required_credits &&
      track.major_required.completed_credits >= track.major_required.required_credits &&
      track.major_subtotal.completed_credits >= track.major_subtotal.required_credits,
  );
  const totalCreditsMet =
    updatedGraduationInfo.total_completed_credits >= updatedGraduationInfo.total_required_credits;
  const certificationMet = updatedGraduationInfo.certifications.some((c) => c.completed);
  const allMet = allTracksMet && totalCreditsMet && certificationMet;

  // 남은 요건 (업데이트된 정보 사용)
  const remainingRequirements: string[] = [];
  if (!totalCreditsMet) remainingRequirements.push("총 이수 학점 충족");
  updatedGraduationInfo.track_progress_list.forEach((track) => {
    if (track.major_basic.completed_credits < track.major_basic.required_credits)
      remainingRequirements.push(`${track.track_name} 전공기초 학점`);
    if (track.major_required.completed_credits < track.major_required.required_credits)
      remainingRequirements.push(`${track.track_name} 전공필수 학점`);
    if (track.major_subtotal.completed_credits < track.major_subtotal.required_credits)
      remainingRequirements.push(`${track.track_name} 전공소계 학점`);
  });
  if (!certificationMet) remainingRequirements.push("졸업 인증 요건 충족");

  // 요약 카드
  const SummaryCard = () => {
    if (allMet) {
      return (
        <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center text-emerald-600 bg-white rounded-full shadow">
              <IconTrophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-800">
                축하합니다! 졸업 요건을 모두 충족했습니다!
              </h3>
              <p className="text-emerald-700 mt-0.5 text-xs">미래를 향한 다음 걸음을 응원합니다.</p>
            </div>
          </div>
        </Card>
      );
    }
    return (
      <Card className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center text-sky-600 bg-white rounded-full shadow">
            <IconRocket className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-sky-800">
              졸업까지 {remainingRequirements.length}개의 요건이 남았어요!
            </h3>
            <p className="text-sky-700 mt-0.5 text-xs">
              남은 요건: {remainingRequirements.slice(0, 2).join(", ")}
              {remainingRequirements.length > 2 ? " 등" : ""}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4 h-full overflow-y-auto relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-violet-200/30 to-purple-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-20 -left-20 w-48 h-48 bg-gradient-to-br from-emerald-200/30 to-teal-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text text-transparent flex items-center gap-3 mb-6 animate-fade-in">
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-200 text-violet-600 rounded-xl shadow-lg animate-bounce-slow">
            <IconMortarBoard />
          </div>
          <span>졸업 요건</span>
        </h2>

        <div className="animate-fade-up">
          <SummaryCard />
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Column 1: 학점/인증 */}
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-sky-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-sky-600 text-sm">📚</span>
                </div>
                총 이수 학점
              </h3>
              <div className="text-center py-4">
                <span className="text-4xl font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  {updatedGraduationInfo.total_completed_credits}
                </span>
                <span className="text-lg text-slate-500 font-medium ml-2">/ 130 학점</span>
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={updatedGraduationInfo.total_completed_credits}
                  max={130}
                  className="h-3 bg-gradient-to-r from-sky-100 to-blue-100 shadow-inner"
                />
              </div>
            </Card>

            {/* 인증 요건 */}
            {selectedCertification ? (
              <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                <Button
                  onClick={() => setSelectedCertification(null)}
                  variant="secondary"
                  className="flex items-center gap-2 text-sm font-semibold mb-4 px-3 py-2 bg-gradient-to-r from-slate-100 to-gray-100 hover:from-slate-200 hover:to-gray-200 transition-all duration-200 shadow-sm"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  목록으로 돌아가기
                </Button>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600 shadow-lg">
                    {certificationDescriptions[selectedCertification]?.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {certificationDescriptions[selectedCertification]?.label ??
                        selectedCertification}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {certificationDescriptions[selectedCertification]?.description}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        variant="primary"
                        className="text-sm px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        onClick={async () => {
                          if (onCertificationChange) {
                            const ok = await onCertificationChange(
                              certificationDescriptions[selectedCertification]?.type,
                              true,
                            );
                            setToast({
                              message: ok ? "완료로 처리되었습니다." : "처리에 실패했습니다.",
                              type: ok ? "success" : "error",
                            });
                            setSelectedCertification(null);
                          }
                        }}
                      >
                        완료로 처리
                      </Button>
                      <Button
                        variant="outline"
                        className="text-sm px-4 py-2 bg-white/80 hover:bg-white border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                        onClick={async () => {
                          if (onCertificationChange) {
                            const ok = await onCertificationChange(
                              certificationDescriptions[selectedCertification]?.type,
                              false,
                            );
                            setToast({
                              message: ok ? "미완료로 처리되었습니다." : "처리에 실패했습니다.",
                              type: ok ? "success" : "error",
                            });
                            setSelectedCertification(null);
                          }
                        }}
                      >
                        미완료로 처리
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                <h3 className="font-bold text-slate-700 text-lg mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 text-sm">🏆</span>
                  </div>
                  졸업 인증 요건 (택 1)
                </h3>
                <div className="space-y-3">
                  {updatedGraduationInfo.certifications.map((cert: Certification) => (
                    <Button
                      key={cert.certification_name}
                      onClick={() => setSelectedCertification(cert.certification_name)}
                      variant={cert.completed ? "primary" : "outline"}
                      className={`w-full text-left flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                        cert.completed
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg"
                          : "bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50"
                      }`}
                    >
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 text-sky-600 shadow-md">
                        {certificationDescriptions[cert.certification_name]?.icon ?? <IconTrophy />}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-slate-800 text-base">
                          {certificationDescriptions[cert.certification_name]?.label ??
                            cert.certification_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {certificationDescriptions[cert.certification_name]?.description}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        {cert.completed ? (
                          <span className="text-emerald-600 font-bold px-3 py-1 bg-emerald-100 rounded-full text-sm">
                            완료
                          </span>
                        ) : (
                          <span className="text-slate-400 px-3 py-1 bg-slate-100 rounded-full text-sm">
                            미완료
                          </span>
                        )}
                        <span className="text-slate-300">
                          <IconChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Column 2: 트랙별 진행 */}
          <div className="space-y-6 h-full animate-fade-in animation-delay-200">
            <Card className="p-6 flex flex-col gap-8 backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="font-bold text-slate-700 text-lg mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-violet-200 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📊</span>
                </div>
                트랙별 진행 상황
              </h3>
              {updatedGraduationInfo.track_progress_list.map(
                (track: TrackProgress, index: number) => (
                  <div
                    key={track.track_name}
                    className={`animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h4 className="font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent text-lg mb-4">
                      {track.track_name}
                    </h4>
                    <div className="space-y-4 text-slate-500">
                      <div className="p-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl backdrop-blur-sm">
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="font-semibold text-emerald-700 text-sm">전공 기초</p>
                          <p className="text-sm font-medium">
                            <span
                              className={
                                track.major_basic.completed_credits >=
                                track.major_basic.required_credits
                                  ? "text-emerald-600 font-bold"
                                  : "text-rose-600"
                              }
                            >
                              {track.major_basic.completed_credits}
                            </span>
                            <span className="text-slate-500">
                              {" "}
                              / {track.major_basic.required_credits} 학점
                            </span>
                          </p>
                        </div>
                        <ProgressBar
                          value={track.major_basic.completed_credits}
                          max={track.major_basic.required_credits}
                          className="h-3 bg-gradient-to-r from-emerald-100 to-teal-100 shadow-inner"
                        />
                      </div>

                      <div className="p-3 bg-gradient-to-r from-teal-50/80 to-cyan-50/80 rounded-xl backdrop-blur-sm">
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="font-semibold text-teal-700 text-sm">전공 필수</p>
                          <p className="text-sm font-medium">
                            <span
                              className={
                                track.major_required.completed_credits >=
                                track.major_required.required_credits
                                  ? "text-emerald-600 font-bold"
                                  : "text-rose-600"
                              }
                            >
                              {track.major_required.completed_credits}
                            </span>
                            <span className="text-slate-500">
                              {" "}
                              / {track.major_required.required_credits} 학점
                            </span>
                          </p>
                        </div>
                        <ProgressBar
                          value={track.major_required.completed_credits}
                          max={track.major_required.required_credits}
                          className="h-3 bg-gradient-to-r from-teal-100 to-cyan-100 shadow-inner"
                        />
                      </div>

                      <div className="p-3 bg-gradient-to-r from-cyan-50/80 to-sky-50/80 rounded-xl backdrop-blur-sm">
                        <div className="flex justify-between items-baseline mb-2">
                          <p className="font-semibold text-cyan-700 text-sm">
                            전공 소계 (기초+필수+선택)
                          </p>
                          <p className="text-sm font-medium">
                            <span
                              className={
                                track.major_subtotal.completed_credits >=
                                track.major_subtotal.required_credits
                                  ? "text-emerald-600 font-bold"
                                  : "text-rose-600"
                              }
                            >
                              {track.major_subtotal.completed_credits}
                            </span>
                            <span className="text-slate-500">
                              {" "}
                              / {track.major_subtotal.required_credits} 학점
                            </span>
                          </p>
                        </div>
                        <ProgressBar
                          value={track.major_subtotal.completed_credits}
                          max={track.major_subtotal.required_credits}
                          className="h-3 bg-gradient-to-r from-cyan-100 to-sky-100 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </Card>
          </div>
        </div>

        {/* 시뮬레이션(플랜) 목록 - 하단에 길게 배치 */}
        <div className="mt-8 relative hidden">
          <Card className="p-4 flex flex-col gap-8">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-600 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l9-5-9-5-9 5 9 5z" />
                    <path d="M12 12V4m0 0L3 9m9-5l9 5" />
                  </svg>
                </span>
                졸업 시뮬레이션
              </h3>
              <button
                className="ml-auto px-3 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 font-semibold flex items-center gap-1 disabled:opacity-60"
                onClick={handleRefreshPlans}
                disabled={planActionLoading}
                title="새로고침"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4v5h.582M20 20v-5h-.581M5.21 17.293A9 9 0 1 0 12 3v1" />
                </svg>
                새로고침
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingPlans ? (
                <div className="col-span-full flex justify-center items-center py-8">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-400 mr-2"
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
                  <span className="text-slate-500 text-sm">시뮬레이션을 불러오는 중...</span>
                </div>
              ) : (
                displayPlans.map((plan: plan) => (
                  <div
                    key={plan.plan_id}
                    className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 20l9-5-9-5-9 5 9 5z" />
                          <path d="M12 12V4m0 0L3 9m9-5l9 5" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{plan.plan_name}</div>
                        <div className="text-xs text-slate-400">
                          생성일: {new Date(plan.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 text-xs rounded bg-sky-100 hover:bg-sky-200 text-sky-700 border border-sky-200 font-semibold flex items-center gap-1"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        보기
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 font-semibold flex items-center gap-1"
                        onClick={() => handleDeletePlan(plan)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* 플로팅 추가 버튼 */}
            <button
              className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-all duration-200"
              style={{ boxShadow: "0 4px 24px 0 rgba(251, 191, 36, 0.15)" }}
              onClick={() => setAddModalOpen(true)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              시뮬레이션 추가
            </button>
          </Card>
          {/* 추가 모달 */}
          <AddPlanModal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onAdd={() => setAddModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
