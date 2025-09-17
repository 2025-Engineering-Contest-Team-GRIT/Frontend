"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StatisticsView } from "@/components/views/StatisticsView";
import { useAuth } from "@/hooks/useStore";
import { useStatistics, useCourses } from "@/hooks/useData";

export function StatisticsPageClient() {
  const { user, isAuthenticated } = useAuth();
  const { data: statistics, isLoading: loadingStatistics } = useStatistics();
  const { data: allCourses, isLoading: loadingCourses } = useCourses();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user || loadingStatistics || loadingCourses || !statistics || !allCourses) {
    return <div className="p-8">로딩 중...</div>;
  }

  return <StatisticsView student={user} allCourses={allCourses} />;
}
