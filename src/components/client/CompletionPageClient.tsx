"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CompletionStatusView } from "@/components/views/CompletionStatusView";
import { useAuth } from "@/hooks/useStore";
import { useCourses } from "@/hooks/useData";

export function CompletionPageClient() {
  const { user, isAuthenticated } = useAuth();
  const { data: allCourses, isLoading: loadingCourses } = useCourses();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user || loadingCourses || !allCourses) {
    return <div className="p-8">로딩 중...</div>;
  }

  const handleToggleFavorite = (courseId: string) => {
    // Toggle favorite logic
    console.log("Toggle favorite:", courseId);
  };

  const handleToggleRoadmap = (courseId: string) => {
    // Toggle roadmap logic
    console.log("Toggle roadmap:", courseId);
  };

  return (
    <CompletionStatusView
      student={user}
      allCourses={allCourses}
      onToggleFavorite={handleToggleFavorite}
      onToggleRoadmap={handleToggleRoadmap}
    />
  );
}
