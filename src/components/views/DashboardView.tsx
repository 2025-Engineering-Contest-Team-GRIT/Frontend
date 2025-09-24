"use client";

import React from "react";
import { Button } from "../Button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardInfo, Schedule, shortCourseInfo } from "@/types";
import { Card, IconUser, IconDashboard, IconSparkles } from "../common";

interface StudentInfoProps {
  dashboardInfo: DashboardInfo;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ dashboardInfo }) => {
  const { userInfo, academicStatus, careerGoal } = dashboardInfo;
  const creditData = [
    { name: "이수 학점", value: academicStatus.completedCredits, color: "#10b981" },
    {
      name: "남은 학점",
      value: academicStatus.totalCreditsRequired - academicStatus.completedCredits,
      color: "#e5e7eb",
    },
  ];

  const displayTracks =
    userInfo.tracks && userInfo.tracks.length > 0
      ? userInfo.tracks.filter((t) => t !== "트랙 미지정").join(" / ")
      : "트랙 미정";

  const semesterString = `${userInfo.year}학년 ${userInfo.semester}학기`;

  return (
    <Card className="p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <IconUser />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{userInfo.name}</h2>
            <p className="font-semibold text-slate-500">
              {userInfo.department} / {semesterString}
            </p>
            <p className="text-sm text-slate-500 mt-1">{displayTracks}</p>
          </div>
        </div>
        {/* <Button
          onClick={onViewPublicProfile}
          variant="secondary"
          className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg"
        >
          <IconShare2 className="w-4 h-4" />
          <span>프로필 보기</span>
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center md:text-left">
            학점 현황
          </h3>
          <div className="relative h-48 flex items-center justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={creditData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    paddingAngle={5}
                    startAngle={90}
                    endAngle={450}
                  >
                    {creditData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.75rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-semibold text-slate-500">GPA</span>
              <span className="text-4xl font-bold text-indigo-600">
                {academicStatus.gpa?.toFixed(2) || "N/A"}
              </span>
              <span className="text-sm text-slate-500">/ {academicStatus.gpaMax}</span>
            </div>
          </div>
          <p className="text-center text-slate-600 -mt-2">
            총 {academicStatus.totalCreditsRequired}학점 중{" "}
            <span className="font-bold text-emerald-600">{academicStatus.completedCredits}</span>
            학점 이수
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">진로 목표</h3>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
              <IconSparkles />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{careerGoal.primaryTracks || "미설정"}</p>
              <p className="text-sm text-slate-500">희망 진로</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-3">
            AI가 선택한 진로에 맞춰 과목을 추천해줍니다.
          </p>
        </div>
      </div>
    </Card>
  );
};

interface NextSemesterPreviewProps {
  nextSemesterCourses: shortCourseInfo[];
  setActiveView: (view: string) => void;
}

const NextSemesterPreview: React.FC<NextSemesterPreviewProps> = ({
  nextSemesterCourses,
  setActiveView,
}) => {
  if (!nextSemesterCourses || nextSemesterCourses.length === 0) return null;

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-700 mb-2">다음 학기 추천</h3>
      <div className="space-y-2">
        {nextSemesterCourses.map((course, idx) => (
          <div
            key={course.courseId || idx}
            className="text-sm p-2 bg-purple-50 rounded-lg text-purple-800"
          >
            {course.courseName}
          </div>
        ))}
      </div>
      <Button
        onClick={() => setActiveView("roadmap")}
        variant="primary"
        className="text-sm font-semibold mt-3 w-full text-right"
      >
        로드맵 전체 보기 &rarr;
      </Button>
    </Card>
  );
};

interface TimetablePreviewProps {
  todaySchedule: Schedule[];
  setActiveView: (view: string) => void;
}

const TimetablePreview: React.FC<TimetablePreviewProps> = ({ todaySchedule, setActiveView }) => {
  const today = ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()];
  const todayClasses = todaySchedule.filter((slot) => slot.day === today);

  if (!todaySchedule || todaySchedule.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h3 className="font-semibold text-slate-700 mb-2">시간표</h3>
        <p className="text-sm text-slate-500">아직 시간표가 없어요.</p>
        <Button
          onClick={() => setActiveView("timetable")}
          variant="primary"
          className="text-sm font-semibold mt-2"
        >
          시간표 보러가기 &rarr;
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-700 mb-2">오늘의 강의 ({today})</h3>
      {todayClasses.length > 0 ? (
        <div className="space-y-2">
          {todayClasses.map((slot, idx) => (
            <div key={slot.courseName + idx} className="text-sm p-2 bg-blue-50 rounded-lg">
              <p className="font-bold text-blue-800">{slot.courseName}</p>
              <p className="text-xs text-blue-600">
                {slot.start} - {slot.end} @ {slot.classroom}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">오늘은 강의가 없어요! 🎉</p>
      )}
      <Button
        onClick={() => setActiveView("timetable")}
        variant="primary"
        className="text-sm font-semibold mt-3 w-full text-right"
      >
        시간표 전체 보기 &rarr;
      </Button>
    </Card>
  );
};

interface DashboardViewProps {
  dashboardInfo: DashboardInfo;
  setActiveView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ dashboardInfo, setActiveView }) => {
  const [showToast, setShowToast] = React.useState(false);

  // 예시: 프로필 복사 등에서 Toast 표시
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="p-6 h-full overflow-y-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-lg animate-pop">
          <IconDashboard />
        </div>
        <span>대시보드</span>
      </h2>
      <p className="text-slate-500 mt-1">
        {dashboardInfo.userInfo.name}님의 학업 현황을 요약했어요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <StudentInfo dashboardInfo={dashboardInfo} />
        </div>
        <div className="space-y-6">
          <NextSemesterPreview
            nextSemesterCourses={dashboardInfo.nextSemesterCourses}
            setActiveView={setActiveView}
          />
          <TimetablePreview
            todaySchedule={dashboardInfo.todaySchedule}
            setActiveView={setActiveView}
          />
        </div>
      </div>
      {showToast && (
        <div className="animate-fade-in">
          {/* Toast 컴포넌트 활용 예시 */}
          <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-blue-600 text-white">
            <span className="font-semibold">프로필 화면으로 이동했습니다.</span>
          </div>
        </div>
      )}
    </div>
  );
};
