'use client';

import React, { useState, useLayoutEffect, useRef, useCallback } from 'react';
import { CourseCard } from '../CourseCard';
import { RefreshButton } from '../common';
import type { Course as CourseType } from '@/types';
import { CourseStatus } from '@/types';

interface RoadmapViewProps {
  courses: CourseType[];
  currentSemester: number;
  onCourseClick: (course: CourseType) => void;
  onRefresh: () => Promise<void>;
}

// Predefined semester layout configuration
const SEMESTER_LAYOUT = {
  1: { x: 50, y: 100 },
  2: { x: 350, y: 100 },
  3: { x: 50, y: 250 },
  4: { x: 350, y: 250 },
  5: { x: 50, y: 400 },
  6: { x: 350, y: 400 },
  7: { x: 50, y: 550 },
  8: { x: 350, y: 550 },
};

// Course positioning within semester columns
const getCoursePosition = (semester: number, index: number, semesterCourses: CourseType[]) => {
  const baseLayout = SEMESTER_LAYOUT[semester as keyof typeof SEMESTER_LAYOUT];
  if (!baseLayout) return { x: 0, y: 0 };

  const courseHeight = 120;
  const courseSpacing = 10;
  const totalHeight = semesterCourses.length * (courseHeight + courseSpacing) - courseSpacing;
  const startY = baseLayout.y - totalHeight / 2;

  return {
    x: baseLayout.x,
    y: startY + index * (courseHeight + courseSpacing)
  };
};

// Generate SVG path for prerequisite connections
const generatePath = (from: { x: number, y: number }, to: { x: number, y: number }) => {
  const cardWidth = 280;
  const cardHeight = 100;
  
  const startX = from.x + cardWidth;
  const startY = from.y + cardHeight / 2;
  const endX = to.x;
  const endY = to.y + cardHeight / 2;
  
  const midX = (startX + endX) / 2;
  
  return `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${(startY + endY) / 2} Q ${midX} ${endY} ${endX} ${endY}`;
};

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  courses,
  currentSemester,
  onCourseClick,
  onRefresh
}) => {
  const [focusedCourse, setFocusedCourse] = useState<string | null>(null);
  const [coursePositions, setCoursePositions] = useState<Record<string, { x: number, y: number }>>({});
  const [toast, setToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Group courses by semester
  const coursesBySemester = courses.reduce((acc, course) => {
    const semester = course.semester || 1;
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(course);
    return acc;
  }, {} as Record<number, CourseType[]>);

  // Calculate course positions
  useLayoutEffect(() => {
    const positions: Record<string, { x: number, y: number }> = {};
    
    Object.entries(coursesBySemester).forEach(([semester, semesterCourses]) => {
      semesterCourses.forEach((course, index) => {
        const position = getCoursePosition(Number(semester), index, semesterCourses);
        positions[course.id] = position;
      });
    });

    setCoursePositions(positions);
  }, [courses, coursesBySemester]);

  // Handle course focus for highlighting connections
  const handleCourseFocus = useCallback((courseId: string | null) => {
    setFocusedCourse(courseId);
  }, []);

  // 코스 클릭 시 Toast 표시 예시
  const handleCourseClickWithToast = (course: CourseType) => {
    onCourseClick(course);
    setToast(`${course.name} 상세 정보를 확인하세요.`);
    setTimeout(() => setToast(null), 1800);
  };

  // Render prerequisite connections
  const renderConnections = () => {
    if (!focusedCourse) return null;

    const connections: React.ReactElement[] = [];
    const focusedCourseData = courses.find(c => c.id === focusedCourse);
    
    if (!focusedCourseData?.prerequisites) return null;

    focusedCourseData.prerequisites.forEach((prereqId, index) => {
      const prereqPosition = coursePositions[prereqId];
      const currentPosition = coursePositions[focusedCourse];
      
      if (prereqPosition && currentPosition) {
        const path = generatePath(prereqPosition, currentPosition);
        
        connections.push(
          <g key={`connection-${prereqId}-${focusedCourse}`}>
            <path
              d={path}
              stroke="url(#connectionGradient)"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              className="animate-pulse"
            />
            <circle
              cx={prereqPosition.x + 280}
              cy={prereqPosition.y + 50}
              r="4"
              fill="#3b82f6"
              className="animate-pulse"
            />
            <circle
              cx={currentPosition.x}
              cy={currentPosition.y + 50}
              r="4"
              fill="#10b981"
              className="animate-pulse"
            />
          </g>
        );
      }
    });

    return connections;
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 animate-fade-in">
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 animate-pop">졸업 로드맵</h1>
            <p className="text-slate-600 mt-1">
              현재 {currentSemester}학기 · 전체 이수 과목 {courses.filter(c => c.status === CourseStatus.COMPLETED).length}/{courses.length}과목
            </p>
          </div>
          <div className="animate-pop">
            <RefreshButton onRefresh={onRefresh} text="로드맵 새로고침" />
          </div>
        </div>
      </div>

      {/* Main roadmap container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 pt-24 overflow-auto animate-fade-in"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="relative min-w-[700px] min-h-[800px] p-8 animate-fade-in">
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ minWidth: '700px', minHeight: '800px' }}
          >
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            {renderConnections()}
          </svg>

          {/* Semester columns */}
          {Object.entries(coursesBySemester).map(([semester, semesterCourses]) => (
            <div key={semester} className="absolute animate-fade-in">
              {/* Semester header */}
              <div 
                className="absolute z-10 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200/80 p-3 mb-4 animate-pop"
                style={{
                  left: SEMESTER_LAYOUT[Number(semester) as keyof typeof SEMESTER_LAYOUT]?.x || 0,
                  top: (SEMESTER_LAYOUT[Number(semester) as keyof typeof SEMESTER_LAYOUT]?.y || 0) - 50
                }}
              >
                <h3 className="font-bold text-slate-800 text-center">
                  {semester}학기
                </h3>
                <p className="text-xs text-slate-600 text-center mt-1">
                  {semesterCourses.length}과목
                </p>
              </div>

              {/* Course cards */}
              {semesterCourses.map((course, index) => {
                const position = coursePositions[course.id];
                if (!position) return null;

                return (
                  <div
                    key={course.id}
                    className={`absolute transition-all duration-300 transform animate-pop ${
                      focusedCourse === course.id ? 'scale-105 z-20' : 'z-10'
                    } ${
                      focusedCourse && focusedCourse !== course.id && 
                      !course.prerequisites?.includes(focusedCourse) &&
                      !courses.find(c => c.id === focusedCourse)?.prerequisites?.includes(course.id)
                        ? 'opacity-30' 
                        : 'opacity-100'
                    }`}
                    style={{
                      left: position.x,
                      top: position.y,
                      width: '280px'
                    }}
                    onMouseEnter={() => handleCourseFocus(course.id)}
                    onMouseLeave={() => handleCourseFocus(null)}
                  >
                    <CourseCard
                      course={course}
                      onClick={() => handleCourseClickWithToast(course)}
                      onAiClick={(e) => {
                        e.stopPropagation();
                        // AI recommendation logic here
                      }}
                      isSelected={focusedCourse === course.id}
                      isDimmed={focusedCourse !== null && focusedCourse !== course.id && 
                        !course.prerequisites?.includes(focusedCourse) &&
                        !courses.find(c => c.id === focusedCourse)?.prerequisites?.includes(course.id)}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200/80 p-4 z-20 animate-fade-in">
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
                과목 위에 마우스를 올려서<br />
                선수과목 연결을 확인하세요
              </p>
            </div>
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
  );
};
