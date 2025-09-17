"use client";

import React from "react";
import { PublicProfileView } from "@/components/views/PublicProfileView";
import { Student } from "@/types";
import { mockStudents } from "@/data/mockData";
import { useRouter } from "next/navigation";

export default function ProfilePage({ userId }: { userId: string }) {
  //* TODO: userId에 해당하는 유저 정보 불러오기
  const router = useRouter();

  const user: Student = mockStudents["재학생"]; // Replace with fetched user data

  const onGoBack = () => {
    router.push("/login");
  };

  return <PublicProfileView student={user} onGoBack={onGoBack} isExternal={false} />;
}
