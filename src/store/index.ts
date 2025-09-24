import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
//import type { StudentWithMetrics, Course, AllCourses, Student } from "@/types"; --- IGNORE ---

import { CourseStatus, AuthInfo } from "@/types";
import type { Course, CourseListItem } from "@/types";

// 서버 데이터 상태 제거, 클라이언트 인증 여부만 유지

interface AuthState {
  isAuthenticated: boolean;
  authInfo: AuthInfo | null;
  isLoaded: boolean;
  setAsLoaded: () => void;
  login: (data: AuthInfo) => void;
  logout: () => void;
}

interface UIState {
  activeView: string;
  screen: "login" | "app" | "publicProfile";
  selectedCourseId: string | null;
  isAiLoading: boolean;
  setActiveView: (view: string) => void;
  setScreen: (screen: "login" | "app" | "publicProfile") => void;
  setSelectedCourseId: (courseId: string | null) => void;
  setIsAiLoading: (loading: boolean) => void;
}

interface CourseState {
  selectedCourseForModal: Course | null;
  aiRecommendation: string;
  setSelectedCourseForModal: (course: Course | null) => void;
  setAiRecommendation: (recommendation: string) => void;
}

interface CompletionState {
  completionInfo: CourseListItem[] | null;
  setCompletionInfo: (info: CourseListItem[]) => void;
  setAsFavorite: (courseId: number) => void;
  unsetAsFavorite: (courseId: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      (set) => ({
        isAuthenticated: false,
        isLoaded: false,
        authInfo: null,
        setAsLoaded: () => set({ isLoaded: true }),
        login: (data: AuthInfo) => set({ isAuthenticated: true, authInfo: data }),
        logout: () => set({ isAuthenticated: false, authInfo: null }),
      }),
      { name: "auth-store" },
    ),
    { name: "auth-store" },
  ),
);

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      activeView: "dashboard",
      screen: "login" as const,
      selectedCourseId: null,
      isAiLoading: false,
      setActiveView: (view: string) => set({ activeView: view }),
      setScreen: (screen: "login" | "app" | "publicProfile") => set({ screen }),
      setSelectedCourseId: (courseId: string | null) => set({ selectedCourseId: courseId }),
      setIsAiLoading: (loading: boolean) => set({ isAiLoading: loading }),
    }),
    {
      name: "ui-store",
    },
  ),
);

export const useCompletionStore = create<CompletionState>()(
  devtools(
    (set) => ({
      completionInfo: null,
      setCompletionInfo: (info: CourseListItem[]) => set({ completionInfo: info }),
      setAsFavorite: (courseId: number) =>
        set((state) => {
          if (!state.completionInfo) return state;
          const updatedCourses = state.completionInfo.map((courseItem: CourseListItem) =>
            courseItem.course.id === courseId ? { ...courseItem, is_favorite: true } : courseItem,
          );
          return { completionInfo: updatedCourses };
        }),
      unsetAsFavorite: (courseId: number) =>
        set((state) => {
          if (!state.completionInfo) return state;
          const updatedCourses = state.completionInfo.map((courseItem: CourseListItem) =>
            courseItem.course.id === courseId ? { ...courseItem, is_favorite: false } : courseItem,
          );
          return { completionInfo: updatedCourses };
        }),
    }),
    {
      name: "completion-store",
    },
  ),
);

export const useCourseStore = create<CourseState>()(
  devtools(
    (set) => ({
      selectedCourseForModal: null,
      aiRecommendation: "",
      setSelectedCourseForModal: (course: Course | null) => set({ selectedCourseForModal: course }),
      setAiRecommendation: (recommendation: string) => set({ aiRecommendation: recommendation }),
    }),
    {
      name: "course-store",
    },
  ),
);
