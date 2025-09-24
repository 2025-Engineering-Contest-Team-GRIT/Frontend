"use client";

import React, { useState } from "react";
import { Card, IconCompass, IconUser, IconLock, IconLink } from "../common";

type LoginScreenProps = {
  onLogin: (studentId: string, password: string) => Promise<void>;
  onViewPublicProfileDemo: () => void;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onViewPublicProfileDemo }) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await onLogin(studentId, password);
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex w-full flex-col justify-center items-center p-4 overflow-hidden relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white animate-fade-in font-sans">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-300 opacity-30 rounded-full blur-3xl animate-blob2" />
      </div>
      <div className="text-center mb-8 z-10 animate-fade-down">
        <div className="flex justify-center items-center mx-auto mb-6 text-blue-600 animate-bounce-slow">
          <IconCompass className="w-20 h-20 drop-shadow-xl" />
        </div>
        <h1
          className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 mb-2 animate-gradient-x"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "0.02em" }}
        >
          한성 길라잡이
        </h1>
        <p
          className="text-slate-500 mt-3 text-lg animate-fade-in"
          style={{ fontFamily: "Pretendard, sans-serif", letterSpacing: "0.02em" }}
        >
          성공적인 대학 생활을 위한 첫 걸음
        </p>
      </div>
      <Card className="w-full max-w-sm z-10 p-8 shadow-2xl rounded-3xl border-0 bg-white/90 backdrop-blur-md animate-fade-up">
        {/* <h2 className="text-2xl font-bold text-center text-slate-700 mb-8 tracking-tight animate-fade-in">
          로그인
        </h2> */}
        <form onSubmit={handleLoginSubmit} className="space-y-3">
          <div className="group">
            <label htmlFor="studentId" className="block text-sm font-medium text-slate-600 mb-1">
              학번
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 transition-colors group-focus-within:text-blue-600">
                <IconUser className="w-5 h-5" />
              </span>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="학번을 입력하세요"
                className="w-full pl-10 pr-3 py-2 border border-slate-200 bg-slate-50 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-lg hover:bg-blue-50/50"
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-slate-600 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 transition-colors group-focus-within:text-blue-600">
                <IconLock className="w-5 h-5" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-10 py-2 border border-slate-200 bg-slate-50 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white transition-all shadow-sm hover:shadow-lg hover:bg-blue-50/50"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-blue-500 transition-colors"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.07 0 2.09.17 3.03.48M19.07 4.93A9.969 9.969 0 0121 12c0 1.61-.38 3.13-1.07 4.44M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-center animate-shake">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-2xl hover:shadow-xl hover:scale-[1.03] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:shadow-none disabled:scale-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>로그인</span>
              )}
            </button>
          </div>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-200/80">
          <button
            onClick={onViewPublicProfileDemo}
            className="w-full text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 hover:scale-[1.03] transition-all flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-200"
          >
            <span>외부 프로필 예시 보기</span>
            <IconLink className="w-4 h-4 animate-fade-in" />
          </button>
        </div>
      </Card>
      {/* Animations & Pretendard Font */}
      <style jsx global>{`
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");
        html,
        body,
        .font-sans {
          font-family:
            "Pretendard",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            "Apple SD Gothic Neo",
            "Noto Sans KR",
            "Malgun Gothic",
            "sans-serif";
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-8px);
          }
          40%,
          80% {
            transform: translateX(8px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes blob1 {
          0%,
          100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.1) translateY(20px);
          }
        }
        @keyframes blob2 {
          0%,
          100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.15) translateY(-20px);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fade-up {
          animation: fade-up 1s 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-fade-down {
          animation: fade-down 1s 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
        .animate-blob1 {
          animation: blob1 12s ease-in-out infinite;
        }
        .animate-blob2 {
          animation: blob2 14s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
