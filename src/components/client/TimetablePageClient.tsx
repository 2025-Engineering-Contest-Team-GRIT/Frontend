"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TimetableView } from "@/components/views/TimetableView";
import { useAuth } from "@/hooks/useStore";
import { useTimetable } from "@/hooks/useData";

export function TimetablePageClient() {
  const { user, isAuthenticated } = useAuth();
  const { data: timetable, isLoading: loadingTimetable } = useTimetable();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user || loadingTimetable || !timetable) {
    return <div className="p-8">로딩 중...</div>;
  }

  const mergedStudent = { ...user, timetable };
  return <TimetableView student={mergedStudent} />;
}
