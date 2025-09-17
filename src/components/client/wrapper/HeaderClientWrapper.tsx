"use client";

import { SSRHeader } from "@/components/server/Layout";
import { useAuth } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logoutService } from "@/services/authService";

export const HeaderClientWrapper = () => {
  const router = useRouter();
  const { user, logout, setUser } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      logout();
      setUser(null);
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return <SSRHeader student={user ?? undefined} onLogout={handleLogout} />;
};
