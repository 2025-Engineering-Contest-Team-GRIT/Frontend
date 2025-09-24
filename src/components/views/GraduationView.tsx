"use client";

import React, { useMemo, useState, useEffect } from "react";
import type { GraduationInfo } from "@/types";
import { CourseCategory, CourseStatus } from "@/types";
import {
  Card,
  IconCube,
  IconBook,
  IconTrophy,
  IconMortarBoard,
  IconRocket,
  IconArrowLeft,
  IconCheck,
  IconChevronRight,
} from "../common";
import { ProgressBar } from "../ProgressBar";
import { Button } from "../Button";
import { Toast } from "../Toast";
import { fadeIn } from "../animations";

interface GraduationViewProps {
  graduationInfo: GraduationInfo;
  onCertificationChange?: (type: string, isCompleted: boolean) => Promise<boolean>;
}

export const GraduationView: React.FC<GraduationViewProps> = ({
  graduationInfo,
  onCertificationChange,
}) => {
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

  // 충족 여부 계산
  const allTracksMet = graduationInfo.track_progress_list.every(
    (track) =>
      track.major_basic.completed_credits >= track.major_basic.required_credits &&
      track.major_required.completed_credits >= track.major_required.required_credits &&
      track.major_subtotal.completed_credits >= track.major_subtotal.required_credits,
  );
  const totalCreditsMet =
    graduationInfo.total_completed_credits >= graduationInfo.total_required_credits;
  const certificationMet = graduationInfo.certifications.some((c) => c.completed);
  const allMet = allTracksMet && totalCreditsMet && certificationMet;

  // 남은 요건
  const remainingRequirements: string[] = [];
  if (!totalCreditsMet) remainingRequirements.push("총 이수 학점 충족");
  graduationInfo.track_progress_list.forEach((track) => {
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
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <div className="w-6 h-6 flex items-center justify-center bg-violet-100 text-violet-600 rounded-lg">
          <IconMortarBoard />
        </div>
        <span>졸업 요건</span>
      </h2>

      <SummaryCard />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Column 1: 학점/인증 */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-slate-700 text-base mb-2">총 이수 학점</h3>
            <div className="text-center">
              <span className="text-2xl font-bold text-sky-600">
                {graduationInfo.total_completed_credits}
              </span>
              <span className="text-base text-slate-500 font-medium"> / 130 학점</span>
            </div>
            <div className="mt-2">
              <ProgressBar
                value={graduationInfo.total_completed_credits}
                max={130}
                className="h-2 bg-sky-200"
              />
            </div>
          </Card>

          {/* 인증 요건 */}
          {selectedCertification ? (
            <Card className="p-4">
              <Button
                onClick={() => setSelectedCertification(null)}
                variant="secondary"
                className="flex items-center gap-1 text-xs font-semibold mb-2 px-2 py-1"
              >
                <IconArrowLeft className="w-3 h-3" />
                목록으로 돌아가기
              </Button>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg text-sky-600 bg-sky-100">
                  {certificationDescriptions[selectedCertification]?.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {certificationDescriptions[selectedCertification]?.label ??
                      selectedCertification}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {certificationDescriptions[selectedCertification]?.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      className="text-xs px-3 py-1"
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
                      className="text-xs px-3 py-1"
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
            <Card className="p-4">
              <h3 className="font-bold text-slate-700 text-base mb-2">졸업 인증 요건 (택 1)</h3>
              <div className="space-y-2">
                {graduationInfo.certifications.map((cert) => (
                  <Button
                    key={cert.certification_name}
                    onClick={() => setSelectedCertification(cert.certification_name)}
                    variant={cert.completed ? "primary" : "outline"}
                    className={`w-full text-left flex items-center gap-2 p-2 rounded-lg border duration-200 text-xs ${cert.completed ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}
                  >
                    <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg text-sky-600 bg-sky-100">
                      {certificationDescriptions[cert.certification_name]?.icon ?? <IconTrophy />}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 text-xs">
                        {certificationDescriptions[cert.certification_name]?.label ??
                          cert.certification_name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {certificationDescriptions[cert.certification_name]?.description}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      {cert.completed ? (
                        <span className="text-emerald-500 font-bold">완료</span>
                      ) : (
                        <span className="text-slate-400">미완료</span>
                      )}
                      <span className="text-slate-300">
                        <IconChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Column 2: 트랙별 진행 */}
        <div className="space-y-4 h-full">
          <Card className="p-4 flex flex-col gap-8">
            {graduationInfo.track_progress_list.map((track) => (
              <div key={track.track_name}>
                <h3 className="font-bold text-slate-700 text-base mb-2">{track.track_name}</h3>
                <div className="space-y-2 text-slate-500">
                  <div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-semibold text-slate-600 text-xs">전공 기초</p>
                      <p className="text-xs font-medium">
                        <span
                          className={
                            track.major_basic.completed_credits >=
                            track.major_basic.required_credits
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {track.major_basic.completed_credits}
                        </span>
                        {" / "}
                        {track.major_basic.required_credits} 학점
                      </p>
                    </div>
                    <ProgressBar
                      value={track.major_basic.completed_credits}
                      max={track.major_basic.required_credits}
                      className="h-2 bg-emerald-100"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-semibold text-slate-600 text-xs">전공 필수</p>
                      <p className="text-xs font-medium">
                        <span
                          className={
                            track.major_required.completed_credits >=
                            track.major_required.required_credits
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {track.major_required.completed_credits}
                        </span>
                        {" / "}
                        {track.major_required.required_credits} 학점
                      </p>
                    </div>
                    <ProgressBar
                      value={track.major_required.completed_credits}
                      max={track.major_required.required_credits}
                      className="h-2 bg-teal-100"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-semibold text-slate-600 text-xs">
                        전공 소계 (기초+필수+선택)
                      </p>
                      <p className="text-xs font-medium">
                        <span
                          className={
                            track.major_subtotal.completed_credits >=
                            track.major_subtotal.required_credits
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }
                        >
                          {track.major_subtotal.completed_credits}
                        </span>
                        {" / "}
                        {track.major_subtotal.required_credits} 학점
                      </p>
                    </div>
                    <ProgressBar
                      value={track.major_subtotal.completed_credits}
                      max={track.major_subtotal.required_credits}
                      className="h-2 bg-cyan-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
