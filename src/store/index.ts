import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Student, StudentWithMetrics, Course, AllCourses } from '@/types';
import { CourseStatus } from '@/types';


// 서버 데이터 상태 제거, 클라이언트 인증 여부만 유지
interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

interface UIState {
  activeView: string;
  screen: 'login' | 'app' | 'publicProfile';
  selectedCourseId: string | null;
  isAiLoading: boolean;
  setActiveView: (view: string) => void;
  setScreen: (screen: 'login' | 'app' | 'publicProfile') => void;
  setSelectedCourseId: (courseId: string | null) => void;
  setIsAiLoading: (loading: boolean) => void;
}

interface CourseState {
  selectedCourseForModal: Course | null;
  aiRecommendation: string;
  setSelectedCourseForModal: (course: Course | null) => void;
  setAiRecommendation: (recommendation: string) => void;
}

// Helper function to calculate derived student data
const calculateStudentMetrics = (student: Student | null): StudentWithMetrics | null => {
  if (!student) return null;

  const gradeToPoint: Record<string, number> = {
    'A+': 4.5, 'A': 4.0, 'A0': 4.0, 'B+': 3.5, 'B': 3.0, 'B0': 3.0,
    'C+': 2.5, 'C': 2.0, 'C0': 2.0, 'D+': 1.5, 'D': 1.0, 'D0': 1.0, 'F': 0.0,
  };

  const completedCourses = student.roadmap.semesters
    .flatMap(s => s.courses)
    .filter(c => c.status === CourseStatus.COMPLETED);

  const completedCredits = completedCourses.reduce((acc, c) => acc + c.credits, 0);

  let totalPoints = 0;
  let totalCreditedForGpa = 0;

  completedCourses
    .filter(c => c.grade && gradeToPoint[c.grade] !== undefined)
    .forEach(course => {
      if (course.grade) {
        totalPoints += course.credits * (gradeToPoint[course.grade] ?? 0);
        totalCreditedForGpa += course.credits;
      }
    });

  const gpa = totalCreditedForGpa > 0 ? parseFloat((totalPoints / totalCreditedForGpa).toFixed(2)) : 0;

  const enrolledSemesters = student.roadmap.semesters.filter(s => 
    s.courses.some(c => c.status === CourseStatus.ENROLLED)
  );

  let currentYear: number | null = null;
  let currentSemester: number | null = null;

  if (enrolledSemesters.length > 0) {
    const latestEnrolled = enrolledSemesters.reduce((latest, current) => {
      if (current.year > latest.year) return current;
      if (current.year === latest.year && current.semester > latest.semester) return current;
      return latest;
    }, enrolledSemesters[0]);
    currentYear = latestEnrolled.year;
    currentSemester = latestEnrolled.semester;
  } else {
    const completedSemesters = student.roadmap.semesters.filter(s =>
      s.courses.some(c => c.status === CourseStatus.COMPLETED)
    );
    if (completedSemesters.length > 0) {
      const latestCompleted = completedSemesters.reduce((latest, current) => {
        if (current.year > latest.year) return current;
        if (current.year === latest.year && current.semester > latest.semester) return current;
        return latest;
      }, completedSemesters[0]);
      
      if (latestCompleted.semester === 2) {
        currentYear = latestCompleted.year + 1;
        currentSemester = 1;
      } else {
        currentYear = latestCompleted.year;
        currentSemester = latestCompleted.semester + 1;
      }
    } else if (student.roadmap.semesters.length > 0) {
      const firstSemester = [...student.roadmap.semesters].sort((a,b) => (a.year - b.year) || (a.semester - b.semester))[0];
      currentYear = firstSemester.year;
      currentSemester = firstSemester.semester;
    }
  }

  return { ...student, completedCredits, gpa, currentYear, currentSemester };
};


export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      activeView: 'dashboard',
      screen: 'login' as const,
      selectedCourseId: null,
      isAiLoading: false,
      setActiveView: (view: string) => set({ activeView: view }),
      setScreen: (screen: 'login' | 'app' | 'publicProfile') => set({ screen }),
      setSelectedCourseId: (courseId: string | null) => set({ selectedCourseId: courseId }),
      setIsAiLoading: (loading: boolean) => set({ isAiLoading: loading }),
    }),
    {
      name: 'ui-store',
    }
  )
);

  devtools(
    (set) => ({
      selectedCourseForModal: null,
      aiRecommendation: '',
      setSelectedCourseForModal: (course: Course | null) => set({ selectedCourseForModal: course }),
      setAiRecommendation: (recommendation: string) => set({ aiRecommendation: recommendation }),
    }),
    {
      name: 'course-store',
    }
  )
);
