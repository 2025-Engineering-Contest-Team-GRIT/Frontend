"use client";

import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import { CourseCard } from "../CourseCard";
import { RefreshButton } from "../common";
import type { Semester } from "@/types";
import { Course } from "@/types";

interface RoadmapViewProps {
  roadmap: Semester[];
  currentSemester: number;
  currentGrade: number;
  onCourseClick: (course: Course) => void;
  onRefresh: () => Promise<void>;
}

// CourseCard의 실제 렌더링 스타일을 반영한 값 (padding, border, shadow 등 고려)
const COURSE_CARD_WIDTH = 260;
const COURSE_CARD_HEIGHT = 104; // 실제 렌더링 높이(패딩, border, margin 등 포함)
const COURSE_CARD_SPACING = 24; // 세로 간격 gap-6 = 1.5rem = 24px
const COURSE_CARD_COL_SPACING = 24; // 가로 간격 gap-6 = 1.5rem = 24px
const SEMESTER_HEADER_HEIGHT = 70;

// CourseCard 내부 padding, border, 아이콘 위치를 고려한 연결선 위치 계산
const CARD_OUTER_PADDING = 16; // .p-4
const CARD_BORDER_WIDTH = 2; // border-2
const ICON_SIZE = 32; // w-8 h-8
const ICON_OFFSET_X = CARD_OUTER_PADDING + ICON_SIZE / 2; // 왼쪽에서 아이콘 중심까지 거리

// from, to: 카드의 좌상단 기준 위치
const generatePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  // 출발점: from 카드의 오른쪽 아이콘 중심
  const startX = from.x + COURSE_CARD_WIDTH - ICON_OFFSET_X;
  const startY = from.y + COURSE_CARD_HEIGHT;
  // 도착점: to 카드의 왼쪽 아이콘 중심
  const endX = to.x + ICON_OFFSET_X;
  const endY = to.y + COURSE_CARD_HEIGHT;

  // 베지어 곡선을 위한 제어점 계산
  const controlOffset = Math.abs(endX - startX) * 0.4; // 거리의 40%만큼 제어점 오프셋
  const control1X = startX + controlOffset;
  const control1Y = startY;
  const control2X = endX - controlOffset;
  const control2Y = endY;

  // 베지어 곡선 경로 생성
  return `M ${startX} ${startY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${endX} ${endY}`;
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  currentSemester,
  currentGrade,
  onCourseClick,
  onRefresh,
}) => {
  const [focusedCourse, setFocusedCourse] = useState<number | null>(null);
  const [coursePositions, setCoursePositions] = useState<Record<number, { x: number; y: number }>>(
    {},
  );
  const [toast, setToast] = useState<string | null>(null);
  const [highlightedCourses, setHighlightedCourses] = useState<{
    prerequisites: Set<number>;
    successors: Set<number>;
  }>({ prerequisites: new Set(), successors: new Set() });
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 모든 코스를 courseId로 매핑하기 위한 Map 생성
  const courseMap = React.useMemo(() => {
    const map = new Map<number, Course>();
    roadmap.forEach((semester) => {
      semester.courses.forEach((course) => {
        map.set(course.courseId, course);
      });
    });
    return map;
  }, [roadmap]);

  // 특정 과목의 모든 선수과목들을 재귀적으로 찾는 함수
  const getAllPrerequisites = useCallback(
    (courseId: number, visited = new Set<number>()): Set<number> => {
      if (visited.has(courseId)) return new Set();
      visited.add(courseId);

      const course = courseMap.get(courseId);
      if (!course || !course.prerequisiteIds) return new Set();

      const prerequisites = new Set<number>();
      course.prerequisiteIds.forEach((prereqId) => {
        if (courseMap.has(prereqId)) {
          prerequisites.add(prereqId);
          // 재귀적으로 선수과목의 선수과목들도 추가
          const nestedPrereqs = getAllPrerequisites(prereqId, visited);
          nestedPrereqs.forEach((id) => prerequisites.add(id));
        }
      });

      return prerequisites;
    },
    [courseMap],
  );

  // 특정 과목의 모든 후수과목들을 재귀적으로 찾는 함수
  const getAllSuccessors = useCallback(
    (courseId: number, visited = new Set<number>()): Set<number> => {
      if (visited.has(courseId)) return new Set();
      visited.add(courseId);

      const successors = new Set<number>();

      // 모든 과목을 순회하면서 현재 과목을 선수과목으로 가지는 과목들을 찾음
      courseMap.forEach((course, id) => {
        if (course.prerequisiteIds?.includes(courseId)) {
          successors.add(id);
          // 재귀적으로 후수과목의 후수과목들도 추가
          const nestedSuccessors = getAllSuccessors(id, visited);
          nestedSuccessors.forEach((succId) => successors.add(succId));
        }
      });

      return successors;
    },
    [courseMap],
  );

  // Group courses by year+semester (예: '1-1', '1-2', ...)
  // courses: Semester[]
  // coursesByYearSemester: { '1-1': Course[], ... }
  const coursesByYearSemester = React.useMemo(() => {
    const acc: Record<string, Course[]> = {};
    roadmap.forEach((semester) => {
      const key = `${semester.year}-${semester.semester}`;
      acc[key] = semester.courses;
    });
    return acc;
  }, [roadmap]);

  // Flex 기반 위치 계산: 각 (year, semester) column의 x, 각 과목의 y를 계산
  useLayoutEffect(() => {
    const positions: Record<number, { x: number; y: number }> = {};
    // year, semester 오름차순 정렬
    const keys = Object.keys(coursesByYearSemester)
      .map((k) => {
        const [y, s] = k.split("-").map(Number);
        return { key: k, year: y, semester: s };
      })
      .sort((a, b) => a.year - b.year || a.semester - b.semester);
    keys.forEach((item, idx) => {
      const semesterCourses = coursesByYearSemester[item.key];
      semesterCourses.forEach((course, courseIdx) => {
        positions[course.courseId] = {
          x: idx * (COURSE_CARD_WIDTH + COURSE_CARD_COL_SPACING), // column 간격 24px(gap-6)
          y: SEMESTER_HEADER_HEIGHT + courseIdx * (COURSE_CARD_HEIGHT + COURSE_CARD_SPACING),
        };
      });
    });
    setCoursePositions(positions);
  }, [coursesByYearSemester]);

  // Handle course focus for highlighting connections
  const handleCourseFocus = useCallback(
    (courseId: number | null) => {
      setFocusedCourse(courseId);

      if (courseId === null) {
        setHighlightedCourses({ prerequisites: new Set(), successors: new Set() });
        return;
      }

      // 선수과목들과 후수과목들을 찾아서 강조 표시용 상태 업데이트
      const prerequisites = getAllPrerequisites(courseId);
      const successors = getAllSuccessors(courseId);

      setHighlightedCourses({ prerequisites, successors });
    },
    [getAllPrerequisites, getAllSuccessors],
  );

  // 코스 클릭 시 Toast 표시 예시
  const handleCourseClickWithToast = (course: Course) => {
    // onCourseClick(course);
    // setToast(`${course.courseName} 상세 정보를 확인하세요.`);
    // setTimeout(() => setToast(null), 1800);
  };

  // Render prerequisite connections (로드맵에 존재하는 과목만 연결)
  const renderConnections = () => {
    if (!focusedCourse) return null;

    const connections: React.ReactElement[] = [];
    const focusedPosition = coursePositions[focusedCourse];

    if (!focusedPosition) return null;

    // 선수과목들과의 연결선 그리기
    highlightedCourses.prerequisites.forEach((prereqId) => {
      const prereqPosition = coursePositions[prereqId];
      if (prereqPosition) {
        const path = generatePath(prereqPosition, focusedPosition);
        connections.push(
          <path
            key={`prereq-${prereqId}-${focusedCourse}`}
            d={path}
            stroke="#ef4444"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
            markerEnd="url(#arrowhead-red)"
          />,
        );
      }
    });

    // 후수과목들과의 연결선 그리기
    highlightedCourses.successors.forEach((succId) => {
      const succPosition = coursePositions[succId];
      if (succPosition) {
        const path = generatePath(focusedPosition, succPosition);
        connections.push(
          <path
            key={`succ-${focusedCourse}-${succId}`}
            d={path}
            stroke="#22c55e"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
            markerEnd="url(#arrowhead-green)"
          />,
        );
      }
    });

    return connections;
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-60 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 animate-fade-in">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 animate-pop">졸업 로드맵</h1>
            <p className="text-slate-600 mt-1">
              현재 {currentGrade}학년 {currentSemester}학기 · 전체 이수 과목{" "}
              {(() => {
                let total = 0;
                let completed = 0;
                roadmap.forEach((semester) => {
                  semester.courses.forEach((course) => {
                    total++;
                    if (course.status === "COMPLETED") completed++;
                  });
                });
                return `${completed}/${total}`;
              })()}
              과목
            </p>
          </div>
          <div className="animate-pop">
            <RefreshButton onRefresh={onRefresh} text="로드맵 새로고침" />
          </div>
        </div>
      </div>

      {/* Main roadmap container (flex row) */}
      <div
        ref={containerRef}
        className="absolute inset-0 pt-24 overflow-auto animate-fade-in"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="relative min-w-[900px] h-full p-8 animate-fade-in">
          {/* SVG for connections (absolute, full area) */}
          <svg
            ref={svgRef}
            className="absolute left-0 top-0 w-full h-full pointer-events-none z-10"
            style={{ minWidth: "900px", minHeight: "800px" }}
          >
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0.8 }} />
              </linearGradient>
              {/* 화살표 마커 정의 - 선수과목용 (빨간색) */}
              <marker
                id="arrowhead-red"
                markerWidth="7"
                markerHeight="5"
                refX="6"
                refY="2.5"
                orient="auto"
              >
                <polygon points="0 0, 7 2.5, 0 5" fill="#ef4444" />
              </marker>
              {/* 화살표 마커 정의 - 후수과목용 (녹색) */}
              <marker
                id="arrowhead-green"
                markerWidth="7"
                markerHeight="5"
                refX="6"
                refY="2.5"
                orient="auto"
              >
                <polygon points="0 0, 7 2.5, 0 5" fill="#22c55e" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Flex row: 학년/학기별 column */}
          <div className="flex flex-row gap-6 relative z-20">
            {Object.entries(coursesByYearSemester)
              .map(([key, semesterCourses]) => {
                const [year, semester] = key.split("-").map(Number);
                return { key, year, semester, semesterCourses };
              })
              .sort((a, b) => a.year - b.year || a.semester - b.semester)
              .map((item, idx) => (
                <div key={item.key} className="flex flex-col items-center w-[260px]">
                  {/* Semester header */}
                  <div className="z-10 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200/80 p-3 mb-4 animate-pop w-full">
                    <h3 className="font-bold text-slate-800 text-center">
                      {item.year}학년 {item.semester}학기
                    </h3>
                    <p className="text-xs text-slate-600 text-center mt-1">
                      {item.semesterCourses.length}과목
                    </p>
                  </div>
                  {/* Course cards (세로로 쌓기) */}
                  <div className="flex flex-col gap-6 w-full">
                    {item.semesterCourses.map((course, index) => {
                      const position = coursePositions[course.courseId];
                      if (!position) return null;
                      return (
                        <div
                          key={`${item.key}-${course.courseId}`}
                          className={`relative transition-all duration-300 transform animate-pop ${
                            focusedCourse === course.courseId ? "scale-105 z-20" : "z-10"
                          } opacity-100`}
                          style={{
                            width: "260px",
                            height: `${COURSE_CARD_HEIGHT}px`,
                          }}
                          onMouseEnter={() => handleCourseFocus(course.courseId)}
                          onMouseLeave={() => handleCourseFocus(null)}
                        >
                          <CourseCard
                            course={course}
                            onClick={() => handleCourseClickWithToast(course)}
                            onAiClick={(e) => {
                              e.stopPropagation();
                              // AI recommendation logic here
                            }}
                            isSelected={focusedCourse === course.courseId}
                            isDimmed={
                              focusedCourse !== null &&
                              focusedCourse !== course.courseId &&
                              !highlightedCourses.prerequisites.has(course.courseId) &&
                              !highlightedCourses.successors.has(course.courseId)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
          {/* Legend */}
          <div className="fixed bottom-8 transition-all opacity-45 hover:opacity-100 right-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200/80 p-4 z-20 animate-fade-in">
            <h4 className="font-semibold text-slate-800 mb-3">범례</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-600">이수 완료</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">수강 중</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-slate-600">AI 추천</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-600">전공 필수</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                과목 위에 마우스를 올려서
                <br />
                선수과목(빨간선)과 후수과목(녹색선) 연결을 확인하세요
              </p>
            </div>
          </div>
        </div>
        {toast && (
          <div className="animate-fade-in">
            <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-blue-600 text-white">
              <span className="font-semibold">{toast}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
