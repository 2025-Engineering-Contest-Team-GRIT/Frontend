import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
//import type { StudentWithMetrics, Course, AllCourses, Student } from "@/types"; --- IGNORE ---

import { AuthInfo } from "@/types";
import type {
  Course,
  CourseListItem,
  extendedShortCourse,
  shortTrackInfo,
  GraduationInfo,
} from "@/types";

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

// 시뮬레이션 상태 관리를 위한 인터페이스
interface SimulationCourse {
  course_code: string;
  course_name: string;
  credits: number;
  course_type: string;
  open_grade: number;
  open_semester: "FIRST" | "SECOND" | "SUMMER";
  track_id?: number;
  year: number; // 사용자가 선택한 학년
  semester: number; // 사용자가 선택한 학기 (1 또는 2)
}

// 과목 분류 영어 -> 한국어 변환 함수
const getCourseTypeInKorean = (courseType: string): string => {
  const typeMapping: Record<string, string> = {
    MANDATORY: "전공필수",
    ELECTIVE: "전공선택",
    FOUNDATION: "전공기초",
    LIBERAL_ARTS_REQUIRED: "교양필수",
    CORE_LIBERAL_ARTS: "핵심교양",
    LIBERAL_ARTS_ELECTIVE: "일반교양",
    // 기존 한국어는 그대로 유지
    전공필수: "전공필수",
    전공선택: "전공선택",
    전공기초: "전공기초",
    교양필수: "교양필수",
    핵심교양: "핵심교양",
    일반교양: "일반교양",
  };

  return typeMapping[courseType] || courseType;
};

interface SimulationState {
  // 기본 데이터
  availableCourses: extendedShortCourse[];
  userTracks: shortTrackInfo[];
  graduationInfo: GraduationInfo | null;

  // 시뮬레이션 로드맵 (학년-학기별 과목 배치)
  roadmapCourses: SimulationCourse[];

  // 기존 수강 과목의 트랙 변경 정보 (courseCode -> newTrackId)
  changedTracks: Record<string, number>;

  // UI 상태
  isModified: boolean;

  // Actions
  setBasicData: (
    availableCourses: extendedShortCourse[],
    userTracks: shortTrackInfo[],
    graduationInfo: GraduationInfo,
  ) => void;
  addCourseToRoadmap: (
    course: extendedShortCourse,
    trackId: number,
    year: number,
    semester: number,
  ) => void;
  removeCourseFromRoadmap: (courseCode: string) => void;
  changeCourseTrack: (courseCode: string, newTrackId: number) => void;
  resetSimulation: () => void;
  saveSimulation: () => void;
  cancelChanges: () => void;
  setIsModified: (modified: boolean) => void;
}

export const useSimulationStore = create<SimulationState>()(
  devtools(
    (set, get) => ({
      availableCourses: [],
      userTracks: [],
      graduationInfo: null,
      roadmapCourses: [],
      changedTracks: {},
      isModified: false,

      setBasicData: (availableCourses, userTracks, graduationInfo) =>
        set((state) => {
          // 이미 같은 데이터가 설정되어 있으면 업데이트하지 않음
          if (
            state.availableCourses.length === availableCourses.length &&
            state.userTracks.length === userTracks.length &&
            state.graduationInfo !== null &&
            state.graduationInfo.total_required_credits === graduationInfo.total_required_credits
          ) {
            return state;
          }
          return {
            ...state,
            availableCourses,
            userTracks,
            graduationInfo,
          };
        }),

      addCourseToRoadmap: (course, trackId, year, semester) =>
        set((state) => {
          const newCourse: SimulationCourse = {
            course_code: course.course_code,
            course_name: course.course_name,
            credits: course.credit,
            course_type: getCourseTypeInKorean(course.course_type), // 한국어로 변환
            open_grade: course.open_grade,
            open_semester: course.open_semester,
            track_id: trackId,
            year,
            semester,
          };

          return {
            roadmapCourses: [...state.roadmapCourses, newCourse],
            isModified: true,
          };
        }),

      removeCourseFromRoadmap: (courseCode) =>
        set((state) => ({
          roadmapCourses: state.roadmapCourses.filter(
            (course) => course.course_code !== courseCode,
          ),
          isModified: true,
        })),

      changeCourseTrack: (courseCode, newTrackId) =>
        set((state) => {
          // 시뮬레이션으로 추가된 과목인지 확인
          const simulationCourse = state.roadmapCourses.find(
            (course) => course.course_code === courseCode,
          );

          if (simulationCourse) {
            // 시뮬레이션 과목의 트랙 변경
            return {
              roadmapCourses: state.roadmapCourses.map((course) =>
                course.course_code === courseCode ? { ...course, track_id: newTrackId } : course,
              ),
              isModified: true,
            };
          } else {
            // 기존 수강 과목의 트랙 변경 정보 저장
            return {
              changedTracks: {
                ...state.changedTracks,
                [courseCode]: newTrackId,
              },
              isModified: true,
            };
          }
        }),

      resetSimulation: () => set({ roadmapCourses: [], changedTracks: {}, isModified: false }),

      saveSimulation: () => {
        // TODO: 실제 저장 로직 구현
        const state = get();
        console.log("Saving simulation...", {
          roadmapCourses: state.roadmapCourses,
          changedTracks: state.changedTracks,
        });
        set({ isModified: false });
      },

      cancelChanges: () => set({ roadmapCourses: [], changedTracks: {}, isModified: false }),

      setIsModified: (modified) => set({ isModified: modified }),
    }),
    {
      name: "simulation-store",
    },
  ),
);
