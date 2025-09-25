import { AuthInfo } from "@/types";

export async function loginService(
  studentId: string,
  password: string,
): Promise<{ authInfo: AuthInfo; isNewUser: boolean }> {
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({
      student_id: studentId,
      password,
    }),
  });
  if (!res.ok) {
    throw new Error("학번 또는 비밀번호가 올바르지 않습니다.");
  }
  const data = await res.json();
  return { authInfo: { token: data.access_token, userId: studentId }, isNewUser: data.is_new_user };
}

export async function logoutService(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export interface InfoFetchResponse {
  success: boolean;
  track?: string[];
}

export async function fetchUserInfo(
  studentId: string,
  password: string,
): Promise<InfoFetchResponse> {
  const res = await fetch("/api/users/crawling", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({
      student_id: studentId,
      password,
    }),
  });
  if (!res.ok) {
    throw new Error("사용자 정보를 불러오는데 실패했습니다.");
  }
  const data = await res.json();
  return { success: data.status == 200, track: [data.track1, data.track2] };
}

export interface RecommendProps {
  student_id: string;
  track_ids: number[];
  learning_style: {
    credits_per_semester: string;
    style_preference: string;
    ratio_preference: string;
  };
  advanced_settings: {
    tech_stack: string;
  };
}

export async function fetchRecommendedRoadmaps(recommendProps: RecommendProps): Promise<boolean> {
  const res = await fetch("/api/roadmap/courses/roadmap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(recommendProps),
  });
  console.log(res);
  if (res.status < 200 && res.status >= 300) {
    throw new Error("추천 로드맵을 불러오는데 실패했습니다.");
  }
  const data = await res.json();
  return data.message;
}
