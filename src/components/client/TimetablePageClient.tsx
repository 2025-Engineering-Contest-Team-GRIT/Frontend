"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TimetableView } from "@/components/views/TimetableView";
import { useAuth } from "@/hooks/useStore";
import { useTimetable } from "@/hooks/useData";
import { useCourseSelection } from "@/hooks/useStore";
import { useEffect } from "react";

export function TimetablePageClient() {
  const router = useRouter();
  const { authInfo, isAuthenticated, setAsLoaded, isLoaded } = useAuth();
  const { data: timetable, isLoading: loadingTimetable, refetch } = useTimetable(authInfo);
  const { openCourseModal } = useCourseSelection();

  useEffect(() => {
    if (isAuthenticated === false && isLoaded) {
      router.push("/login");
    } else if (isAuthenticated === false) {
      setAsLoaded();
    } else {
      refetch();
    }
  }, [isAuthenticated, router]);

  if (!authInfo || loadingTimetable || !timetable) {
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
        <span className="text-lg text-gray-700 font-medium">시간표를 불러오는 중...</span>
      </div>
    );
  } else {
    return <TimetableView timeTable={timetable} />;
  }
}
