"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/views/OnboardingScreen";
import { useAuth } from "@/hooks/useStore";
import {
  fetchRecommendedRoadmaps,
  fetchUserInfo,
  InfoFetchResponse,
  RecommendProps,
} from "@/services/authService";
import { OnboardingRestartModal } from "@/components/OnboardingRestartModal";

interface OnboardingPageProps {
  params: {
    type: string;
  };
}

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const { type } = params;
  const { authInfo, isAuthenticated } = useAuth();
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState(type === "retry");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();
  const [password, setPassword] = React.useState("");

  const handleOnboardingRestart = async (password: string) => {
    setIsLoading(true);
    setError("");

    setPassword(password);
    setIsLoading(false);
    setIsOnboardingModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsOnboardingModalOpen(false);
    setError("");
  };

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    if (type === "retry") return;
    const tempPw =
      typeof window !== "undefined" ? sessionStorage.getItem("onboarding_temp_pw") : null;
    if (tempPw) {
      sessionStorage.removeItem("onboarding_temp_pw");
      // tempPw를 필요한 곳에 사용
    }
    if (tempPw) setPassword(tempPw);
  }, []);

  const handleInfoFetch = async (): Promise<InfoFetchResponse> => {
    // 종합정보시스템에서 사용자 정보 가져오기 (비밀번호 필요)
    if (!password) {
      return { success: false };
    }
    try {
      const result = await fetchUserInfo(authInfo!.userId, password);
      if (result) {
        return { success: true, track: result.track }; // Adjust if result has a 'track' property
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      return { success: false };
    }
  };

  const handleRecommendRoadmaps = async (recommandProps: RecommendProps): Promise<boolean> => {
    try {
      const result = await fetchRecommendedRoadmaps(recommandProps);
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("추천 로드맵 가져오기 실패:", error);
      return false;
    }
  };

  const handleOnComplete = () => {
    router.push("/dashboard");
  };

  if (!authInfo) return null;
  return (
    <>
      <OnboardingScreen
        authInfo={authInfo}
        onInfoFetch={handleInfoFetch}
        onRecommendRoadmaps={handleRecommendRoadmaps}
        onComplete={handleOnComplete}
      />

      <OnboardingRestartModal
        isOpen={isOnboardingModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleOnboardingRestart}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
