"use client";

import { LoginScreen } from "@/components/views/LoginScreen";
import { useAuth } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/authService";

export const LoginClientWrapper = () => {
  const router = useRouter();
  const { login, setAsLoaded } = useAuth();

  const loginMutation = useMutation({
    mutationFn: ({ studentId, password }: { studentId: string; password: string }) =>
      loginService(studentId, password),
    onSuccess: (data, variables) => {
      // setUser(student);
      login(data.authInfo);
      setAsLoaded();
      if (data.isNewUser) {
        // 비밀번호를 sessionStorage에 일회성으로 저장
        if (typeof window !== "undefined") {
          sessionStorage.setItem("onboarding_temp_pw", variables.password);
        }
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
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
