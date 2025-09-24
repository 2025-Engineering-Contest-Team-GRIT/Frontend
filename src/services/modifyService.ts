import { AuthInfo } from "@/types";

export async function putGraduationCertification(
  type: string,
  studentId: string,
  isCompleted: boolean,
): Promise<boolean> {
  const res = await fetch(
    `api/v1/graduation/certifications/${type}?studentId=${studentId}&isCompleted=${isCompleted}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    },
  );
  return res.status === 200;
}

export async function postAddFavoriteCourse(authInfo: AuthInfo | null, courseId: number) {
  if (!authInfo) {
    throw new Error("인증 정보가 없습니다.");
  }
  const res = await fetch(`/api/users/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${authInfo.token}`,
    },
    body: JSON.stringify({ courseId }),
  });
  if (!res.ok) throw new Error("관심과목 추가에 실패했습니다.");
  return res.json();
}

export async function deleteRemoveFavoriteCourse(authInfo: AuthInfo | null, courseId: number) {
  if (!authInfo) {
    throw new Error("인증 정보가 없습니다.");
  }
  const res = await fetch(`/api/users/courses/favorites/${courseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
      Authorization: `Bearer ${authInfo.token}`,
    },
  });
  if (!res.ok) throw new Error("관심과목 제거에 실패했습니다.");
  return res.json();
}
