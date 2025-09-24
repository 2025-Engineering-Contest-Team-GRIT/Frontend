"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconDashboard,
  IconMap,
  IconTarget,
  IconCalendar,
  IconMortarBoard,
  IconRefreshCw,
} from "@/components/common";
import { OnboardingRestartModal } from "@/components/OnboardingRestartModal";
import { useAuth } from "@/hooks/useStore";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "대시보드", icon: <IconDashboard /> },
  { href: "/roadmap", label: "로드맵", icon: <IconMap /> },
  { href: "/completion", label: "이수현황", icon: <IconTarget /> },
  { href: "/timetable", label: "시간표", icon: <IconCalendar /> },
  { href: "/graduation", label: "졸업요건", icon: <IconMortarBoard /> },
  {
    href: "/simulation",
    label: "졸업시뮬레이션",
    icon: (
      <svg
        className="w-5 h-5"
        style={{ scale: "0.7" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export const CSRNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { authInfo } = useAuth();
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      setIsOnboardingModalOpen(false);
    } catch (err) {
      setError("온보딩 재시작 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Onboarding restart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOnboardingModalOpen(false);
    setError("");
  };

  return (
    <>
      <nav className="space-y-2 flex justify-between flex-col h-full">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-4">메뉴</div>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                  flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                  ${
                    isActive
                      ? "text-blue-700 bg-blue-50 border border-blue-100 font-medium"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
                >
                  <span className={isActive ? "text-blue-600" : "text-slate-500"}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 온보딩 재시작 버튼 */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-sm font-medium text-slate-500 mb-3">설정</div>
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <IconRefreshCw className="w-5 h-5 text-slate-500" />
            온보딩 재시작
          </button>
        </div>
      </nav>

      {/* 온보딩 재시작 모달 */}
      <OnboardingRestartModal
        isOpen={isOnboardingModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleOnboardingRestart}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
};

// Enhanced header with CSR features
export const CSRHeader = () => {
  const pathname = usePathname();

  // Get page title based on current route
  const getPageTitle = (path: string) => {
    const item = navigationItems.find((item) => item.href === path);
    return item ? `한성 길라잡이 - ${item.label}` : "한성 길라잡이";
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-800">{getPageTitle(pathname)}</h1>

      {/* Additional CSR features can be added here */}
      <div className="flex items-center gap-2">{/* Theme toggle, notifications, etc. */}</div>
    </div>
  );
};
