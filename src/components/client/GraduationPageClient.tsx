"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GraduationView } from "@/components/views/GraduationView";
import { useAuth } from "@/hooks/useStore";
import { useGraduation } from "@/hooks/useData";
import { mockStudents } from "@/data/mockData";
import { StudentStatus } from "@/types";
import { putGraduationCertification } from "@/services/modifyService";

export function GraduationPageClient() {
  const { authInfo, isAuthenticated } = useAuth();
  const { data: graduation, isLoading: loadingGraduation, refetch } = useGraduation(authInfo);
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleCertificationChange = async (
    type: string,
    isCompleted: boolean,
  ): Promise<boolean> => {
    if (!authInfo || !authInfo.userId) return false;
    const result = await putGraduationCertification(type, String(authInfo.userId), isCompleted);
    refetch();
    return result;
  };

  if (!authInfo || loadingGraduation || !graduation) {
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
        <span className="text-lg text-gray-700 font-medium">졸업정보를 불러오는 중...</span>
      </div>
    );
  } else {
    return (
      <GraduationView
        graduationInfo={graduation}
        onCertificationChange={handleCertificationChange}
      />
    );
  }
}
