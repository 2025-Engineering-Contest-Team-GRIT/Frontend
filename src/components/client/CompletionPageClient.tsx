"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CompletionStatusView } from "@/components/views/CompletionStatusView";
import { useAuth, useCompletionState } from "@/hooks/useStore";
import { useCourses } from "@/hooks/useData";

export function CompletionPageClient() {
  const { authInfo, isAuthenticated } = useAuth();
  const { data: completionInfoQuery, isLoading: loadingCourses, refetch } = useCourses(authInfo);
  const { completionInfo, setCompletionInfo, setAsFavorite, unsetAsFavorite } =
    useCompletionState();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    if (completionInfoQuery && !loadingCourses) {
      setCompletionInfo(completionInfoQuery);
    }
  }, [completionInfoQuery, loadingCourses]);

  React.useEffect(() => {
    if (!loadingCourses) refetch();
  }, []);

  if (!authInfo || loadingCourses || !completionInfo) {
    // || loadingCourses || !allCourses) {
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
        <span className="text-lg text-gray-700 font-medium">이수 과목을 불러오는 중...</span>
      </div>
    );
  } else {
    return (
      <CompletionStatusView
        completionInfo={completionInfo}
        onSetAsFavorite={setAsFavorite}
        onUnsetAsFavorite={unsetAsFavorite}
      />
    );
  }
}
