"use client";

import { DashboardView } from "@/components/views/DashboardView";
import { useAuth } from "@/hooks/useStore";
import { CSRErrorBoundary } from "./ErrorBoundary";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDashboard } from "@/hooks/useData";

function DashboardContent() {
  const { authInfo, isLoaded, isAuthenticated, setAsLoaded } = useAuth();
  const router = useRouter();
  const { data: dashboardInfo, isLoading: loadingDashboards, refetch } = useDashboard(authInfo);

  useEffect(() => {
    if (isAuthenticated === false && isLoaded) {
      router.push("/login");
    } else if (isAuthenticated === false) {
      setAsLoaded();
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!loadingDashboards) refetch();
  }, []);

  const handleViewChange = (goTo: string) => {
    router.push(`/${goTo}`);
  };

  if (!authInfo && loadingDashboards) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-blue-500 mb-4"
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
        <span className="text-lg text-gray-700 font-medium">대시보드를 불러오는 중...</span>
      </div>
    );
  } else if (!loadingDashboards || dashboardInfo) {
    return <DashboardView dashboardInfo={dashboardInfo} setActiveView={handleViewChange} />;
  }
}

export function DashboardPageClient() {
  return (
    <CSRErrorBoundary>
      <DashboardContent />
    </CSRErrorBoundary>
  );
}
