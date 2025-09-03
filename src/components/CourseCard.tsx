'use client';

import React from 'react';
import type { Course, CourseStatus } from '@/types';
import { CourseStatus as CourseStatusValue } from '@/types';

import { IconCheck, IconClock, IconPlus, IconBook, IconSparkles } from '@/components/common';
import { Button } from './Button';

export const courseStatusStyles: { [key in CourseStatus]: { bg: string; text: string; border: string; icon: React.ReactElement, name: string } } = {
  [CourseStatusValue.COMPLETED]: { bg: 'bg-emerald-500', text: 'text-emerald-50', border: 'border-emerald-600', icon: <IconCheck />, name: '이수 완료' },
  [CourseStatusValue.ENROLLED]: { bg: 'bg-blue-500', text: 'text-blue-50', border: 'border-blue-600', icon: <IconClock />, name: '수강 중' },
  [CourseStatusValue.RECOMMENDED]: { bg: 'bg-purple-500', text: 'text-purple-50', border: 'border-purple-600', icon: <IconPlus />, name: 'AI 추천' },
  [CourseStatusValue.MANDATORY]: { bg: 'bg-amber-500', text: 'text-amber-50', border: 'border-amber-600', icon: <IconBook />, name: '전공 필수' },
};


export const CourseCard = React.forwardRef<HTMLDivElement, { 
  course: Course; 
  onClick: () => void; 
  onAiClick: (e: React.MouseEvent) => void; 
  isSelected: boolean; 
  isDimmed: boolean; 
}>(({ course, onClick, onAiClick, isSelected, isDimmed }, ref) => {
  const style = courseStatusStyles[course.status];

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative w-64 rounded-xl border-2 transition-all duration-300 cursor-pointer 
        ${isDimmed ? 'opacity-20 hover:opacity-100' : 'opacity-100'}
        ${isSelected
          ? `scale-105 shadow-2xl z-20 bg-white border-blue-500`
          : `hover:shadow-md hover:-translate-y-1 ${style.border} ${style.bg}`
        }`
      }
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
              <p className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : style.text}`}>{course.category}</p>
              <h4 className={`font-bold mt-1 ${isSelected ? 'text-blue-800' : style.text}`}>{course.name}</h4>
              <p className={`text-sm mt-0.5 ${isSelected ? 'text-blue-700' : style.text}`}>{course.credits}학점</p>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${isSelected ? 'bg-blue-500' : style.bg}`}>
            <div className="w-4 h-4">{style.icon}</div>
          </div>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSelected ? 'max-h-48' : 'max-h-0'}`}>
            <div className="pt-3 mt-3 border-t-2 border-slate-200/60 space-y-3">
                {course.description && (
                    <p className="text-sm text-slate-600">
                        {course.description}
                    </p>
                )}
                 {course.status === CourseStatusValue.COMPLETED && course.grade && (
                    <div className="text-sm text-slate-700 bg-emerald-50 p-2 rounded-md">
                        <span className="font-semibold text-emerald-800">받은 학점:</span> 
                        <span className="font-bold text-lg ml-2 text-emerald-700">{course.grade}</span>
                    </div>
                )}
        {course.status === CourseStatusValue.RECOMMENDED && (
          <Button
            onClick={() => onAiClick && onAiClick({} as React.MouseEvent)}
            variant="secondary"
            className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm"
          >
            <IconSparkles />
            <span>AI 추천 이유 보기</span>
          </Button>
        )}
            </div>
        </div>
      </div>
    </div>
  );
});

CourseCard.displayName = 'CourseCard';
