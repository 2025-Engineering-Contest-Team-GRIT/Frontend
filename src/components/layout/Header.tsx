import React from 'react';
import type { Student } from '@/types';
import { IconCompass, IconLogOut } from '@/components/common';

export const Header = ({ student, onLogout }: { student: Student, onLogout: () => void }) => (
  <header className="p-4 bg-white/50 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-30 shrink-0">
    <div className="max-w-8xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">
          <IconCompass />
        </div>
        <h1 className="text-xl font-bold text-slate-800">한성 길라잡이</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-slate-700">{student.name}</p>
          <p className="text-sm text-slate-500">{student.studentId} | {student.major}</p>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <IconLogOut />
        </button>
      </div>
    </div>
  </header>
);
