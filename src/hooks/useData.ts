import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthInfo, StudentStatus } from "@/types";

// Student data hooks
export const useDashboard = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["dashboard-info", status],
    queryFn: async () => {
      console.log(status);
      const res = await fetch(`/api/users/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });

      if (!res.ok) throw new Error("학생 정보를 불러올 수 없습니다");
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Timetable data hooks
export const useTimetable = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["timetable", status],
    queryFn: async () => {
      const res = await fetch(`/api/timetable`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("시간표 정보를 불러올 수 없습니다");
      const result = await res.json();
      return result.data.timetable;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Courses data hooks
export const useCourses = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["courses", status],
    queryFn: async () => {
      const res = await fetch(`/api/users/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("과목 정보를 불러올 수 없습니다");
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 10 minutes
  });
};

// Graduation data hooks
export const useGraduation = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["graduation", status],
    queryFn: async () => {
      const res = await fetch(`/api/v1/graduation/dashboard?studentId=${status?.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("졸업요건 정보를 불러올 수 없습니다");
      const result = await res.json();
      console.log(result.result);
      return result.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Settings data hooks
export const useSettings = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ["settings", status],
    queryFn: async () => {
      const res = await fetch(`/api/settings?status=${status}`);
      if (!res.ok) throw new Error("설정 정보를 불러올 수 없습니다");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Roadmap data hooks
export const useRoadmap = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["roadmap", status],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap/roadmaps`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("로드맵 정보를 불러올 수 없습니다");
      const result = await res.json();
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Statistics data hooks
export const useStatistics = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ["statistics", status],
    queryFn: async () => {
      const res = await fetch(`/api/statistics?status=${status}`);
      if (!res.ok) throw new Error("통계 정보를 불러올 수 없습니다");
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Settings update mutation
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("설정 업데이트에 실패했습니다");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
  });
};

export const usePlans = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["plans", status],
    queryFn: async () => {
      const res = await fetch(`/api/users/plans?studentId=${status?.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("학습 계획 정보를 불러올 수 없습니다");
      const result = await res.json();
      return result.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePlanBasicInfo = (status: AuthInfo | null) => {
  return useQuery({
    queryKey: ["plan-basic-info", status],
    queryFn: async () => {
      const res = await fetch(`/api/simulation/data?studentId=${status?.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: status ? `Bearer ${status.token}` : "",
        },
      });
      if (!res.ok) throw new Error("학습 계획 기본 정보를 불러올 수 없습니다");
      const result = await res.json();
      return result.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
