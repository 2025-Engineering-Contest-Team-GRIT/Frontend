import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseRecommendationReason } from '@/services/geminiService';
import type { Course, Student, StudentWithMetrics } from '@/types';

// Query Keys
export const QUERY_KEYS = {
  STUDENTS: 'students',
  STUDENT: 'student',
  COURSES: 'courses',
  AI_RECOMMENDATION: 'ai-recommendation',
} as const;

// Mock API functions (in a real app, these would be actual API calls)
export const studentApi = {
  getStudents: async (): Promise<Student[]> => {
    // Mock implementation - in real app this would fetch from API
    return Promise.resolve([]);
  },
  
  getStudent: async (id: number): Promise<Student | null> => {
    // Mock implementation
    return Promise.resolve(null);
  },
  
  updateStudent: async (student: Student): Promise<Student> => {
    // Mock implementation - in real app this would save to backend
    return Promise.resolve(student);
  },
};

export const courseApi = {
  getCourses: async (): Promise<Course[]> => {
    // Mock implementation
    return Promise.resolve([]);
  },
  
  getCourse: async (id: string): Promise<Course | null> => {
    // Mock implementation
    return Promise.resolve(null);
  },
};

// React Query Hooks
export const useStudents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS],
    queryFn: studentApi.getStudents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENT, id],
    queryFn: () => studentApi.getStudent(id),
    enabled: !!id,
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentApi.updateStudent,
    onSuccess: (updatedStudent) => {
      // Invalidate and refetch student data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT, updatedStudent.id] });
    },
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSES],
    queryFn: courseApi.getCourses,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAIRecommendation = (course: Course | null, student: StudentWithMetrics | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.AI_RECOMMENDATION, course?.id, student?.id],
    queryFn: () => {
      if (!course || !student) {
        throw new Error('Course and student are required');
      }
      return getCourseRecommendationReason(course, student);
    },
    enabled: !!(course && student),
    retry: 1,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (AI recommendations don't change often)
  });
};
