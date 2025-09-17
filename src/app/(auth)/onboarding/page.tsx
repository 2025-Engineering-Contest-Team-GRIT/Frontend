import React from "react";
import { useRouter } from "next/navigation";
import { OnboardingScreen } from "@/components/views/OnboardingScreen";
import { useAuth } from "@/hooks/useStore";

export default function OnboardingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;
  return <OnboardingScreen student={user} onComplete={() => {}} onExit={() => {}} />;
}
