'use client';

import React, { useState } from 'react';
import { Card, IconCompass, IconUser, IconLock, IconLink } from '../common';
import type { Student } from '@/types';
import { StudentStatus } from '@/types';
import { mockStudents } from '../../data/mockData';

type LoginScreenProps = {
  onLogin: (student: Student) => void;
  onViewPublicProfileDemo: () => void;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onViewPublicProfileDemo }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (studentId === '2200001' && password === '*Qwer1234') {
        onLogin(mockStudents[StudentStatus.SOPHOMORE]);
      } else if (studentId === '2500001' && password === '*Qwer1234') {
        onLogin(mockStudents[StudentStatus.FRESHMAN]);
      } else {
        setError('학번 또는 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative">
      <div className="text-center mb-8 z-10">
        <div className="flex justify-center items-center mx-auto mb-6 text-blue-600">
          <IconCompass className="w-20 h-20" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 mb-2">
          한성 길라잡이
        </h1>
        <p className="text-slate-500 mt-3 text-lg">성공적인 대학 생활을 위한 첫 걸음</p>
      </div>
      <Card className="w-full max-w-sm z-10 p-8">
        <h2 className="text-xl font-bold text-center text-slate-700 mb-6">로그인</h2>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-slate-600 mb-1">
              학번
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <IconUser className="w-5 h-5" />
              </span>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="학번을 입력하세요"
                className="w-full pl-10 pr-3 py-2 border bg-slate-100 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <IconLock className="w-5 h-5" />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-3 py-2 border bg-slate-100 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center animate-shake">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center space-x-2 disabled:opacity-70 disabled:shadow-none disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>로그인</span>
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 pt-6 border-t border-slate-200/80">
          <button
            onClick={onViewPublicProfileDemo}
            className="w-full text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>외부 프로필 예시 보기</span>
            <IconLink className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
