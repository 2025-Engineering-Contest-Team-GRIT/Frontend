"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { IconLock, IconX, IconRefreshCw } from "./common";
import { useRouter } from "next/router";

interface OnboardingRestartModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  onClose?: () => void;
  setError?: (error: string) => void;
  error?: string;
  "use client";
}

export const OnboardingRestartModal: React.FC<OnboardingRestartModalProps> = ({
  isOpen,
  isLoading = false,
  setIsLoading = () => {},
  onClose = () => {},
  setError = () => {},
  error = "",
}) => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleOnboardingRestart = async (password: string) => {
    setIsLoading(true);
    setError("");

    try {
      // 세션 스토리지에 임시 비밀번호 저장
      if (typeof window !== "undefined") {
        sessionStorage.setItem("onboarding_temp_pw", password);
      }

      // 온보딩 페이지로 이동
      router.push("/onboarding");
      onClose();
    } catch (err) {
      setError("온보딩 재시작 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Onboarding restart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      handleOnboardingRestart(password);
    }
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative z-[10000]">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
            <IconRefreshCw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">온보딩 재시작</h2>
          <p className="text-sm text-slate-500">
            온보딩을 다시 진행하기 위해 종합정보시스템 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              종합정보시스템 비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconLock className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 text-slate-500 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !password.trim()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>처리 중...</span>
                </>
              ) : (
                "온보딩 시작"
              )}
            </Button>
          </div>
        </form>

        {/* Security note */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500">
            <IconLock className="w-3 h-3 inline mr-1" />
            비밀번호는 안전하게 암호화되어 처리되며 저장되지 않습니다.
          </p>
        </div>
      </div>
      {/* Modal background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-[-1]" />
    </div>
  );
};
