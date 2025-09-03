'use client';


import React, { useState } from 'react';
import type { Student, TimetableSlot } from '@/types';
import { Card, IconCalendar, IconBook, IconClock, IconMap, RefreshButton } from '../common';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { fadeIn } from '../animations';

interface TimetableViewProps {
  student: Student;
  onRefresh?: () => Promise<void>;
}


export const TimetableView: React.FC<TimetableViewProps> = ({ student, onRefresh }) => {
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const days = ['월', '화', '수', '목', '금'] as const;
  const timeSlots = Array.from({ length: 11 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);

  const getGridPosition = (slot: TimetableSlot) => {
    const dayIndex = days.indexOf(slot.day) + 2;
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const startRow = (startHour - 9) * 2 + (startMinute / 30) + 2;
    const endRow = (endHour - 9) * 2 + (endMinute / 30) + 2;

    return {
      gridColumn: `${dayIndex} / ${dayIndex + 1}`,
      gridRow: `${startRow} / ${endRow}`,
    };
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
      setToast({ message: '시간표가 새로고침되었습니다.', type: 'success' });
    }
  };

  // 시간표 색상 팔레트
  const courseColors = [
    { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-800', subText: 'text-blue-600' },
    { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-800', subText: 'text-purple-600' },
    { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800', subText: 'text-green-600' },
    { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-800', subText: 'text-orange-600' },
    { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-800', subText: 'text-pink-600' },
    { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-800', subText: 'text-indigo-600' },
    { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-800', subText: 'text-teal-600' },
  ];

  const getColorForCourse = (courseId: string) => {
    const hash = courseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return courseColors[Math.abs(hash) % courseColors.length];
  };

  // ...existing code...
  return (
    <div className={`p-6 h-full flex flex-col ${fadeIn}`}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-lg">
              <IconCalendar />
            </div>
            <span>나의 시간표</span>
          </h2>
          <p className="text-slate-500 mt-1">
            {student.isTimetableConfigured && student.timetable?.length ? 
              `이번 학기 수강중인 ${student.timetable.length}개 과목들의 시간표입니다.` : 
              "아직 이번 학기 시간표가 없습니다."
            }
          </p>
        </div>
        
        {onRefresh && (
          <RefreshButton onRefresh={handleRefresh} text="시간표 새로고침" />
        )}
      </div>

      <Card className="mt-4 flex-grow p-4">
        {student.isTimetableConfigured && student.timetable?.length ? (
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] grid-rows-[auto_repeat(22,1fr)] h-full gap-x-2 min-h-[600px]">
            {/* Header */}
            <div className="grid col-start-2 col-span-5 grid-cols-5 gap-x-2 pb-2 border-b border-slate-200">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Time labels */}
            {timeSlots.map((time, i) => (
              <div 
                key={time} 
                className="text-right text-xs text-slate-400 pr-2 flex items-center justify-end" 
                style={{ gridRow: i * 2 + 2 }}
              >
                {time}
              </div>
            ))}

            {/* Dotted lines for half-hour intervals */}
            {Array.from({length: 22}).map((_, i) => (
              <div 
                key={`line-${i}`} 
                className={`col-start-2 col-span-5 ${i % 2 === 0 ? 'border-t border-slate-300' : 'border-t border-dashed border-slate-200'}`}
                style={{gridRow: i + 2}}
              />
            ))}

            {/* Timetable items */}
            {student.timetable.map((slot, index) => {
              const colors = getColorForCourse(slot.courseId);
              return (
                <div 
                  key={`${slot.courseId}-${index}`}
                  style={getGridPosition(slot)} 
                  className={`p-2 ${colors.bg} ${colors.border} border rounded-lg m-px flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                  title={`${slot.courseName} - ${slot.location} (${slot.startTime}~${slot.endTime})`}
                >
                  <p className={`font-bold ${colors.text} text-sm leading-tight`}>
                    {slot.courseName}
                  </p>
                  <p className={`text-xs ${colors.subText} mt-1`}>
                    {slot.location}
                  </p>
                  <p className={`text-xs ${colors.subText} opacity-75`}>
                    {slot.startTime}~{slot.endTime}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 text-slate-400">
                  <IconCalendar />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">시간표가 없습니다</h3>
              <p className="text-slate-500 mb-4">
                아직 이번 학기 시간표를 설정하지 않았어요.
              </p>
              <Button 
                onClick={() => setToast({ message: '시간표 만들기 기능은 준비 중입니다.', type: 'info' })}
                variant="primary"
                className="px-4 py-2"
              >
                시간표 만들기
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 시간표 통계 */}
      {student.isTimetableConfigured && student.timetable?.length && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
              <IconBook />
            </div>
            <h4 className="font-semibold text-slate-700">수강 과목</h4>
            <p className="text-2xl font-bold text-blue-600">{student.timetable.length}</p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
              <IconClock />
            </div>
            <h4 className="font-semibold text-slate-700">주간 수업시간</h4>
            <p className="text-2xl font-bold text-green-600">
              {student.timetable.reduce((total, slot) => {
                const [startHour, startMinute] = slot.startTime.split(':').map(Number);
                const [endHour, endMinute] = slot.endTime.split(':').map(Number);
                const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
                return total + duration;
              }, 0) / 60}시간
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
              <IconMap />
            </div>
            <h4 className="font-semibold text-slate-700">수업 요일</h4>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(student.timetable.map(slot => slot.day)).size}일
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
