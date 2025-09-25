"use client";

import React from "react";
import type { Course } from "@/types";

import { IconCheck, IconClock, IconPlus, IconBook } from "@/components/common";

// status: "COMPLETED" | "ENROLLED" | "RECOMMENDED" | "MANDATORY" (string)
export const courseStatusStyles: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    icon: React.ReactElement;
    name: string;
  }
> = {
  COMPLETED: {
    bg: "bg-emerald-500",
    text: "text-emerald-50",
    border: "border-emerald-600",
    icon: <IconCheck />,
    name: "이수 완료",
  },
  ENROLLED: {
    bg: "bg-blue-500",
    text: "text-blue-50",
    border: "border-blue-600",
    icon: <IconClock />,
    name: "수강 중",
  },
  RECOMMENDED: {
    bg: "bg-purple-500",
    text: "text-purple-50",
    border: "border-purple-600",
    icon: <IconPlus />,
    name: "AI 추천",
  },
  MANDATORY: {
    bg: "bg-amber-500",
    text: "text-amber-50",
    border: "border-amber-600",
    icon: <IconBook />,
    name: "전공 필수",
  },
};

export const CourseCard = React.forwardRef<
  HTMLDivElement,
  {
    course: Course;
    onClick: () => void;
    onAiClick: (e: React.MouseEvent) => void;
    isSelected: boolean;
    isDimmed: boolean;
  }
>(({ course, onClick, onAiClick, isSelected, isDimmed }, ref) => {
  const style = courseStatusStyles[course.status] || courseStatusStyles["ENROLLED"];

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative w-[260px] rounded-xl border-2 transition-all duration-300 cursor-pointer 
        ${isDimmed ? "opacity-20 hover:opacity-100" : "opacity-100"}
        ${
          isSelected
            ? `scale-102 shadow-2xl z-20 bg-white border-blue-500`
            : `hover:shadow-md hover:-translate-y-1 ${style.border} ${style.bg}`
        }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <p className={`text-xs font-semibold ${isSelected ? "text-blue-700" : style.text}`}>
              {course.courseType}
            </p>
            <h4 className={`font-bold mt-1 ${isSelected ? "text-blue-800" : style.text}`}>
              {course.courseName}
            </h4>
            <p className={`text-sm mt-0.5 ${isSelected ? "text-blue-700" : style.text}`}>
              {course.credits}학점
            </p>
          </div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${isSelected ? "bg-blue-500" : style.bg}`}
          >
            <div className="w-4 h-4">{style.icon}</div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isSelected ? "max-h-64" : "max-h-0"}`}
        >
          <div className="pt-3 mt-3 border-t-2 border-slate-200/60 space-y-3">
            {course.course_description && (
              <div className="overflow-scroll-gradient">
                <div className="overflow-scroll-gradient__scroller text-sm text-slate-600">
                  {course.course_description
                    .replaceAll(". ", ".\n")
                    .split("\n")
                    .map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                </div>
                <style jsx>{`
                  .overflow-scroll-gradient {
                    position: relative;
                  }
                  .overflow-scroll-gradient::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    background: linear-gradient(white, rgba(255, 255, 255, 0.001));
                    pointer-events: none;
                    z-index: 2;
                  }
                  .overflow-scroll-gradient::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    background: linear-gradient(rgba(255, 255, 255, 0.001), white);
                    pointer-events: none;
                    z-index: 2;
                  }
                  .overflow-scroll-gradient__scroller {
                    overflow-y: auto;
                    background: white;
                    width: 100%;
                    max-height: 120px;
                    padding: 5px 0;
                    line-height: 1.5;
                    text-align: left;
                    position: relative;
                    z-index: 1;
                  }
                `}</style>
              </div>
            )}
            {/* COMPLETED: 교수명, 트랙 정보 표시 */}
            {course.status === "COMPLETED" && course.completed_grade && (
              <div className="text-sm text-slate-700 bg-emerald-50 p-2 rounded-md">
                <span className="font-semibold text-emerald-800">받은 학점:</span>
                <span className="font-bold text-lg ml-2 text-emerald-700">
                  {course.completed_grade.replaceAll("_PLUS", "+").replaceAll("_MINUS", "-")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CourseCard.displayName = "CourseCard";
