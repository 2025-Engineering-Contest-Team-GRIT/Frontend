import React from "react";
import { IconCompass, IconLogOut } from "@/components/common";
import { AuthInfo } from "@/types";

interface SSRHeaderProps {
  authInfo: AuthInfo | null;
  onLogout?: () => void;
  title?: string;
}

export const SSRHeader = ({ authInfo, onLogout, title = "한성 길라잡이" }: SSRHeaderProps) => (
  <header className="p-6 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-gray-100/20 sticky top-0 z-30 shrink-0">
    <div className="max-w-8xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center shadow-lg shadow-purple-200/40 animate-pulse-slow">
          <IconCompass className="text-white drop-shadow-sm" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">학업 계획을 스마트하게 관리하세요</p>
        </div>
      </div>
      {authInfo && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200/50 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">온라인</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="group p-3 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 text-slate-500 hover:text-red-500 overflow-hidden relative"
              title="로그아웃"
            >
              <IconLogOut className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}
        </div>
      )}
    </div>
  </header>
);

export const SSRLoadingSpinner = ({ message = "로딩 중..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-64 p-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 border-t-transparent shadow-lg"></div>
      <div className="absolute inset-2 animate-ping rounded-full bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30"></div>
    </div>
    <p className="text-slate-600 mt-6 font-medium animate-pulse">{message}</p>
    <div className="flex gap-2 mt-4">
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  </div>
);

export const SSRErrorBoundary = ({
  error,
  reset,
  title = "오류가 발생했습니다",
}: {
  error?: Error;
  reset?: () => void;
  title?: string;
}) => (
  <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
    <div className="text-red-500 text-5xl mb-4">⚠️</div>
    <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-600 mb-4">
      {error?.message || "페이지를 불러오는 중 문제가 발생했습니다."}
    </p>
    {reset && (
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        다시 시도
      </button>
    )}
  </div>
);
