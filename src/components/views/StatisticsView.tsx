'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import type { Student, Track, CourseCategory as CourseCategoryType, AllCourses } from '@/types';
import { CourseStatus, CompetencyCategory, CourseCategory } from '@/types';
import { Card, IconBarChart2, IconTrophy, IconBook, IconTarget, RefreshButton } from '../common';

const gradeToPoint: Record<string, number> = {
  'A+': 4.5, 'A': 4.0, 'A0': 4.0,
  'B+': 3.5, 'B': 3.0, 'B0': 3.0,
  'C+': 2.5, 'C': 2.0, 'C0': 2.0,
  'D+': 1.5, 'D': 1.0, 'D0': 1.0,
  'F': 0.0,
};

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => (
  <Button
    onClick={onClick}
    variant={isActive ? 'primary' : 'outline'}
    className={`text-sm px-4 py-2 rounded-lg shadow-none ${isActive ? '' : 'text-slate-600'}`}
  >
    {label}
  </Button>
);

interface StatisticsViewProps {
  student: Student;
  allCourses: AllCourses[];
  onRefresh?: () => Promise<void>;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ 
  student, 
  allCourses,
  onRefresh 
}) => {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeFilter, setActiveFilter] = useState<'all' | Track | 'liberal'>('all');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  
  const studentTracks = useMemo(() => 
    student.tracks.filter(t => t !== '트랙 미지정'), 
    [student.tracks]
  );

  const completedCourseIds = useMemo(() => {
    const ids = new Set<string>();
    student.roadmap.semesters
      .flatMap(s => s.courses)
      .filter(c => c.status === CourseStatus.COMPLETED)
      .forEach(c => ids.add(c.id));
    return ids;
  }, [student.roadmap]);

  const semesterGpaData = useMemo(() => {
    const semesterData: { [key: string]: { credits: number, points: number } } = {};

    student.roadmap.semesters.forEach(semester => {
      const key = `${semester.year}-${semester.semester}`;
      if (!semesterData[key]) {
        semesterData[key] = { credits: 0, points: 0 };
      }
      semester.courses
        .filter(c => c.status === CourseStatus.COMPLETED && c.grade && gradeToPoint[c.grade] !== undefined)
        .forEach(c => {
          semesterData[key].credits += c.credits;
          semesterData[key].points += c.credits * (gradeToPoint[c.grade!] ?? 0);
        });
    });

    return Object.entries(semesterData)
      .filter(([, data]) => data.credits > 0)
      .map(([semester, data]) => ({
        semester: semester.replace('-', '년 ').concat('학기'),
        GPA: parseFloat((data.points / data.credits).toFixed(2)),
      }))
      .sort((a, b) => a.semester.localeCompare(b.semester));
  }, [student.roadmap]);

  const analysisData = useMemo(() => {
    let sourceCourses;
    if (activeFilter === 'all') {
      sourceCourses = allCourses.filter(course => 
        course.category.toString().startsWith('교양') || 
        (course.track && student.tracks.includes(course.track))
      );
    } else if (activeFilter === 'liberal') {
      sourceCourses = allCourses.filter(c => c.category.toString().startsWith('교양'));
    } else {
      sourceCourses = allCourses.filter(c => c.track === activeFilter);
    }
    
    const uniqueCourses = new Map<string, AllCourses>();
    sourceCourses.forEach(c => {
      const uniqueKey = `${c.id}-${c.track || 'common'}`;
      if (!uniqueCourses.has(uniqueKey)) {
        uniqueCourses.set(uniqueKey, c);
      }
    });
    const uniqueSourceCourses = Array.from(uniqueCourses.values());

    // Radar Data (Competency)
    const competencyMap = Object.fromEntries(
      Object.values(CompetencyCategory).map(c => [c, { total: 0, completed: 0 }])
    ) as Record<CompetencyCategory, { total: number, completed: number }>;
    
    uniqueSourceCourses.filter(c => c.competency).forEach(course => {
      if (competencyMap[course.competency!]) {
        competencyMap[course.competency!].total++;
        if (completedCourseIds.has(course.id)) {
          competencyMap[course.competency!].completed++;
        }
      }
    });

    const radarData = Object.entries(competencyMap).map(([name, data]) => ({
      subject: name,
      A: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      fullMark: 100,
    }));
    
    // Bar Data (Category)
    const categoryMap = Object.fromEntries(
      Object.values(CourseCategory).map(c => [c, { total: 0, completed: 0 }])
    ) as Record<CourseCategoryType, { total: number, completed: number }>;

    uniqueSourceCourses.forEach(course => {
      if (categoryMap[course.category]) {
        categoryMap[course.category].total++;
        if (completedCourseIds.has(course.id)) {
          categoryMap[course.category].completed++;
        }
      }
    });

    const categoryBarData = Object.entries(categoryMap)
      .filter(([, data]) => data.total > 0)
      .map(([name, data]) => ({
        name: name.length > 6 ? name.substring(0, 6) + '..' : name,
        fullName: name,
        '이수 과목': data.completed,
        '남은 과목': data.total - data.completed,
      }));

    return { radarData, categoryBarData };
  }, [allCourses, activeFilter, student.tracks, completedCourseIds]);

  const filterTitle = activeFilter === 'all' ? '전체' : 
                     activeFilter === 'liberal' ? '교양' : 
                     activeFilter.replace(' 트랙', '');

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
      setToast({ message: '데이터가 새로고침되었습니다.', type: 'success' });
    }
  };

  // ...existing code...
  return (
    <div className={`p-6 h-full overflow-y-auto ${fadeIn}`}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-lg">
              <IconBarChart2 />
            </div>
            <span>통계 및 분석</span>
          </h2>
          <p className="text-slate-500 mt-1">학업 성취도와 진도를 다양한 관점에서 분석해보세요.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-lg">
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
          
          {onRefresh && (
            <RefreshButton onRefresh={handleRefresh} text="데이터 새로고침" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4 text-lg">
            {filterTitle} 이수 현황 분석
          </h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-96">
            {activeFilter !== 'liberal' ? (
              <div>
                <h4 className="font-semibold text-slate-600 text-center mb-2">역량별 이수율 (%)</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar 
                        name={student.name} 
                        dataKey="A" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.75rem',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 bg-slate-50 rounded-lg">
                <p className="text-slate-500">교양 과목은 역량 분석에 포함되지 않습니다.</p>
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-slate-600 text-center mb-2">분류별 이수 현황 (과목 수)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={analysisData.categoryBarData}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={70}
                      tick={{ fontSize: 12, fill: '#475569' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                      }}
                      labelFormatter={(label, payload) => {
                        const data = payload?.[0]?.payload;
                        return data?.fullName || label;
                      }}
                    />
                    <Legend wrapperStyle={{fontSize: "14px", paddingTop: '10px' }} />
                    <Bar dataKey="이수 과목" stackId="a" fill="#3b82f6" radius={[4, 0, 0, 4]} />
                    <Bar dataKey="남은 과목" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4 text-lg">학기별 GPA 추이</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semesterGpaData} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="semester" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 4.5]} />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="GPA" 
                  stroke="#8884d8" 
                  strokeWidth={3} 
                  activeDot={{ r: 6, fill: '#8884d8' }}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {semesterGpaData.length === 0 && (
            <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
                  <IconBarChart2 />
                </div>
                <p className="text-slate-500">아직 완료된 학기가 없습니다.</p>
                <p className="text-sm text-slate-400 mt-1">과목 이수를 완료하면 GPA 추이를 확인할 수 있어요.</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 상세 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
            <IconTrophy />
          </div>
          <h4 className="font-bold text-slate-800 text-lg">현재 GPA</h4>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {student.gpa?.toFixed(2) || 'N/A'}
          </p>
          <p className="text-sm text-slate-500 mt-1">/ 4.5</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <IconBook />
          </div>
          <h4 className="font-bold text-slate-800 text-lg">이수 학점</h4>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {student.completedCredits}
          </p>
          <p className="text-sm text-slate-500 mt-1">/ {student.totalCredits} 학점</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
            <IconTarget />
          </div>
          <h4 className="font-bold text-slate-800 text-lg">진행률</h4>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {Math.round((student.completedCredits / student.totalCredits) * 100)}%
          </p>
          <p className="text-sm text-slate-500 mt-1">졸업까지</p>
        </Card>
      </div>
    </div>
  );
};
