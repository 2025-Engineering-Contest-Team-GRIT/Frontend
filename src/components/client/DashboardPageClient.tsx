"use client";

import { DashboardView } from "@/components/views/DashboardView";
import { useAuth, useNavigation } from "@/hooks/useStore";
import { CSRErrorBoundary } from "./ErrorBoundary";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function DashboardContent() {
  const { user, isAuthenticated } = useAuth();
  const { navigateToView } = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return <div className="p-8">로딩 중...</div>;
  }

  const handleViewPublicProfile = () => {
    // Navigate to public profile
    console.log("Navigate to public profile");
  };

  return (
    <DashboardView
      student={user}
      setActiveView={navigateToView}
      onViewPublicProfile={handleViewPublicProfile}
    />
  );
}

export function DashboardPageClient() {
  return (
    <CSRErrorBoundary>
      <DashboardContent />
    </CSRErrorBoundary>
  );
}
