"use client";

import React from "react";
import { Button } from "../Button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardInfo, Schedule, shortCourseInfo } from "@/types";
import { Card, IconUser, IconSparkles } from "../common";

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
    <Card className="p-8 h-full bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl ">
                <IconUser className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-bounce-slow" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                {userInfo.name}
              </h2>
              <p className="font-semibold text-slate-600 mt-1 text-lg">{userInfo.department}</p>
              <p className="text-slate-500 mt-1">
                {semesterString} • {displayTracks}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg" />
              학점 현황
            </h3>
            <div className="relative h-56 flex items-center justify-center">
              <div className="w-56 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={creditData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      startAngle={90}
                      endAngle={450}
                    >
                      {creditData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                        border: "2px solid #e2e8f0",
                        borderRadius: "1rem",
                        boxShadow:
                          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-semibold text-slate-500 mb-1">GPA</span>
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {academicStatus.gpa?.toFixed(2) || "N/A"}
                </span>
                <span className="text-sm text-slate-500">/ {academicStatus.gpaMax}</span>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-slate-600 text-lg">
                총{" "}
                <span className="font-bold text-slate-800">
                  {academicStatus.totalCreditsRequired}
                </span>
                학점 중{" "}
                <span className="font-bold text-emerald-600 text-xl">
                  {academicStatus.completedCredits}
                </span>
                학점 이수
              </p>
              <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 animate-pulse"
                  style={{
                    width: `${(academicStatus.completedCredits / academicStatus.totalCreditsRequired) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-2xl flex flex-col justify-center border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg" />
              진로 목표
            </h3>
            <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white animate-float">
                <IconSparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-md">
                  {careerGoal.primaryTracks || "미설정"}
                </p>
                <p className="text-sm text-slate-500">희망 진로</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              <span className="font-semibold text-indigo-600">AI가</span> 선택한 진로에 맞춰 <br />
              <span className="font-semibold text-purple-600">맞춤형 과목</span>을 추천해줍니다.
            </p>
          </div>
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
    <Card className="p-6 bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 pointer-events-none" />

      <div className="relative z-10">
        <h3 className="font-bold text-slate-700 mb-4 text-lg flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg animate-pulse" />
          다음 학기 추천
        </h3>
        <div className="space-y-3">
          {nextSemesterCourses.map((course, idx) => (
            <div
              key={course.courseId || idx}
              className="group text-sm p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl text-purple-800 border border-purple-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:animate-pulse" />
                <span className="font-medium">{course.courseName}</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={() => setActiveView("roadmap")}
          variant="primary"
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3"
        >
          <span className="flex items-center justify-center gap-2">
            로드맵 전체 보기
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Button>
      </div>
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
      <Card className="p-6 text-center bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="font-bold text-slate-700 mb-4 text-lg flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg animate-pulse" />
            오늘의 시간표
          </h3>
          <div className="py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-slate-500">아직 시간표가 없어요.</p>
          </div>
          <Button
            onClick={() => setActiveView("timetable")}
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3"
          >
            <span className="flex items-center justify-center gap-2">
              시간표 보러가기
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 text-lg flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg animate-pulse" />
            오늘의 강의 ({today})
          </h3>
          <span
            className="flex items-center justify-center gap-2 text-center text-indigo-400 bg-clip-text font-semibold cursor-pointer"
            onClick={() => setActiveView("timetable")}
          >
            자세히 보기
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {todayClasses.length > 0 ? (
          <div className="space-y-3">
            {todayClasses.map((slot, idx) => (
              <div
                key={slot.courseName + idx}
                className="group text-sm p-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-2">
                  <div>
                    <p className="font-bold text-blue-800 mb-1">{slot.courseName}</p>
                    <p className="text-xs text-blue-600 flex items-center gap-2">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {slot.start} - {slot.end}
                      <svg
                        className="w-3 h-3 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {slot.classroom}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce-slow">
              🎉
            </div>
            <p className="text-slate-500">오늘은 강의가 없어요!</p>
          </div>
        )}
      </div>
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
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-blob1" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-300 opacity-20 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 p-6 h-full overflow-y-auto animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
            <div className="lg:col-span-2">
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <StudentInfo dashboardInfo={dashboardInfo} />
              </div>
            </div>
            <div className="space-y-6">
              <div
                className="transform hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                <NextSemesterPreview
                  nextSemesterCourses={dashboardInfo.nextSemesterCourses}
                  setActiveView={setActiveView}
                />
              </div>
              <div
                className="transform hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: "0.4s" }}
              >
                <TimetablePreview
                  todaySchedule={dashboardInfo.todaySchedule}
                  setActiveView={setActiveView}
                />
              </div>
            </div>
          </div>
        </div>

        {showToast && (
          <div className="animate-fade-in">
            {/* Toast 컴포넌트 활용 예시 */}
            <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white backdrop-blur-lg border border-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">프로필 화면으로 이동했습니다.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
