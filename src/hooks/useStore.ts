import { useCallback } from "react";
import {
  useAuthStore,
  useUIStore,
  useCourseStore,
  useCompletionStore,
  useSimulationStore,
} from "@/store";
import type {
  Course,
  AuthInfo,
  CourseListItem,
  extendedShortCourse,
  shortTrackInfo,
  GraduationInfo,
} from "@/types";
import { deleteRemoveFavoriteCourse, postAddFavoriteCourse } from "@/services/modifyService";

// Auth state management hook
export const useAuth = () => {
  const { isAuthenticated, setAsLoaded, isLoaded, login, logout, authInfo } = useAuthStore();

  return {
    isAuthenticated,
    authInfo,
    isLoaded,
    setAsLoaded: useCallback(() => {
      setAsLoaded();
    }, [setAsLoaded]),
    login: useCallback(
      (data: AuthInfo) => {
        login(data);
      },
      [login],
    ),
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
        setSelectedCourseId(course.courseId.toString());
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

export const useCompletionState = () => {
  const { completionInfo, setCompletionInfo, setAsFavorite, unsetAsFavorite } =
    useCompletionStore();

  const { authInfo } = useAuthStore();
  return {
    completionInfo,
    setCompletionInfo: useCallback(
      (info: CourseListItem[]) => setCompletionInfo(info),
      [setCompletionInfo],
    ),
    setAsFavorite: useCallback(
      (courseId: number) => {
        setAsFavorite(courseId);
        postAddFavoriteCourse(authInfo, courseId);
      },
      [setAsFavorite],
    ),
    unsetAsFavorite: useCallback(
      (courseId: number) => {
        unsetAsFavorite(courseId);
        deleteRemoveFavoriteCourse(authInfo, courseId);
      },
      [unsetAsFavorite],
    ),
  };
};

// 시뮬레이션 상태 관리 hook
export const useSimulation = () => {
  const {
    availableCourses,
    userTracks,
    graduationInfo,
    roadmapCourses,
    changedTracks,
    isModified,
    setBasicData,
    addCourseToRoadmap,
    removeCourseFromRoadmap,
    changeCourseTrack,
    resetSimulation,
    saveSimulation,
    cancelChanges,
    setIsModified,
  } = useSimulationStore();

  return {
    availableCourses,
    userTracks,
    graduationInfo,
    roadmapCourses,
    changedTracks,
    isModified,
    setBasicData: useCallback(
      (
        availableCourses: extendedShortCourse[],
        userTracks: shortTrackInfo[],
        graduationInfo: GraduationInfo,
      ) => setBasicData(availableCourses, userTracks, graduationInfo),
      [setBasicData],
    ),
    addCourseToRoadmap: useCallback(
      (course: extendedShortCourse, trackId: number, year: number, semester: number) =>
        addCourseToRoadmap(course, trackId, year, semester),
      [addCourseToRoadmap],
    ),
    removeCourseFromRoadmap: useCallback(
      (courseCode: string) => removeCourseFromRoadmap(courseCode),
      [removeCourseFromRoadmap],
    ),
    changeCourseTrack: useCallback(
      (courseCode: string, newTrackId: number) => changeCourseTrack(courseCode, newTrackId),
      [changeCourseTrack],
    ),
    resetSimulation: useCallback(() => resetSimulation(), [resetSimulation]),
    saveSimulation: useCallback(() => saveSimulation(), [saveSimulation]),
    cancelChanges: useCallback(() => cancelChanges(), [cancelChanges]),
    setIsModified: useCallback((modified: boolean) => setIsModified(modified), [setIsModified]),
  };
};
