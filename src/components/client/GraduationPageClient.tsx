"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationView } from "@/components/views/GraduationView";
import { useAuth } from "@/hooks/useStore";
import { useGraduation } from "@/hooks/useData";

export function GraduationPageClient() {
  const { user, isAuthenticated } = useAuth();
  const { data: graduation, isLoading: loadingGraduation } = useGraduation();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user || loadingGraduation || !graduation) {
    return <div className="p-8">로딩 중...</div>;
  }

  // graduation 데이터(credits, roadmap 등)를 user에 병합하여 전달
  const mergedStudent = { ...user, ...graduation };
  return <GraduationView student={mergedStudent} />;
}
