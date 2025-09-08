import React from "react";
import type { Student } from "@/types";
import { IconCompass, IconLogOut } from "@/components/common";

interface SSRHeaderProps {
  student?: Student;
  onLogout?: () => void;
  title?: string;
}

export const SSRHeader = ({ student, onLogout, title = "한성 길라잡이" }: SSRHeaderProps) => (
  <header className="p-4 bg-white/50 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-30 shrink-0">
    <div className="max-w-8xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">
          <IconCompass />
        </div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
      {student && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-slate-700">{student.name}</p>
            <p className="text-sm text-slate-500">
              {student.studentId} | {student.major}
            </p>
          </div>
          {onLogout ? (
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <IconLogOut />
            </button>
          ) : (
            <div className="p-2 rounded-full text-slate-300">
              <IconLogOut />
            </div>
          )}
        </div>
      )}
    </div>
  </header>
);

interface SSRLayoutProps {
  children: React.ReactNode;
  student?: Student;
  showNavigation?: boolean;
}

export const SSRLayout = ({ children, student, showNavigation = true }: SSRLayoutProps) => (
  <div className="flex flex-col h-screen bg-slate-50">
    <SSRHeader student={student} />
    <div className="flex flex-1 overflow-hidden">
      {showNavigation && (
        <aside className="w-56 bg-white/60 backdrop-blur-sm border-r border-slate-200/80 p-4 shrink-0">
          {/* Static navigation placeholder - CSR components will enhance this */}
          <nav className="space-y-2">
            <div className="text-sm font-medium text-slate-500 mb-4">메뉴</div>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg bg-blue-50 border border-blue-100">
                대시보드
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                로드맵
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                이수현황
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                시간표
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                통계
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                졸업요건
              </div>
              <div className="px-3 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100">
                설정
              </div>
            </div>
          </nav>
        </aside>
      )}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export const SSRLoadingSpinner = ({ message = "로딩 중..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-64 p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
    <p className="text-slate-600">{message}</p>
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
