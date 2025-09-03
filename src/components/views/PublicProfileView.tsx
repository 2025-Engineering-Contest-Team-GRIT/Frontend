'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';
import type { Student, TimetableSlot } from '@/types';
import { CourseStatus } from '@/types';
import { Card, IconCompass, IconLogOut, IconBarChart2, IconMortarBoard, IconCheck, IconTrophy, IconTarget, IconCalendar, IconBook, IconTag, IconArrowLeft } from '../common';
// import { BusinessCard } from '../components/BusinessCard';

// 임시 BusinessCard 컴포넌트
interface BusinessCardProps {
  student: Student;
  orientation: string;
  showStudentId: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ student, orientation, showStudentId }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-md">
    <div className="text-center">
      <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
      {showStudentId && <p className="text-sm text-slate-500 mt-1">{student.studentId}</p>}
      <p className="text-blue-600 font-semibold mt-2">{student.tracks.join(' / ')}</p>
      <p className="text-slate-600 mt-1">{student.careerPaths.join(' / ')}</p>
    </div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-sm p-4 rounded-xl flex items-center gap-4 ${className}`}>
    <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 text-blue-600">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-800">
        {value} <span className="text-sm font-medium text-slate-500">{subValue}</span>
      </p>
    </div>
  </div>
);

interface CompactTimetableProps {
  student: Student;
}

const CompactTimetable: React.FC<CompactTimetableProps> = ({ student }) => {
  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);

  if (!student.isTimetableConfigured || !student.timetable?.length) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
        <p className="text-slate-500 text-center py-8">이번 학기 시간표 정보가 없습니다.</p>
      </div>
    );
  }

  const getGridPosition = (slot: TimetableSlot) => {
    const dayIndex = days.indexOf(slot.day) + 2;
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const startRow = (startHour - 9) * 4 + startMinute / 15 + 2;
    const endRow = (endHour - 9) * 4 + endMinute / 15 + 2;

    return {
      gridColumn: `${dayIndex} / span 1`,
      gridRow: `${startRow} / span ${endRow - startRow}`,
    };
  };

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] h-full gap-x-1 text-xs">
      {/* Header */}
      <div className="row-start-1"></div>
      {days.map((day, i) => (
        <div key={day} className="text-center font-semibold text-slate-600" style={{ gridColumn: i + 2 }}>
          {day}
        </div>
      ))}

      {/* Time labels & Grid Lines */}
      {timeSlots.map((time, i) => (
        <div
          key={time}
          className="row-start-2 text-right text-[10px] text-slate-400 pr-2 -mt-2"
          style={{ gridRow: i * 4 + 2 }}
        >
          {time.split(':')[0]}
        </div>
      ))}
      {Array.from({ length: 44 }).map((_, i) => (
        <div
          key={`line-${i}`}
          className="col-start-2 col-span-5 border-t border-dotted border-slate-200"
          style={{ gridRow: i + 2 }}
        ></div>
      ))}

      {/* Timetable items */}
      {student.timetable?.map((slot, index) => (
        <div
          key={index}
          style={getGridPosition(slot)}
          className="p-1.5 bg-blue-100 border border-blue-200 rounded-md m-px flex flex-col justify-center overflow-hidden"
        >
          <p className="font-bold text-blue-800 leading-tight">{slot.courseName}</p>
          <p className="text-[10px] text-blue-600">{slot.location}</p>
        </div>
      ))}
    </div>
  );
};

interface CompletedCoursesListProps {
  student: Student;
  showGrades: boolean;
}

const CompletedCoursesList: React.FC<CompletedCoursesListProps> = ({ student, showGrades }) => {
  const completedCourses = React.useMemo(
    () =>
      student.roadmap.semesters
        .flatMap((s) => s.courses)
        .filter((c) => c.status === CourseStatus.COMPLETED)
        .sort((a, b) =>
          showGrades && a.grade && b.grade ? b.grade.localeCompare(a.grade) : 0
        ),
    [student.roadmap, showGrades]
  );

  if (completedCourses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
        <p className="text-slate-500 text-center py-8">이수한 과목 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2 h-full overflow-y-auto pr-2">
      {completedCourses.map((course) => (
        <li
          key={course.id}
          className="flex justify-between items-center bg-slate-50 hover:bg-white p-3 rounded-lg transition-shadow hover:shadow-sm border border-slate-200/80"
        >
          <div>
            <p className="font-semibold text-slate-800">{course.name}</p>
            <p className="text-sm text-slate-500">
              {course.category} / {course.credits}학점
            </p>
          </div>
          {showGrades && course.grade && (
            <span className="font-bold text-2xl text-blue-600">{course.grade}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

interface PublicProfileViewProps {
  student: Student;
  onGoBack: () => void;
  isExternal: boolean;
}


export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  student,
  onGoBack,
  isExternal,
}) => {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const totalCompletedCourses = React.useMemo(
    () =>
      student.roadmap.semesters
        .flatMap((s) => s.courses)
        .filter((c) => c.status === CourseStatus.COMPLETED).length,
    [student.roadmap]
  );

  const displayOptions = student.profileDisplayOptions || {
    showGrades: true,
    showTimetable: true,
    showStudentId: true,
  };

  const displayCareerPath =
    student.careerPaths.length > 0 ? student.careerPaths.join(' / ') : '미설정';

  const handleGoBack = () => {
    setToast({ message: isExternal ? '로그인 화면으로 이동합니다.' : '내 대시보드로 이동합니다.', type: 'info' });
    setTimeout(() => {
      setToast(null);
      onGoBack();
    }, 800);
  };

  // ...existing code...
  return (
    <div className={`min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 ${fadeIn}`}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-slate-500">
            <IconCompass />
            <span className="font-semibold">한성 길라잡이 공개 프로필</span>
          </div>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2 font-semibold text-slate-600 bg-white/80 py-2 px-4 rounded-lg shadow-sm hover:bg-white hover:text-slate-800 transition-all"
          >
            {isExternal ? <IconLogOut /> : <IconArrowLeft />}
            <span>{isExternal ? '로그인 화면으로' : '내 대시보드로'}</span>
          </Button>
        </header>

        <main className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-slate-600">명함에 마우스를 올리면 더 많은 정보를 볼 수 있어요.</p>
            <div className="mt-4 flex justify-center">
              <BusinessCard
                student={student}
                orientation="horizontal"
                showStudentId={displayOptions.showStudentId}
              />
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <IconBarChart2 /> <span>학업 통계 요약</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<IconMortarBoard />}
                label="총 이수 학점"
                value={student.completedCredits}
                subValue={`/ ${student.totalCredits} 학점`}
              />
              <StatCard
                icon={<IconCheck />}
                label="전공 과목 이수"
                value={totalCompletedCourses}
                subValue="과목"
              />
              {displayOptions.showGrades && (
                <StatCard
                  icon={<IconTrophy />}
                  label="전체 평점(GPA)"
                  value={student.gpa?.toFixed(2) ?? 'N/A'}
                  subValue="/ 4.5"
                />
              )}
              <StatCard
                icon={<IconTarget />}
                label="희망 진로"
                value={displayCareerPath}
                subValue=""
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: '400px' }}>
            {displayOptions.showTimetable && (
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <IconCalendar /> <span>현재 시간표</span>
                </h3>
                <CompactTimetable student={student} />
              </Card>
            )}
            {displayOptions.showGrades && (
              <Card className="p-6 flex flex-col">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <IconBook /> <span>주요 이수 과목 및 성적</span>
                </h3>
                <div className="flex-grow">
                  <CompletedCoursesList student={student} showGrades={displayOptions.showGrades} />
                </div>
              </Card>
            )}
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <IconTag /> <span>관심 기술 스택</span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {student.interests && student.interests.length > 0 ? (
                student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-md bg-purple-100 text-purple-800 font-medium px-4 py-2 rounded-lg"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">설정된 관심 기술이 없습니다.</span>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};
