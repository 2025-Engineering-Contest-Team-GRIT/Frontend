import React from "react";
import { IconCompass, IconLogOut } from "@/components/common";
import { AuthInfo } from "@/types";

interface SSRHeaderProps {
  authInfo: AuthInfo | null;
  onLogout?: () => void;
  title?: string;
}

export const SSRHeader = ({ authInfo, onLogout, title = "한성 길라잡이" }: SSRHeaderProps) => (
  <header className="p-4 bg-white/50 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-30 shrink-0">
    <div className="max-w-8xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">
          <IconCompass />
        </div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
      {authInfo && (
        <div className="flex items-center gap-4">
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <IconLogOut />
            </button>
          )}
        </div>
      )}
    </div>
  </header>
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
