"use client";

import { SSRHeader } from "@/components/server/Layout";
import { LoginScreen } from "@/components/views/LoginScreen";
import { useAuth } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/authService";

export const LoginClientWrapper = () => {
  const router = useRouter();
  const { login, setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: ({ studentId, password }: { studentId: string; password: string }) =>
      loginService(studentId, password),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // setUser(student);
      login();
      // router.push("/dashboard");
      alert("로그인 성공! 대시보드로 이동합니다.");
    },
    onError: (error: any) => {
      // 에러 처리는 LoginScreen에서 catch로 처리
    },
  });

  const onLogin = async (studentId: string, password: string) => {
    await loginMutation.mutateAsync({ studentId, password });
  };

  const onViewPublicProfileDemo = () => {
    router.push("/profile/145");
  };

  return <LoginScreen onLogin={onLogin} onViewPublicProfileDemo={onViewPublicProfileDemo} />;
};
