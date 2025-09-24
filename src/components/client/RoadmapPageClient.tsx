"use client";

import { RoadmapView } from "@/components/views/RoadmapView";
import { StudentStatus } from "@/types";
import { useRoadmap } from "@/hooks/useData";
import { useAuth, useCourseSelection } from "@/hooks/useStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RoadmapPageClient() {
  const router = useRouter();
  const { authInfo, isAuthenticated, setAsLoaded, isLoaded } = useAuth();
  const { data: roadmap, isLoading, refetch } = useRoadmap(authInfo);
  const { openCourseModal } = useCourseSelection();

  useEffect(() => {
    if (isAuthenticated === false && isLoaded) {
      router.push("/login");
    } else if (isAuthenticated === false) {
      setAsLoaded();
    }
  }, [isAuthenticated, router]);

  if (isLoading || !roadmap) {
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
        <span className="text-lg text-gray-700 font-medium">로드맵을 불러오는 중...</span>
      </div>
    );
  }

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <RoadmapView
      roadmap={roadmap.semesters}
      currentSemester={roadmap.currentSemester.replace("FIRST", 1).replace("SECOND", 2)}
      currentGrade={roadmap.currentGrade}
      onCourseClick={openCourseModal}
      onRefresh={handleRefresh}
    />
  );
}
