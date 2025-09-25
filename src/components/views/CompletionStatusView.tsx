"use client";

import React, { useState, useMemo, useRef } from "react";
import { Card, IconStar, IconMapPin, IconPieChart, IconSearch } from "../common";
import { ProgressBar } from "../ProgressBar";
import { Button } from "../Button";
import type { CourseListItem } from "@/types";
import { trackList } from "@/types";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? "primary" : "secondary"}
    className={`px-3 py-1.5 text-sm rounded-md w-full sm:w-auto shadow-none ${isActive ? "text-blue-600" : "text-slate-500"}`}
  >
    {label}
  </Button>
);

interface CoursePopoverProps {
  popover: {
    key: string;
    top: number;
    left: number;
    course: CourseListItem;
  } | null;
  onSetAsFavorite: (courseId: number) => void;
  onUnsetAsFavorite: (courseId: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CoursePopover: React.FC<CoursePopoverProps> = ({
  popover,
  onSetAsFavorite,
  onUnsetAsFavorite,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!popover) return null;
  const { course } = popover;
  const isFavorite = course.is_favorite;
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute z-30 w-64 p-3 bg-white rounded-xl shadow-2xl border border-slate-200/80 animate-fade-in"
      style={{
        top: popover.top,
        left: popover.left,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="flex flex-col text-slate-800">
        <div>
          <h5 className="font-bold">{course.course.course_name}</h5>
          <div className="flex flex-wrap items-center gap-2 text-xs mt-1 font-medium text-slate-600">
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {course.course.credits}학점
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {course.grade}학년{" "}
              {course.semester === "FIRST"
                ? "1학기"
                : course.semester === "SECOND"
                  ? "2학기"
                  : "여름학기"}
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">{course.course_type}</span>
            {course.track_id && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                <IconMapPin className="w-3 h-3" />
                {trackList[course.track_id - 1]}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-200/80">
          {isFavorite ? (
            <Button
              onClick={() => onUnsetAsFavorite(course.course.id)}
              variant="danger"
              className="w-full text-sm py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              <IconStar className="w-4 h-4 text-yellow-400" />
              <span>관심 과목 해제</span>
            </Button>
          ) : (
            <Button
              onClick={() => onSetAsFavorite(course.course.id)}
              variant="secondary"
              className="w-full text-sm py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200"
            >
              <IconStar className="w-4 h-4 text-yellow-400" />
              <span>관심 과목 추가</span>
            </Button>
          )}
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-md" />
    </div>
  );
};

interface CompletionStatusViewProps {
  completionInfo: CourseListItem[];
  onSetAsFavorite: (courseId: number) => void;
  onUnsetAsFavorite: (courseId: number) => void;
}

export const CompletionStatusView: React.FC<CompletionStatusViewProps> = ({
  completionInfo,
  onSetAsFavorite,
  onUnsetAsFavorite,
}) => {
  // 관심과목이 없으면 기본 activeTab을 1학년으로 설정
  const hasFavorites = completionInfo.some((item) => item.is_favorite);
  const [activeTab, setActiveTab] = useState<"favorites" | "1" | "2" | "3" | "4" | "all">(
    hasFavorites ? "favorites" : "1",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    key: string;
    top: number;
    left: number;
    course: CourseListItem;
  } | null>(null);
  const popoverTimerRef = useRef<number | null>(null);

  // 필터링/탭/검색 적용
  const filteredCourses = useMemo(() => {
    let filtered = completionInfo;
    if (activeTab === "favorites") {
      filtered = filtered.filter((item) => item.is_favorite);
    } else if (activeTab !== "all") {
      const year = parseInt(activeTab);
      filtered = filtered.filter((item) => item.grade === year);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.course.course_name.toLowerCase().includes(term) ||
          item.course.course_code.toLowerCase().includes(term),
      );
    }
    return filtered;
  }, [completionInfo, activeTab, searchTerm]);

  // 카테고리별 그룹핑
  const coursesByCategory = useMemo(() => {
    return filteredCourses.reduce(
      (acc, item) => {
        if (!acc[item.course_type]) acc[item.course_type] = [];
        acc[item.course_type].push(item);
        return acc;
      },
      {} as Record<string, CourseListItem[]>,
    );
  }, [filteredCourses]);

  // 진행률 계산
  const progressData = useMemo(() => {
    const total = completionInfo.length;
    const completed = completionInfo.filter((item) => item.status === "completed").length;
    const byCategory: Record<string, { completed: number; total: number }> = {};
    completionInfo.forEach((item) => {
      if (!byCategory[item.course_type]) byCategory[item.course_type] = { completed: 0, total: 0 };
      byCategory[item.course_type].total++;
      if (item.status === "completed") byCategory[item.course_type].completed++;
    });
    return { total, completed, byCategory };
  }, [completionInfo]);

  // 팝오버
  const handleMouseLeave = () => {
    if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
    popoverTimerRef.current = window.setTimeout(() => {
      setPopover(null);
    }, 100);
  };
  const handlePopoverMouseEnter = () => {
    if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
  };
  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    course: CourseListItem,
    cardKey: string,
  ) => {
    if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
    const targetElement = event.currentTarget;
    popoverTimerRef.current = window.setTimeout(() => {
      if (!containerRef.current || !targetElement) return;
      const cardRect = targetElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const top = cardRect.top - containerRect.top + containerRef.current.scrollTop - 16;
      const left = cardRect.left - containerRect.left + cardRect.width / 2;
      setPopover({ key: cardKey, top, left, course });
    }, 400);
  };

  // 토스트
  const handleToggleFavoriteWithToast = (courseId: number, isFavorite: boolean) => {
    if (isFavorite) {
      onUnsetAsFavorite(courseId);
      setToast({ message: "관심 과목이 해제되었습니다.", type: "success" });
    } else {
      onSetAsFavorite(courseId);
      setToast({ message: "관심 과목으로 추가되었습니다.", type: "success" });
    }
    setTimeout(() => setToast(null), 1800);
  };

  // 탭/필터/검색 UI
  const tabs = [
    { id: "favorites", label: "관심과목" },
    { id: "1", label: "1학년" },
    { id: "2", label: "2학년" },
    { id: "3", label: "3학년" },
    { id: "4", label: "4학년" },
    { id: "all", label: "전체" },
  ] as const;

  return (
    <div ref={containerRef} className="p-6 h-full overflow-y-auto relative animate-fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-cyan-300/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-20 -left-20 w-48 h-48 bg-gradient-to-br from-blue-200/30 to-indigo-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-violet-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-200 text-teal-600 rounded-xl shadow-lg animate-bounce-slow">
                <IconPieChart />
              </div>
              <span>이수 현황</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              전체 전공 및 교양 과목 대비 이수 현황을 확인해보세요.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <Card className="p-8 backdrop-blur-sm bg-white/90 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 animate-fade-up">
            <h3 className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent text-xl mb-4">
              전체 진행률 ({progressData.completed} / {progressData.total})
            </h3>
            <div className="mb-8">
              <ProgressBar
                value={progressData.completed}
                max={progressData.total}
                className="mb-2 h-4"
                showLabel
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {Object.entries(progressData.byCategory).map(([category, data], index) => (
                <div
                  key={category}
                  className="p-6 bg-gradient-to-br from-slate-50/80 to-gray-100/80 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 border border-slate-200/60 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="font-semibold text-slate-600 text-sm mb-2">{category}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent mb-1">
                    {data.completed} / {data.total}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">과목</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 backdrop-blur-sm bg-white/90 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 animate-fade-up animation-delay-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div className="flex flex-wrap gap-2 bg-gradient-to-r from-slate-100/80 to-gray-100/80 p-2 rounded-xl backdrop-blur-sm shadow-inner">
                {tabs.map((tab, index) => (
                  <div
                    key={tab.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TabButton
                      label={tab.label}
                      isActive={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  </div>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IconSearch className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="과목명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-slate-300/60 rounded-xl text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {Object.keys(coursesByCategory).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(coursesByCategory).map(([category, courses]) => (
                  <div key={category} className="animate-fade-in">
                    <h4 className="font-bold text-slate-700 mb-3 pb-2 border-b border-slate-200">
                      {category} ({courses.length}개 과목)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {courses.map((item) => {
                        const isCompleted = item.status === "completed";
                        const isFavorite = item.is_favorite;
                        const bgColor = isCompleted ? "bg-indigo-100" : "bg-slate-100";
                        const textColor = isCompleted ? "text-indigo-900" : "text-slate-600";
                        const cardKey = String(item.course.id);
                        return (
                          <div
                            key={cardKey}
                            onMouseEnter={(e) => handleMouseEnter(e, item, cardKey)}
                            onMouseLeave={handleMouseLeave}
                            className="relative rounded-lg transition-all duration-200 shadow-sm animate-pop"
                          >
                            <div
                              className={`p-3 rounded-lg h-full flex flex-col justify-between ${bgColor} ${textColor}`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-bold flex-1 pr-6">{item.course.course_name}</p>
                                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                    {isFavorite && (
                                      <span title="관심 과목" className="text-amber-400">
                                        <IconStar className="w-[14px] h-[14px] fill-current" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] font-medium">
                                <span className="px-2 py-0.5 rounded-full bg-white/70">
                                  {item.grade}학년{" "}
                                  {item.semester === "FIRST"
                                    ? "1학기"
                                    : item.semester === "SECOND"
                                      ? "2학기"
                                      : "여름학기"}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-white/70">
                                  {item.course.credits}학점
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-white/70">
                                  {item.course_type}
                                </span>
                                {item.track_id && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <IconMapPin className="w-3 h-3" />
                                    {trackList[item.track_id - 1]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 animate-fade-in">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-gray-200 mb-6 text-slate-400 shadow-lg animate-pulse-glow">
                  <IconSearch className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-600 mb-2">과목을 찾을 수 없습니다.</h4>
                <p className="text-base text-slate-500">
                  필터 조건을 변경하거나 검색어를 확인해주세요.
                </p>
              </div>
            )}
          </Card>
        </div>

        <CoursePopover
          popover={popover}
          onSetAsFavorite={(courseId) => handleToggleFavoriteWithToast(courseId, false)}
          onUnsetAsFavorite={(courseId) => handleToggleFavoriteWithToast(courseId, true)}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {toast && (
          <div className="animate-fade-in">
            <div
              className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-105 ${
                toast.type === "success"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  : toast.type === "error"
                    ? "bg-gradient-to-r from-rose-500 to-red-600 text-white"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              }`}
            >
              <span className="font-semibold">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
