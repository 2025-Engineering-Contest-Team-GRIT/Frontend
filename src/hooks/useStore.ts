import { useCallback } from "react";
import { useAuthStore, useUIStore, useCourseStore } from "@/store";
import type { Course, Student } from "@/types";

// Auth state management hook
export const useAuth = () => {
  const { isAuthenticated, login, logout, user, setUser } = useAuthStore();

  return {
    isAuthenticated,
    user,
    setUser: useCallback((student: Student | null) => setUser(student), [setUser]),
    login: useCallback(() => login(), [login]),
    logout: useCallback(() => logout(), [logout]),
  };
};

// UI state management hook
export const useUI = () => {
  const {
    activeView,
    screen,
    selectedCourseId,
    isAiLoading,
    setActiveView,
    setScreen,
    setSelectedCourseId,
    setIsAiLoading,
  } = useUIStore();

  return {
    activeView,
    screen,
    selectedCourseId,
    isAiLoading,
    setActiveView: useCallback((view: string) => setActiveView(view), [setActiveView]),
    setScreen: useCallback(
      (screen: "login" | "app" | "publicProfile") => setScreen(screen),
      [setScreen],
    ),
    setSelectedCourseId: useCallback(
      (courseId: string | null) => setSelectedCourseId(courseId),
      [setSelectedCourseId],
    ),
    setIsAiLoading: useCallback((loading: boolean) => setIsAiLoading(loading), [setIsAiLoading]),
  };
};

// Course state management hook
export const useCourse = () => {
  const {
    selectedCourseForModal,
    aiRecommendation,
    setSelectedCourseForModal,
    setAiRecommendation,
  } = useCourseStore();

  return {
    selectedCourseForModal,
    aiRecommendation,
    setSelectedCourseForModal: useCallback(
      (course: Course | null) => setSelectedCourseForModal(course),
      [setSelectedCourseForModal],
    ),
    setAiRecommendation: useCallback(
      (recommendation: string) => setAiRecommendation(recommendation),
      [setAiRecommendation],
    ),
  };
};

// Combined navigation hook for easier usage
export const useNavigation = () => {
  const { setActiveView, setScreen } = useUI();

  return {
    navigateToView: useCallback((view: string) => setActiveView(view), [setActiveView]),
    navigateToScreen: useCallback(
      (screen: "login" | "app" | "publicProfile") => setScreen(screen),
      [setScreen],
    ),
    navigateToDashboard: useCallback(() => setActiveView("dashboard"), [setActiveView]),
    navigateToRoadmap: useCallback(() => setActiveView("roadmap"), [setActiveView]),
    navigateToSettings: useCallback(() => setActiveView("settings"), [setActiveView]),
  };
};

// Course selection hook for modals and interactions
export const useCourseSelection = () => {
  const { selectedCourseForModal, setSelectedCourseForModal } = useCourse();
  const { setSelectedCourseId } = useUI();

  return {
    selectedCourse: selectedCourseForModal,
    openCourseModal: useCallback(
      (course: Course) => {
        setSelectedCourseForModal(course);
        setSelectedCourseId(course.id);
      },
      [setSelectedCourseForModal, setSelectedCourseId],
    ),
    closeCourseModal: useCallback(() => {
      setSelectedCourseForModal(null);
      setSelectedCourseId(null);
    }, [setSelectedCourseForModal, setSelectedCourseId]),
  };
};

// Loading state management hook
export const useLoadingState = () => {
  const { isAiLoading, setIsAiLoading } = useUI();

  return {
    isAiLoading,
    setAiLoading: useCallback((loading: boolean) => setIsAiLoading(loading), [setIsAiLoading]),
    withLoading: useCallback(
      async (asyncFn: () => Promise<void>) => {
        setIsAiLoading(true);
        try {
          await asyncFn();
        } finally {
          setIsAiLoading(false);
        }
      },
      [setIsAiLoading],
    ),
  };
};
