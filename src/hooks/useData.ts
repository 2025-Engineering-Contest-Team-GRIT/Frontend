import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentStatus } from '@/types';

// Student data hooks
export const useStudent = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['student', status],
    queryFn: async () => {
      const res = await fetch(`/api/student?status=${status}`);
      if (!res.ok) throw new Error('학생 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Timetable data hooks
export const useTimetable = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['timetable', status],
    queryFn: async () => {
      const res = await fetch(`/api/timetable?status=${status}`);
      if (!res.ok) throw new Error('시간표 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Statistics data hooks
export const useStatistics = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['statistics', status],
    queryFn: async () => {
      const res = await fetch(`/api/statistics?status=${status}`);
      if (!res.ok) throw new Error('통계 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Courses data hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch(`/api/courses`);
      if (!res.ok) throw new Error('과목 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Graduation data hooks
export const useGraduation = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['graduation', status],
    queryFn: async () => {
      const res = await fetch(`/api/graduation?status=${status}`);
      if (!res.ok) throw new Error('졸업요건 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Settings data hooks
export const useSettings = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['settings', status],
    queryFn: async () => {
      const res = await fetch(`/api/settings?status=${status}`);
      if (!res.ok) throw new Error('설정 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Roadmap data hooks
export const useRoadmap = (status: StudentStatus = StudentStatus.SOPHOMORE) => {
  return useQuery({
    queryKey: ['roadmap', status],
    queryFn: async () => {
      const res = await fetch(`/api/roadmap?status=${status}`);
      if (!res.ok) throw new Error('로드맵 정보를 불러올 수 없습니다');
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Student update mutation
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedStudent: any) => {
      const res = await fetch('/api/student', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
      if (!res.ok) throw new Error('학생 정보 업데이트에 실패했습니다');
      return res.json();
    },
    onSuccess: (updatedStudent) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['student'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Settings update mutation
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: any) => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('설정 업데이트에 실패했습니다');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};