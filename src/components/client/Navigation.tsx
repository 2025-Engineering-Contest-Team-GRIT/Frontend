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

export const CSRNavigation = (onBoardingOpen: any) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <nav className="space-y-3 flex justify-between flex-col h-full">
        <div>
          <div className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            메뉴
          </div>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                  group relative flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all duration-300 overflow-hidden
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-semibold shadow-lg shadow-purple-200/40 scale-102"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-gray-50 hover:via-white hover:to-gray-50 hover:shadow-md hover:shadow-gray-200/20 hover:scale-102"
                  }
                `}
                >
                  <span
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-white drop-shadow-sm animate-pulse-slow"
                        : "text-slate-500 group-hover:text-indigo-500 group-hover:rotate-6 group-hover:scale-110"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 rounded-full animate-pulse" />
                    )}
                  </span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 온보딩 재시작 버튼 */}
        <div className="mt-8 pt-6 border-t border-gradient-to-r from-gray-200/60 via-gray-300/80 to-gray-200/60">
          <div className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            설정
          </div>
          <button
            onClick={() => onBoardingOpen(true)}
            className="group relative w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-all duration-300 text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-gray-50 hover:via-white hover:to-gray-50 hover:shadow-md hover:shadow-gray-200/20 hover:scale-102 overflow-hidden"
          >
            <IconRefreshCw className="w-5 h-5 text-slate-500 transition-all duration-300 group-hover:text-indigo-500 group-hover:rotate-180 group-hover:scale-110" />
            온보딩 재시작
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </nav>
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
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200/40 animate-pulse-slow">
          <svg
            className="w-6 h-6 text-white drop-shadow-sm"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 3l1.09 3.26L16 8l-2.91 1.74L12 13l-1.09-3.26L8 8l2.91-1.74L12 3z" />
            <path d="M19 12l0.32 0.96L20 13.5l-0.68 0.54L19 15l-0.32-0.96L18 13.5l0.68-0.54L19 12z" />
            <path d="M5 21l0.32-0.96L6 19.5l-0.68-0.54L5 18l-0.32 0.96L4 19.5l0.68 0.54L5 21z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">학업 계획을 스마트하게 관리하세요</p>
        </div>
      </div>

      {/* Additional CSR features */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200/50 shadow-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-600">온라인</span>
        </div>
        <button className="p-2 rounded-xl bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group">
          <svg
            className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 17h5l-5 5v-5z" />
            <path d="M9 7H4l5-5v5z" />
            <path d="M9 1v6h6v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h5z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
