'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card, IconStar, IconMapPin, IconPieChart, IconSearch } from '../common';
import { ProgressBar } from '../ProgressBar';
import { Button } from '../Button';
import type { Student, CourseCategory, AllCourses, Track } from '@/types';
import { CourseStatus, CourseCategory as CourseCategoryValue } from '@/types';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'primary' : 'secondary'}
    className={`px-4 py-2 text-sm rounded-lg shadow-none ${isActive ? '' : 'text-slate-600'}`}
  >
    {label}
  </Button>
);

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'primary' : 'secondary'}
    className={`px-3 py-1.5 text-sm rounded-md w-full sm:w-auto shadow-none ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
  >
    {label}
  </Button>
);

interface CoursePopoverProps {
  popover: {
    key: string;
    top: number;
    left: number;
    course: AllCourses;
  } | null;
  student: Student;
  onToggleFavorite: (courseId: string) => void;
  onToggleRoadmap: (course: AllCourses) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const CoursePopover: React.FC<CoursePopoverProps> = ({
  popover,
  student,
  onToggleFavorite,
  onToggleRoadmap,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!popover) return null;
  const { course } = popover;
  
  const isFavorite = student.favoriteCourseIds?.includes(course.id);
  const isInRoadmap = student.roadmap.semesters.flatMap(s => s.courses).some(c => c.id === course.id);
  const isEnrolledOrCompleted = student.roadmap.semesters.flatMap(s => s.courses).some(c => 
    c.id === course.id && (c.status === CourseStatus.ENROLLED || c.status === CourseStatus.COMPLETED)
  );

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute z-30 w-64 p-3 bg-white rounded-xl shadow-2xl border border-slate-200/80 animate-fade-in"
      style={{ 
        top: popover.top, 
        left: popover.left,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="flex flex-col text-slate-800">
        <div>
          <h5 className="font-bold">{course.name}</h5>
          <div className="flex flex-wrap items-center gap-2 text-xs mt-1 font-medium text-slate-600">
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">{course.credits}학점</span>
            {course.year && course.semester && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                {course.year}학년 {course.semester}학기
              </span>
            )}
            {course.track && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                {course.track.replace(' 트랙', '')}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-200/80">
          <Button 
            onClick={() => onToggleFavorite(course.id)} 
            variant={isFavorite ? 'danger' : 'secondary'}
            className={`w-full text-sm py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 ${isFavorite ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            <IconStar className="w-4 h-4 text-yellow-400" />
            <span>{isFavorite ? '관심 과목 해제' : '관심 과목 추가'}</span>
          </Button>
          <Button 
            onClick={() => onToggleRoadmap(course)} 
            disabled={isEnrolledOrCompleted}
            variant={isInRoadmap ? 'danger' : 'primary'}
            className={`w-full text-sm py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 ${isInRoadmap ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'} disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed`}
          >
            <IconMapPin className="w-4 h-4 text-rose-400" />
            <span>{isInRoadmap ? '로드맵에서 제거' : '로드맵에 추가'}</span>
          </Button>
        </div>
      </div>
      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-md" />
    </div>
  );
};

interface CompletionStatusViewProps {
  student: Student;
  onToggleFavorite: (courseId: string) => void;
  onToggleRoadmap: (course: AllCourses) => void;
  allCourses: AllCourses[];
}

export const CompletionStatusView: React.FC<CompletionStatusViewProps> = ({ 
  student, 
  onToggleFavorite, 
  onToggleRoadmap,
  allCourses 
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | Track | 'liberal'>('all');
  const [activeTab, setActiveTab] = useState<'favorites' | '1' | '2' | '3' | '4' | 'all'>('favorites');
  const [searchTerm, setSearchTerm] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    key: string;
    top: number;
    left: number;
    course: AllCourses;
  } | null>(null);
  const popoverTimerRef = useRef<number | null>(null);

  const handleMouseLeave = () => {
    if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
    popoverTimerRef.current = window.setTimeout(() => {
      setPopover(null);
    }, 100);
  };

  const handlePopoverMouseEnter = () => {
    if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, course: AllCourses, cardKey: string) => {
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

  // Student tracks filtering
  const studentTracks = useMemo(() => {
    return student.tracks.filter(track => track !== '트랙 미지정');
  }, [student.tracks]);

  // Completed courses mapping
  const completedCoursesById = useMemo(() => {
    const map = new Map();
    student.roadmap.semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.status === CourseStatus.COMPLETED) {
          map.set(course.id, course);
        }
      });
    });
    return map;
  }, [student.roadmap.semesters]);

  const completedCoursesByTrack = useMemo(() => {
    const map = new Map();
    student.roadmap.semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.status === CourseStatus.COMPLETED) {
          const key = `${course.id}-${course.track || 'common'}`;
          map.set(key, course);
        }
      });
    });
    return map;
  }, [student.roadmap.semesters]);

  // Filter courses based on active filter
  const displayCourses = useMemo(() => {
    let filtered = allCourses;

    // Filter by track/liberal
    if (activeFilter === 'liberal') {
      filtered = filtered.filter(course => course.category.toString().startsWith('교양'));
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(course => course.track === activeFilter);
    }

    // Filter by year/favorites
    if (activeTab === 'favorites') {
      filtered = filtered.filter(course => student.favoriteCourseIds?.includes(course.id));
    } else if (activeTab !== 'all') {
      const year = parseInt(activeTab);
      filtered = filtered.filter(course => course.year === year);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(term) ||
        course.id.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [allCourses, activeFilter, activeTab, searchTerm, student.favoriteCourseIds]);

  // Progress calculation
  const progressData = useMemo(() => {
    const isAllFilter = activeFilter === 'all';
    let coursesToCheck = allCourses;

    if (activeFilter === 'liberal') {
      coursesToCheck = allCourses.filter(course => course.category.toString().startsWith('교양'));
    } else if (activeFilter !== 'all') {
      coursesToCheck = allCourses.filter(course => course.track === activeFilter);
    }

    const completedCourses = isAllFilter ? completedCoursesById : completedCoursesByTrack;
    
    const result: Record<string, { completed: number; total: number; percentage: number }> = {
      total: { completed: 0, total: coursesToCheck.length, percentage: 0 }
    };

    // Initialize category counters
    Object.values(CourseCategoryValue).forEach(category => {
      result[category] = { completed: 0, total: 0, percentage: 0 };
    });

    coursesToCheck.forEach(course => {
      const key = isAllFilter ? course.id : `${course.id}-${course.track || 'common'}`;
      const isCompleted = completedCourses.has(key);
      
      if (isCompleted) {
        result.total.completed++;
        result[course.category].completed++;
      }
      result[course.category].total++;
    });

    // Calculate percentages
    result.total.percentage = result.total.total > 0 ? Math.round((result.total.completed / result.total.total) * 100) : 0;
    Object.values(CourseCategoryValue).forEach(category => {
      const data = result[category];
      data.percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    });

    return result;
  }, [allCourses, activeFilter, completedCoursesById, completedCoursesByTrack]);

  // Group courses by category
  const coursesByCategory = useMemo(() => {
    return displayCourses.reduce((acc, course) => {
      if (!acc[course.category]) {
        acc[course.category] = [];
      }
      acc[course.category].push(course);
      return acc;
    }, {} as Record<CourseCategory, AllCourses[]>);
  }, [displayCourses]);

  const filterTitle = activeFilter === 'all' ? '전체' : activeFilter === 'liberal' ? '교양' : activeFilter.replace(' 트랙', '');

  const tabs = [
    { id: 'favorites', label: '관심과목' },
    { id: '1', label: '1학년' },
    { id: '2', label: '2학년' },
    { id: '3', label: '3학년' },
    { id: '4', label: '4학년' },
    { id: 'all', label: '전체' },
  ] as const;

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  // 관심과목/로드맵 토글 시 Toast 표시 예시
  const handleToggleFavoriteWithToast = (courseId: string) => {
    onToggleFavorite(courseId);
    setToast({ message: '관심 과목이 변경되었습니다.', type: 'success' });
    setTimeout(() => setToast(null), 1800);
  };
  const handleToggleRoadmapWithToast = (course: AllCourses) => {
    onToggleRoadmap(course);
    setToast({ message: '로드맵이 변경되었습니다.', type: 'info' });
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div ref={containerRef} className="p-6 h-full overflow-y-auto relative animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-teal-100 text-teal-600 rounded-lg animate-pop">
              <IconPieChart />
            </div>
            <span>이수 현황</span>
          </h2>
          <p className="text-slate-500 mt-1">전체 전공 및 교양 과목 대비 이수 현황을 확인해보세요.</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg animate-fade-in">
          <FilterButton label="전체" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
          {studentTracks.map(track => (
            <FilterButton 
              key={track} 
              label={track.replace(' 트랙', '')} 
              isActive={activeFilter === track} 
              onClick={() => setActiveFilter(track)} 
            />
          ))}
          <FilterButton label="교양" isActive={activeFilter === 'liberal'} onClick={() => setActiveFilter('liberal')} />
        </div>
      </div>
      
      <div className="mt-6 space-y-6">
        <Card className="p-6 animate-fade-in">
          <h3 className="font-bold text-slate-700 mb-2">
            {filterTitle} 진행률 ({progressData.total.completed} / {progressData.total.total})
          </h3>
          <ProgressBar value={progressData.total.completed} max={progressData.total.total} className="mb-6" showLabel />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {Object.values(CourseCategoryValue).map(category => {
              if (!progressData[category] || progressData[category].total === 0) return null;
              return (
                <div 
                  key={category} 
                  className="p-4 bg-slate-50 rounded-xl cursor-pointer transition-all hover:bg-white hover:shadow-lg hover:-translate-y-1 border border-slate-200/80 animate-pop"
                >
                  <p className="font-semibold text-slate-500">{category}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {progressData[category].completed} / {progressData[category].total}
                    <span className="text-base font-medium ml-1">과목</span>
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg animate-pop">
              {tabs.map(tab => (
                <TabButton 
                  key={tab.id}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="과목명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    {courses.map(course => {
                      const isAllFilter = activeFilter === 'all';
                      const completedInfo = isAllFilter
                        ? completedCoursesById.get(course.id)
                        : completedCoursesByTrack.get(`${course.id}-${course.track || 'common'}`);
                      
                      const isCompleted = !!completedInfo;
                      const isLiberal = course.category.toString().startsWith('교양');
                      const showTrackForNotCompleted = !isLiberal && (
                        course.category === CourseCategoryValue.FOUNDATION || 
                        course.category === CourseCategoryValue.MANDATORY
                      );
                      
                      const bgColor = isCompleted ? (isLiberal ? 'bg-emerald-100' : 'bg-indigo-100') : 'bg-slate-100';
                      const textColor = isCompleted ? (isLiberal ? 'text-emerald-900' : 'text-indigo-900') : 'text-slate-600';
                      const cardKey = isAllFilter ? course.id : `${course.id}-${course.track || 'common'}`;

                      const isFavorite = student.favoriteCourseIds?.includes(course.id);
                      const isInRoadmap = student.roadmap.semesters.flatMap(s => s.courses).some(c => c.id === course.id);

                      return (
                        <div 
                          key={cardKey} 
                          onMouseEnter={(e) => handleMouseEnter(e, course, cardKey)}
                          onMouseLeave={handleMouseLeave}
                          className="relative rounded-lg transition-all duration-200 shadow-sm animate-pop"
                        >
                          <div className={`p-3 rounded-lg h-full flex flex-col justify-between ${bgColor} ${textColor}`}>
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <p className="font-bold flex-1 pr-6">{course.name}</p>
                                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                                  {isFavorite && (
                                    <span title="관심 과목" className="text-amber-400">
                                      <IconStar className="w-[14px] h-[14px] fill-current" />
                                    </span>
                                  )}
                                  {isInRoadmap && (
                                    <span title="로드맵에 포함됨" className="text-green-500">
                                      <IconMapPin className="w-[14px] h-[14px] fill-current" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] font-medium">
                              {course.year && course.semester && (
                                <span className={`px-2 py-0.5 rounded-full ${isCompleted ? 'bg-white/70' : 'bg-slate-200/70'}`}>
                                  {course.year}학년 {course.semester}학기
                                </span>
                              )}
                              {(() => {
                                if (isLiberal) return null;
                                if (isCompleted && completedInfo.track) {
                                  return (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                                      {completedInfo.track.replace(' 트랙', '')}
                                    </span>
                                  );
                                }
                                if (!isCompleted && showTrackForNotCompleted && course.track) {
                                  return (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                      {course.track.replace(' 트랙', '')}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
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
            <div className="text-center py-16 text-slate-500 animate-fade-in">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-4 text-slate-400">
                <IconSearch className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-600">과목을 찾을 수 없습니다.</h4>
              <p className="text-sm mt-1">필터 조건을 변경하거나 검색어를 확인해주세요.</p>
            </div>
          )}
        </Card>
      </div>
      
      <CoursePopover 
        popover={popover}
        student={student}
        onToggleFavorite={handleToggleFavoriteWithToast}
        onToggleRoadmap={handleToggleRoadmapWithToast}
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {toast && (
        <div className="animate-fade-in">
          <div className={`fixed bottom-8 right-8 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
