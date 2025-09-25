"use client";

import React, { useState } from "react";
import type { Schedule } from "@/types";
import { Card, IconCalendar, IconBook, IconClock, IconMap, RefreshButton } from "../common";
import { Button } from "../Button";
import { Toast } from "../Toast";
import { fadeIn } from "../animations";

interface TimetableViewProps {
  timeTable: Schedule[];
  onRefresh?: () => Promise<void>;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ timeTable, onRefresh }) => {
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);
  const days = ["월", "화", "수", "목", "금"] as const;
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);

  // Schedule 타입에 맞게 getGridPosition 수정
  const getGridPosition = (slot: Schedule) => {
    const dayIndex = days.indexOf(slot.day) + 2;
    const [startHour, startMinute] = slot.start.split(":").map(Number);
    const [endHour, endMinute] = slot.end.split(":").map(Number);

    const startRow = (startHour - 9) * 2 + startMinute / 30 + 2;
    const endRow = (endHour - 9) * 2 + endMinute / 30 + 2;

    return {
      gridColumn: `${dayIndex} / ${dayIndex + 1}`,
      gridRow: `${startRow} / ${endRow}`,
    };
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
      setToast({ message: "시간표가 새로고침되었습니다.", type: "success" });
    }
  };

  // 시간표 색상 팔레트
  const courseColors = [
    {
      bg: "bg-blue-100",
      border: "border-blue-200",
      text: "text-blue-800",
      subText: "text-blue-600",
    },
    {
      bg: "bg-purple-100",
      border: "border-purple-200",
      text: "text-purple-800",
      subText: "text-purple-600",
    },
    {
      bg: "bg-green-100",
      border: "border-green-200",
      text: "text-green-800",
      subText: "text-green-600",
    },
    {
      bg: "bg-orange-100",
      border: "border-orange-200",
      text: "text-orange-800",
      subText: "text-orange-600",
    },
    {
      bg: "bg-pink-100",
      border: "border-pink-200",
      text: "text-pink-800",
      subText: "text-pink-600",
    },
    {
      bg: "bg-indigo-100",
      border: "border-indigo-200",
      text: "text-indigo-800",
      subText: "text-indigo-600",
    },
    {
      bg: "bg-teal-100",
      border: "border-teal-200",
      text: "text-teal-800",
      subText: "text-teal-600",
    },
  ];

  // courseName 기반 색상 매핑
  const getColorForCourse = (courseName: string) => {
    const hash = courseName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return courseColors[Math.abs(hash) % courseColors.length];
  };

  return (
    <div className={`p-6 h-full flex flex-col relative ${fadeIn}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-20 -left-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-teal-200/30 to-green-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="flex justify-between items-start mb-6 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 text-green-600 rounded-xl shadow-lg animate-bounce-slow">
                <IconCalendar />
              </div>
              <span>나의 시간표</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              {timeTable && timeTable.length
                ? `이번 학기 수강중인 ${timeTable.length}개 과목들의 시간표입니다.`
                : "아직 이번 학기 시간표가 없습니다."}
            </p>
          </div>

          {onRefresh && (
            <div className="animate-fade-in animation-delay-200">
              <RefreshButton onRefresh={handleRefresh} text="시간표 새로고침" />
            </div>
          )}
        </div>

        <Card className="mt-4 flex-grow p-6 backdrop-blur-sm bg-white/80 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 animate-fade-up">
          {timeTable && timeTable.length ? (
            <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] grid-rows-[auto_repeat(22,1fr)] h-full gap-x-2 min-h-[600px]">
              {/* Header */}
              <div className="grid col-start-2 col-span-5 grid-cols-5 gap-x-2 pb-4 border-b border-slate-200/80 mb-2">
                {days.map((day, index) => (
                  <div
                    key={day}
                    className={`text-center font-bold text-slate-600 py-3 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 shadow-sm animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time labels */}
              {timeSlots.map((time, i) => (
                <div
                  key={time}
                  className="text-right text-sm text-slate-500 pr-3 flex items-center justify-end font-medium"
                  style={{ gridRow: i * 2 + 2 }}
                >
                  {time}
                </div>
              ))}

              {/* Enhanced grid lines */}
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={`line-${i}`}
                  className={`col-start-2 col-span-5 ${
                    i % 2 === 0
                      ? "border-t border-slate-300/60"
                      : "border-t border-dashed border-slate-200/80"
                  }`}
                  style={{ gridRow: i + 2 }}
                />
              ))}

              {/* Enhanced Timetable items */}
              {timeTable.map((slot, index) => {
                const colors = getColorForCourse(slot.courseName);
                return (
                  <div
                    key={`${slot.courseName}-${index}`}
                    style={{
                      ...getGridPosition(slot),
                      animationDelay: `${index * 100}ms`,
                    }}
                    className={`p-3 ${colors.bg} ${colors.border} border-2 rounded-xl m-px flex flex-col justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm bg-opacity-90 hover:scale-105 hover:z-10 animate-fade-in`}
                    title={`${slot.courseName} - ${slot.classroom} (${slot.start}~${slot.end})`}
                  >
                    <p className={`font-bold ${colors.text} text-sm leading-tight mb-1`}>
                      {slot.courseName}
                    </p>
                    <p className={`text-xs ${colors.subText} mb-1 flex items-center gap-1`}>
                      <span>📍</span>
                      {slot.classroom}
                    </p>
                    <p className={`text-xs ${colors.subText} opacity-75 flex items-center gap-1`}>
                      <span>⏰</span>
                      {slot.start}~{slot.end}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                  <div className="w-12 h-12 text-slate-400">
                    <IconCalendar />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-3">시간표가 없습니다</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  아직 이번 학기 시간표를 설정하지 않았어요.
                </p>
                <Button
                  onClick={() =>
                    setToast({ message: "시간표 만들기 기능은 준비 중입니다.", type: "info" })
                  }
                  variant="primary"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  시간표 만들기
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Enhanced 시간표 통계 */}
        {timeTable && timeTable.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 text-center backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg">
                <IconBook className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-700 text-lg mb-2">수강 과목</h4>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                {timeTable.length}
              </p>
            </Card>

            <Card className="p-6 text-center backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-200">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-lg">
                <IconClock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-slate-700 text-lg mb-2">주간 수업시간</h4>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {Math.round(
                  (timeTable.reduce((total, slot) => {
                    const [startHour, startMinute] = slot.start.split(":").map(Number);
                    const [endHour, endMinute] = slot.end.split(":").map(Number);
                    const duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);
                    return total + duration;
                  }, 0) /
                    60) *
                    10,
                ) / 10}
                <span className="text-base font-medium ml-1">시간</span>
              </p>
            </Card>

            <Card className="p-6 text-center backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in animation-delay-400">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-violet-200 rounded-full flex items-center justify-center shadow-lg">
                <IconMap className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-slate-700 text-lg mb-2">수업 요일</h4>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
                {new Set(timeTable.map((slot) => slot.day)).size}
                <span className="text-base font-medium ml-1">일</span>
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
