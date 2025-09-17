import { Student } from "@/types";

export async function loginService(studentId: string, password: string): Promise<Student> {
  const res = await fetch("http://localhost:8080/api/users/login", {
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
  return data.student;
}

export async function logoutService(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
