"use client";
import { ReactNode, useState } from "react";
import { CSRNavigation } from "@/components/client/Navigation";
import "../globals.css";
import { HeaderClientWrapper } from "@/components/client/wrapper/HeaderClientWrapper";
import { useAuth } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { OnboardingRestartModal } from "@/components/OnboardingRestartModal";

export default function AppLayout({ children }: { children: ReactNode }) {
  // 실제 서비스에서는 SSR에서 유저 fetch
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* 온보딩 재시작 모달 */}
      <OnboardingRestartModal
        isOpen={isOnboardingModalOpen}
        isLoading={isLoading}
        error={error}
        setIsLoading={setIsLoading}
        onClose={() => {
          setIsOnboardingModalOpen(false);
        }}
      />
      <HeaderClientWrapper />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white/60 backdrop-blur-sm border-r border-slate-200/80 p-4 shrink-0">
          <CSRNavigation onBoardingOpen={setIsOnboardingModalOpen} />
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
