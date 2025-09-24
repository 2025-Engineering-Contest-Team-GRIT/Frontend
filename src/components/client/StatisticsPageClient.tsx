// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { StatisticsView } from "@/components/views/StatisticsView";
// import { useAuth } from "@/hooks/useStore";
// import { useStatistics, useCourses } from "@/hooks/useData";
// import { mockStudents } from "@/data/mockData";
// import { StudentStatus } from "@/types";

// export function StatisticsPageClient() {
//   const { authInfo, isAuthenticated } = useAuth();
//   const { data: statistics, isLoading: loadingStatistics } = useStatistics();
//   const { data: allCourses, isLoading: loadingCourses } = useCourses();
//   const router = useRouter();
//   const user = mockStudents[StudentStatus.SOPHOMORE];

//   React.useEffect(() => {
//     if (isAuthenticated === false) {
//       router.push("/login");
//     }
//   }, [isAuthenticated, router]);

//   if (!authInfo || loadingStatistics || loadingCourses || !statistics || !allCourses) {
//     return <div className="p-8">로딩 중...</div>;
//   }

//   return <StatisticsView student={user} allCourses={allCourses} />;
// }
