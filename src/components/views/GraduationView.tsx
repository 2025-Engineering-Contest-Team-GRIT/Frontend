'use client';


import React, { useMemo, useState, useEffect } from 'react';
import type { Student } from '@/types';
import { CourseCategory, CourseStatus } from '@/types';
import { Card, IconCube, IconBook, IconTrophy, IconMortarBoard, IconRocket, IconArrowLeft, IconCheck, IconChevronRight } from '../common';
import { ProgressBar } from '../ProgressBar';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';

const GRAD_REQUIREMENTS = {
  TOTAL_CREDITS: 130,
  MAJOR_FOUNDATION: 3,
  MAJOR_MANDATORY: 15,
  MAJOR_TOTAL: 39,
};

interface GraduationViewProps {
  student: Student;
}


export const GraduationView: React.FC<GraduationViewProps> = ({ student }) => {
  const [selectedCertificationId, setSelectedCertificationId] = useState<string | null>(null);
  const [userCertifications, setUserCertifications] = useState<Record<string, boolean>>({
    capstone: false,
    thesis: false,
    license: false,
  });
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const certificationOptions = [
    {
      id: 'capstone',
      label: '캡스톤디자인 발표회 작품 출품',
      description: '필수 캡스톤디자인 과목을 이수해야 합니다. 관련 과목 이수 시 자동으로 완료 처리됩니다.',
      icon: <IconCube />,
    },
    {
      id: 'thesis',
      label: '졸업 논문',
      description: '지도교수님과 상의하여 논문을 작성하고 심사를 통과해야 합니다.',
      icon: <IconBook />,
    },
    {
      id: 'license',
      label: '전공 관련 자격증/공모전 입상',
      description: '관련 성과를 제출하여 교수회의 심사를 통과해야 합니다.',
      icon: <IconTrophy />,
    },
  ];

  useEffect(() => {
    const completedCourses = student.roadmap.semesters
      .flatMap((s) => s.courses)
      .filter((c) => c.status === CourseStatus.COMPLETED);
    const capstoneCompleted = completedCourses.some((c) => c.name && c.name.includes('캡스톤디자인'));

    setUserCertifications((prev) => ({
      ...prev,
      capstone: capstoneCompleted,
    }));
  }, [student.roadmap]);

  const graduationProgress = useMemo(() => {
    const completedCourses = student.roadmap.semesters
      .flatMap((s) => s.courses)
      .filter((c) => c.status === CourseStatus.COMPLETED);

    const totalCredits = completedCourses.reduce((acc, c) => acc + c.credits, 0);
    const totalCreditsMet = totalCredits >= GRAD_REQUIREMENTS.TOTAL_CREDITS;

    const trackProgress = student.tracks
      .filter((track) => track !== '트랙 미지정')
      .map((track) => {
        const trackCourses = completedCourses.filter((c) => c.track === track);

        const foundation = trackCourses
          .filter((c) => c.category === CourseCategory.FOUNDATION)
          .reduce((acc, c) => acc + c.credits, 0);
        const mandatory = trackCourses
          .filter((c) => c.category === CourseCategory.MANDATORY)
          .reduce((acc, c) => acc + c.credits, 0);
        const elective = trackCourses
          .filter((c) => c.category === CourseCategory.ELECTIVE)
          .reduce((acc, c) => acc + c.credits, 0);
        const majorTotal = foundation + mandatory + elective;

        return {
          trackName: track,
          foundation: {
            completed: foundation,
            required: GRAD_REQUIREMENTS.MAJOR_FOUNDATION,
            isMet: foundation >= GRAD_REQUIREMENTS.MAJOR_FOUNDATION,
          },
          mandatory: {
            completed: mandatory,
            required: GRAD_REQUIREMENTS.MAJOR_MANDATORY,
            isMet: mandatory >= GRAD_REQUIREMENTS.MAJOR_MANDATORY,
          },
          majorTotal: {
            completed: majorTotal,
            required: GRAD_REQUIREMENTS.MAJOR_TOTAL,
            isMet: majorTotal >= GRAD_REQUIREMENTS.MAJOR_TOTAL,
          },
        };
      });

    const allTrackRequirementsMet = trackProgress.every(
      (p) => p.foundation.isMet && p.mandatory.isMet && p.majorTotal.isMet
    );

    const certificationMet = Object.values(userCertifications).some((met) => met);

    const remainingRequirements = [];
    if (!totalCreditsMet) remainingRequirements.push('총 이수 학점 충족');

    trackProgress.forEach((p) => {
      if (!p.foundation.isMet) remainingRequirements.push(`${p.trackName.replace(' 트랙', '')} 전공기초 학점`);
      if (!p.mandatory.isMet) remainingRequirements.push(`${p.trackName.replace(' 트랙', '')} 전공필수 학점`);
      if (!p.majorTotal.isMet) remainingRequirements.push(`${p.trackName.replace(' 트랙', '')} 전공소계 학점`);
    });

    if (!certificationMet) remainingRequirements.push('졸업 인증 요건 충족');

    const allMet = totalCreditsMet && allTrackRequirementsMet && certificationMet;

    return { totalCredits, totalCreditsMet, trackProgress, certificationMet, allMet, remainingRequirements };
  }, [student, userCertifications]);

  const SummaryCard = () => {
    if (graduationProgress.allMet) {
      return (
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center text-emerald-500 bg-white rounded-full shadow-md">
              <IconTrophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-800">축하합니다! 졸업 요건을 모두 충족했습니다!</h3>
              <p className="text-emerald-700 mt-1">미래를 향한 다음 걸음을 응원합니다.</p>
            </div>
          </div>
        </Card>
      );
    }
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center text-blue-500 bg-white rounded-full shadow-md">
            <IconRocket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800">
              졸업까지 {graduationProgress.remainingRequirements.length}개의 요건이 남았어요!
            </h3>
            <p className="text-blue-700 mt-1">
              남은 요건: {graduationProgress.remainingRequirements.slice(0, 2).join(', ')}
              {graduationProgress.remainingRequirements.length > 2 ? ' 등' : ''}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  const selectedCert = certificationOptions.find((c) => c.id === selectedCertificationId);

  // ...existing code...
  return (
    <div className={`p-6 h-full overflow-y-auto ${fadeIn}`}>
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg">
          <IconMortarBoard />
        </div>
        <span>졸업 요건</span>
      </h2>

      <SummaryCard />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Column 1 */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-700 text-lg mb-4">총 이수 학점</h3>
            <div className="text-center">
              <span className="text-4xl font-bold text-blue-600">{graduationProgress.totalCredits}</span>
              <span className="text-lg text-slate-500 font-medium">
                {' '}
                / {GRAD_REQUIREMENTS.TOTAL_CREDITS} 학점
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={graduationProgress.totalCredits} max={GRAD_REQUIREMENTS.TOTAL_CREDITS} />
            </div>
          </Card>

          {selectedCertificationId && selectedCert ? (
            <Card className="p-6">
              <Button
                onClick={() => setSelectedCertificationId(null)}
                variant="secondary"
                className="flex items-center gap-1 text-sm font-semibold mb-4"
              >
                <IconArrowLeft className="w-4 h-4" />
                목록으로 돌아가기
              </Button>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg text-blue-600 bg-blue-100">
                  {selectedCert.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedCert.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedCert.description}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setUserCertifications({ ...userCertifications, [selectedCert.id]: true });
                    setToast({ message: '완료로 표시되었습니다.', type: 'success' });
                  }}
                  variant={userCertifications[selectedCert.id] ? 'primary' : 'outline'}
                  className="w-full py-3"
                >
                  완료로 표시
                </Button>
                <Button
                  onClick={() => {
                    setUserCertifications({ ...userCertifications, [selectedCert.id]: false });
                    setToast({ message: '미완료로 표시되었습니다.', type: 'info' });
                  }}
                  variant={!userCertifications[selectedCert.id] ? 'secondary' : 'outline'}
                  className="w-full py-3"
                >
                  미완료로 표시
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="font-bold text-slate-700 text-lg mb-4">졸업 인증 요건 (택 1)</h3>
              <div className="space-y-3">
                {certificationOptions.map((opt) => (
                  <Button
                    key={opt.id}
                    onClick={() => setSelectedCertificationId(opt.id)}
                    variant="outline"
                    className="w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 duration-300"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-blue-600 bg-blue-100">
                      {opt.icon}
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800">{opt.label}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {userCertifications[opt.id] ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                          <IconCheck className="w-3 h-3" />
                          완료
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          미완료
                        </span>
                      )}
                      <span className="text-slate-300"><IconChevronRight /></span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {graduationProgress.trackProgress.map(({ trackName, foundation, mandatory, majorTotal }) => (
            <Card key={trackName} className="p-6">
              <h3 className="font-bold text-slate-700 text-lg mb-4">{trackName}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-semibold text-slate-600">전공 기초</p>
                    <p className="text-sm font-medium">
                      <span className={`${foundation.isMet ? 'text-emerald-600' : 'text-rose-600'}`}>{foundation.completed}</span>{' '}/ {foundation.required} 학점
                    </p>
                  </div>
                  <ProgressBar value={foundation.completed} max={foundation.required} className="bg-green-500" />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-semibold text-slate-600">전공 필수</p>
                    <p className="text-sm font-medium">
                      <span className={`${mandatory.isMet ? 'text-emerald-600' : 'text-rose-600'}`}>{mandatory.completed}</span>{' '}/ {mandatory.required} 학점
                    </p>
                  </div>
                  <ProgressBar value={mandatory.completed} max={mandatory.required} className="bg-teal-500" />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-semibold text-slate-600">전공 소계 (기초+필수+선택)</p>
                    <p className="text-sm font-medium">
                      <span className={`${majorTotal.isMet ? 'text-emerald-600' : 'text-rose-600'}`}>{majorTotal.completed}</span>{' '}/ {majorTotal.required} 학점
                    </p>
                  </div>
                  <ProgressBar value={majorTotal.completed} max={majorTotal.required} className="bg-cyan-500" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
