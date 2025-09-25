"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth, useSimulation } from "@/hooks/useStore";
import { usePlanBasicInfo, useCourses } from "@/hooks/useData";
import type { extendedShortCourse, CourseListItem, shortTrackInfo, TrackProgress } from "@/types";
import { Card } from "../common";
import { Button } from "../Button";
import { Toast } from "../Toast";
import { ProgressBar } from "../ProgressBar";

// 시뮬레이션용 과목 타입
interface SimulationCourse {
  course_code: string;
  course_name: string;
  credits: number;
  course_type: string;
  open_grade: number;
  open_semester: "FIRST" | "SECOND" | "SUMMER";
  track_id?: number;
  year: number;
  semester: number;
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

// 과목 타입별 색상 스타일 함수
const getCourseTypeStyle = (courseType: string) => {
  const koreanType = getCourseTypeInKorean(courseType);

  switch (koreanType) {
    case "전공필수":
      return {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
        progressBg: "bg-purple-200",
      };
    case "전공선택":
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
        progressBg: "bg-blue-200",
      };
    case "전공기초":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
        progressBg: "bg-green-200",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        badge: "bg-gray-100 text-gray-700",
        progressBg: "bg-gray-200",
      };
  }
};

// 과목 추가 모달
const AddCourseModal: React.FC<{
  open: boolean;
  onClose: () => void;
  course: extendedShortCourse | null;
  userTracks: shortTrackInfo[];
  onAdd: (trackId: number, year: number, semester: number) => void;
}> = ({ open, onClose, course, userTracks, onAdd }) => {
  const [selectedTrackId, setSelectedTrackId] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  useEffect(() => {
    if (course && course.applicable_track_ids.length > 0) {
      setSelectedTrackId(course.applicable_track_ids[0]);
    }
    if (course) {
      setSelectedYear(course.open_grade);
      setSelectedSemester(course.open_semester === "FIRST" ? 1 : 2);
    }

    // ESC 키로 모달 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [course, open, onClose]);

  if (!open || !course) return null;

  const availableTracks = userTracks.filter((track) =>
    course.applicable_track_ids.includes(track.track_id),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-2xl flex flex-col gap-8 animate-fade-up border-2 border-white/50">
        <div className="text-center">
          <h4 className="font-bold text-2xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {course.course_name}
          </h4>
          <p className="text-slate-600 text-base">과목을 수강 계획에 추가합니다</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* 트랙 선택 */}
        {availableTracks.length > 1 && (
          <div>
            <label className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              트랙 선택
            </label>
            <div className="grid grid-cols-1 gap-3">
              {availableTracks.map((track) => (
                <button
                  key={track.track_id}
                  onClick={() => setSelectedTrackId(track.track_id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedTrackId(track.track_id);
                    }
                  }}
                  className={`group p-4 rounded-xl border-2 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-300/50 ${
                    selectedTrackId === track.track_id
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-lg scale-105"
                      : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:scale-102"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        selectedTrackId === track.track_id
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300"
                      }`}
                    >
                      {selectedTrackId === track.track_id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-semibold">{track.track_name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 학년 선택 */}
        <div>
          <label className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            학년 선택
            <span className="text-blue-600 font-normal ml-2 text-sm bg-blue-100 px-2 py-1 rounded-lg">
              권장: {course.open_grade}학년
            </span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedYear(year);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-green-300/50 ${
                  selectedYear === year
                    ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-lg scale-105"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:scale-102"
                } ${year === course.open_grade ? "ring-2 ring-blue-200 ring-opacity-50" : ""}`}
              >
                {year}학년
              </button>
            ))}
          </div>
        </div>

        {/* 학기 선택 */}
        <div>
          <label className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            학기 선택
            <span className="text-red-600 font-normal ml-2 text-sm bg-red-100 px-2 py-1 rounded-lg">
              필수: {course.open_semester === "FIRST" ? "1학기" : "2학기"}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 1, label: "1학기" },
              { value: 2, label: "2학기" },
            ].map((sem) => (
              <button
                key={sem.value}
                disabled={true} // 학기는 변경 불가
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-sm font-bold cursor-not-allowed ${
                  selectedSemester === sem.value
                    ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-lg"
                    : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {sem.label}
                {selectedSemester === sem.value && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center bg-slate-100 py-2 rounded-lg">
            ⚠️ 학기는 과목 특성상 변경할 수 없습니다
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => onAdd(selectedTrackId, selectedYear, selectedSemester)}
            variant="primary"
            className="flex-1 py-4 text-base font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              추가하기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </span>
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 py-4 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

// 트랙 변경 모달
const ChangeTrackModal: React.FC<{
  open: boolean;
  onClose: () => void;
  course: SimulationCourse | null;
  userTracks: shortTrackInfo[];
  availableCourses: extendedShortCourse[];
  isExistingCourse: boolean; // 기존 수강 과목 여부
  onChangeTrack: (newTrackId: number) => void;
}> = ({ open, onClose, course, userTracks, availableCourses, isExistingCourse, onChangeTrack }) => {
  const [selectedTrackId, setSelectedTrackId] = useState<number>(0);

  useEffect(() => {
    if (course && course.track_id) {
      setSelectedTrackId(course.track_id);
    }

    // ESC 키로 모달 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [course, open, onClose]);

  if (!open || !course) return null;

  // 트랙 선택 가능 여부에 따른 로직
  let availableTracks: shortTrackInfo[] = [];

  if (isExistingCourse) {
    // 기존 수강 과목의 경우
    if (course.course_type.includes("전공필수")) {
      // 전공필수: 현재 트랙만 선택 가능
      availableTracks = userTracks.filter((track) => track.track_id === course.track_id);
      console.log("전공필수 기존 과목 - 현재 트랙만:", availableTracks);
    } else {
      // 전공필수가 아님: 모든 사용자 트랙 선택 가능
      availableTracks = userTracks;
      console.log("일반 기존 과목 - 모든 트랙:", availableTracks);
    }
  } else {
    // 시뮬레이션으로 추가된 과목의 경우 (기존 로직 유지)
    const availableCourse = availableCourses.find((c) => c.course_code === course.course_code);
    availableTracks = availableCourse
      ? userTracks.filter((track) => availableCourse.applicable_track_ids.includes(track.track_id))
      : [];
    console.log("시뮬레이션 추가 과목 - 적용 가능한 트랙:", availableTracks);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          <h4 className="font-bold text-slate-800 text-xl mb-2">{course.course_name}</h4>
          <p className="text-slate-600 text-sm">
            {isExistingCourse
              ? "기존 수강 과목의 트랙을 변경합니다"
              : "추가된 과목의 트랙을 변경합니다"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            트랙 선택
            {isExistingCourse && course.course_type.includes("전공필수") && (
              <span className="text-red-500 text-xs ml-2 block mt-1">
                ⚠️ 전공필수 과목은 현재 트랙만 선택 가능합니다
              </span>
            )}
          </label>

          <div className="grid grid-cols-1 gap-3">
            {availableTracks.map((track) => {
              const isSelected = selectedTrackId === track.track_id;
              const isDisabled =
                isExistingCourse &&
                course.course_type.includes("전공필수") &&
                availableTracks.length === 1;
              const isCurrent = track.track_id === course.track_id;

              return (
                <button
                  key={track.track_id}
                  onClick={() => !isDisabled && setSelectedTrackId(track.track_id)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                      e.preventDefault();
                      setSelectedTrackId(track.track_id);
                    }
                  }}
                  disabled={isDisabled}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  } ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${
                    isCurrent && !isSelected
                      ? "ring-2 ring-orange-200 ring-opacity-50 border-orange-300"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="font-medium">{track.track_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCurrent && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          현재
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          선택됨
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {availableTracks.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>선택 가능한 트랙이 없습니다</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => onChangeTrack(selectedTrackId)}
            variant="primary"
            className="flex-1 py-3 text-base font-medium"
            disabled={
              (isExistingCourse &&
                course.course_type.includes("전공필수") &&
                availableTracks.length === 1 &&
                selectedTrackId === course.track_id) ||
              availableTracks.length === 0
            }
          >
            {isExistingCourse &&
            course.course_type.includes("전공필수") &&
            availableTracks.length === 1 &&
            selectedTrackId === course.track_id
              ? "변경사항 없음"
              : "변경하기"}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 py-3 text-base font-medium"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

// 메인 시뮬레이션 뷰
export const SimulationView: React.FC = () => {
  const { authInfo } = useAuth();
  const simulation = useSimulation();
  const {
    data: planBasicInfo,
    isLoading: loadingBasicInfo,
    error: basicInfoError,
  } = usePlanBasicInfo(authInfo);
  const {
    data: coursesData,
    isLoading: loadingCourses,
    error: coursesError,
  } = useCourses(authInfo);

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [changeTrackModalOpen, setChangeTrackModalOpen] = useState(false);
  const [selectedCourseForAdd, setSelectedCourseForAdd] = useState<extendedShortCourse | null>(
    null,
  );
  const [selectedCourseForTrackChange, setSelectedCourseForTrackChange] =
    useState<SimulationCourse | null>(null);
  const [isSelectedCourseExisting, setIsSelectedCourseExisting] = useState<boolean>(false);

  // 초기화 추적을 위한 ref
  const isInitializedRef = useRef(false);

  // 기본 데이터 로딩 후 store에 설정
  useEffect(() => {
    if (planBasicInfo && !loadingBasicInfo && !isInitializedRef.current) {
      simulation.setBasicData(
        planBasicInfo.available_courses,
        planBasicInfo.user_tracks,
        planBasicInfo.crawling_data,
      );
      isInitializedRef.current = true;
    }

    // Cleanup: 컴포넌트 언마운트 시 초기화 상태 리셋
    return () => {
      isInitializedRef.current = false;
    };
  }, [planBasicInfo, loadingBasicInfo, simulation.setBasicData]);

  // 이미 수강한 과목들 (completed, enrolled) 추출
  const completedEnrolledCourses = useMemo(() => {
    if (!coursesData) {
      console.log("coursesData가 없음");
      return [];
    }

    console.log("coursesData 전체:", coursesData);

    // API 응답 구조가 다를 수 있으므로 여러 형태를 시도
    let courseList: CourseListItem[] = [];

    if (coursesData.data && Array.isArray(coursesData.data)) {
      courseList = coursesData.data;
    } else if (coursesData.result && Array.isArray(coursesData.result)) {
      courseList = coursesData.result;
    } else if (Array.isArray(coursesData)) {
      courseList = coursesData;
    } else {
      console.warn("예상하지 못한 API 응답 구조:", coursesData);
      return [];
    }

    const filtered = courseList.filter(
      (item: CourseListItem) => item.status === "completed" || item.status === "enrolled",
    );
    console.log("필터링된 수강 과목들:", filtered);
    return filtered;
  }, [coursesData]);

  // 로드맵에 표시할 과목들 (학년-학기별로 그룹핑)
  const roadmapByYearSemester = useMemo(() => {
    const grouped: Record<string, SimulationCourse[]> = {};

    // 기존 수강과목들 추가 (completed, enrolled)
    completedEnrolledCourses.forEach((item: CourseListItem) => {
      console.log("수강과목 처리 중:", item);

      // grade가 숫자가 아닐 수 있으므로 안전하게 처리
      const grade = typeof item.grade === "number" ? item.grade : parseInt(String(item.grade));
      const semesterNumber = item.semester === "FIRST" ? 1 : item.semester === "SECOND" ? 2 : 1;

      if (isNaN(grade) || grade < 1 || grade > 4) {
        console.warn("잘못된 학년 정보:", item.grade, item);
        return; // 잘못된 데이터는 건너뜀
      }

      const key = `${grade}-${semesterNumber}`;
      if (!grouped[key]) grouped[key] = [];

      grouped[key].push({
        course_code: item.course.course_code,
        course_name: item.course.course_name,
        credits: item.course.credits,
        course_type: item.course_type,
        open_grade: item.course.open_grade,
        open_semester: item.course.open_semester,
        track_id: simulation.changedTracks[item.course.course_code] || item.track_id, // 변경된 트랙이 있으면 사용
        year: grade,
        semester: semesterNumber,
      });
    });

    // 시뮬레이션으로 추가된 과목들 추가
    simulation.roadmapCourses.forEach((course) => {
      const key = `${course.year}-${course.semester}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(course);
    });

    console.log("최종 로드맵 그룹:", grouped);
    return grouped;
  }, [completedEnrolledCourses, simulation.roadmapCourses]);

  // 과목 추가 핸들러
  const handleAddCourse = (course: extendedShortCourse) => {
    setSelectedCourseForAdd(course);
    setAddModalOpen(true);
  };

  const handleConfirmAddCourse = (trackId: number, year: number, semester: number) => {
    if (selectedCourseForAdd) {
      simulation.addCourseToRoadmap(selectedCourseForAdd, trackId, year, semester);
      setToast({
        message: `${selectedCourseForAdd.course_name}이(가) 로드맵에 추가되었습니다.`,
        type: "success",
      });
      setAddModalOpen(false);
      setSelectedCourseForAdd(null);
    }
  };

  // 과목 제거 핸들러
  const handleRemoveCourse = (courseCode: string, courseName: string) => {
    simulation.removeCourseFromRoadmap(courseCode);
    setToast({ message: `${courseName}이(가) 로드맵에서 제거되었습니다.`, type: "info" });
  };

  // 트랙 변경 핸들러
  const handleChangeTrack = (course: SimulationCourse) => {
    // 시뮬레이션으로 추가된 과목인지 확인
    const isFromSimulation = simulation.roadmapCourses.some(
      (sc) => sc.course_code === course.course_code,
    );

    // 전공필수이면서 기존 수강 과목인 경우에만 트랙 변경 불가 메시지 표시
    // (시뮬레이션 과목이거나 전공필수가 아닌 경우는 모달 표시)
    if (course.course_type.includes("전공필수") && !isFromSimulation) {
      // 기존 수강 과목 중 전공필수는 현재 트랙만 선택 가능 (실질적으로 변경 불가하지만 모달은 표시)
    }

    setSelectedCourseForTrackChange(course);
    setIsSelectedCourseExisting(!isFromSimulation); // 기존 수강 과목 여부 설정
    setChangeTrackModalOpen(true);
  };

  const handleConfirmChangeTrack = (newTrackId: number) => {
    if (selectedCourseForTrackChange) {
      simulation.changeCourseTrack(selectedCourseForTrackChange.course_code, newTrackId);
      const trackName =
        simulation.userTracks.find((t) => t.track_id === newTrackId)?.track_name || "알 수 없음";
      setToast({
        message: `${selectedCourseForTrackChange.course_name}의 트랙이 ${trackName}으로 변경되었습니다.`,
        type: "success",
      });
      setChangeTrackModalOpen(false);
      setSelectedCourseForTrackChange(null);
    }
  };

  // 졸업요건 진행률 계산
  const graduationProgress = useMemo(() => {
    if (!simulation.graduationInfo) return null;

    // 시뮬레이션된 과목들의 학점 계산
    const simulationCredits = simulation.roadmapCourses.reduce(
      (acc, course) => acc + course.credits,
      0,
    );
    const completedCredits = completedEnrolledCourses.reduce(
      (acc: number, course: CourseListItem) => acc + course.course.credits,
      0,
    );
    const totalSimulatedCredits = completedCredits + simulationCredits;

    // 트랙별 진행률을 시뮬레이션 과목 포함해서 다시 계산
    const updatedTrackProgress = simulation.graduationInfo.track_progress_list.map((track) => {
      // 트랙 이름으로 해당하는 트랙 ID 찾기
      const matchingUserTrack = simulation.userTracks.find(
        (userTrack) => userTrack.track_name === track.track_name,
      );
      const trackId = matchingUserTrack?.track_id;

      console.log(`[${track.track_name}] 트랙 계산 시작:`, { trackId, track });

      if (!trackId) {
        // 트랙 ID를 찾을 수 없으면 원본 반환
        console.log(`[${track.track_name}] 트랙 ID를 찾을 수 없음`);
        return track;
      }

      // 해당 트랙의 기존 수강 과목들
      const trackCompletedCourses = completedEnrolledCourses.filter(
        (course) => course.track_id === trackId,
      );

      // 해당 트랙의 시뮬레이션 추가 과목들
      const trackSimulationCourses = simulation.roadmapCourses.filter(
        (course) => course.track_id === trackId,
      );

      // 기존 수강 과목 중 트랙이 변경된 과목들 처리
      const changedTrackCourses = completedEnrolledCourses.filter(
        (course) => simulation.changedTracks[course.course.course_code] === trackId,
      );

      console.log(`[${track.track_name}] 과목 분석:`, {
        trackCompletedCourses: trackCompletedCourses.length,
        trackSimulationCourses: trackSimulationCourses.length,
        changedTrackCourses: changedTrackCourses.length,
      });

      // 전공기초, 전공필수, 전공선택 학점 계산
      let majorBasicCredits = track.major_basic.completed_credits;
      let majorRequiredCredits = track.major_required.completed_credits;
      let majorElectiveCredits = 0; // 전공선택은 major_subtotal에서 계산해야 함

      // 현재 전공소계에서 전공기초와 전공필수를 빼면 전공선택 학점이 됨
      const currentMajorElectiveCredits = Math.max(
        0,
        track.major_subtotal.completed_credits -
          track.major_basic.completed_credits -
          track.major_required.completed_credits,
      );
      majorElectiveCredits = currentMajorElectiveCredits;

      console.log(`[${track.track_name}] 초기 학점:`, {
        majorBasicCredits,
        majorRequiredCredits,
        majorElectiveCredits,
        majorSubtotalCredits: track.major_subtotal.completed_credits,
      });

      // 기존 수강 과목에서 다른 트랙으로 변경된 과목들 제외
      trackCompletedCourses.forEach((course) => {
        if (
          simulation.changedTracks[course.course.course_code] &&
          simulation.changedTracks[course.course.course_code] !== trackId
        ) {
          console.log(
            `[${track.track_name}] 다른 트랙으로 변경된 과목 제외:`,
            course.course.course_name,
          );
          if (course.course_type.includes("전공기초")) {
            majorBasicCredits -= course.course.credits;
          } else if (course.course_type.includes("전공필수")) {
            majorRequiredCredits -= course.course.credits;
          } else if (course.course_type.includes("전공선택")) {
            majorElectiveCredits -= course.course.credits;
          }
        }
      });

      // 트랙이 변경된 기존 수강 과목들 추가
      changedTrackCourses.forEach((course) => {
        console.log(`[${track.track_name}] 트랙 변경으로 추가된 과목:`, course.course.course_name);
        if (course.course_type.includes("전공기초")) {
          majorBasicCredits += course.course.credits;
        } else if (course.course_type.includes("전공필수")) {
          majorRequiredCredits += course.course.credits;
        } else if (course.course_type.includes("전공선택")) {
          majorElectiveCredits += course.course.credits;
        }
      });

      // 시뮬레이션 추가 과목들 추가
      trackSimulationCourses.forEach((course) => {
        console.log(`[${track.track_name}] 시뮬레이션 추가된 과목:`, course.course_name);
        if (course.course_type.includes("전공기초")) {
          majorBasicCredits += course.credits;
        } else if (course.course_type.includes("전공필수")) {
          majorRequiredCredits += course.credits;
        } else if (course.course_type.includes("전공선택")) {
          majorElectiveCredits += course.credits;
        }
      });

      // 전공소계 = 전공기초 + 전공필수 + 전공선택
      const majorSubtotalCredits = majorBasicCredits + majorRequiredCredits + majorElectiveCredits;

      const result = {
        ...track,
        major_basic: {
          ...track.major_basic,
          completed_credits: Math.max(0, majorBasicCredits),
        },
        major_required: {
          ...track.major_required,
          completed_credits: Math.max(0, majorRequiredCredits),
        },
        major_subtotal: {
          ...track.major_subtotal,
          completed_credits: Math.max(0, majorSubtotalCredits),
        },
      };

      console.log(`[${track.track_name}] 최종 학점:`, {
        majorBasicCredits: result.major_basic.completed_credits,
        majorRequiredCredits: result.major_required.completed_credits,
        majorSubtotalCredits: result.major_subtotal.completed_credits,
        계산된전공선택: majorElectiveCredits,
      });

      return result;
    });

    return {
      totalCompleted: completedCredits,
      totalSimulated: totalSimulatedCredits,
      totalRequired: simulation.graduationInfo.total_required_credits,
      trackProgress: updatedTrackProgress,
    };
  }, [
    simulation.graduationInfo,
    simulation.roadmapCourses,
    simulation.changedTracks,
    completedEnrolledCourses,
  ]);

  if (loadingBasicInfo || loadingCourses) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-4 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="text-lg text-gray-700 font-medium">
            시뮬레이션 데이터를 불러오는 중...
          </span>
          {loadingBasicInfo && (
            <div className="text-sm text-gray-500 mt-2">기본 정보 로딩 중...</div>
          )}
          {loadingCourses && (
            <div className="text-sm text-gray-500 mt-2">수강 과목 정보 로딩 중...</div>
          )}
        </div>
      </div>
    );
  }

  // 에러 처리
  if (basicInfoError || coursesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            데이터를 불러오는 중 오류가 발생했습니다
          </div>
          {basicInfoError && (
            <div className="text-sm text-gray-600 mb-1">
              기본 정보 오류: {String(basicInfoError)}
            </div>
          )}
          {coursesError && (
            <div className="text-sm text-gray-600 mb-1">수강 과목 오류: {String(coursesError)}</div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 opacity-15 rounded-full blur-3xl animate-blob1" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-300 opacity-15 rounded-full blur-3xl animate-blob2" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300 opacity-10 rounded-full blur-3xl animate-float" />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* 헤더 */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 animate-fade-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse-glow">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                졸업 시뮬레이션
              </h1>

              {/* 색상 범례 */}
              <div
                className="hidden md:flex items-center gap-4 text-xs animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-700 font-medium">전공필수</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-700 font-medium">전공선택</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">전공기초</span>
                </div>
              </div>
            </div>

            {simulation.isModified && (
              <div className="text-sm text-amber-600 font-medium flex items-center gap-2 animate-fade-in">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                변경사항이 있습니다
              </div>
            )}
          </div>
        </div>

        {/* 로드맵 영역 */}
        <div className="flex-1 overflow-auto p-6 animate-fade-in">
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 mb-2">
                학년별 수강 계획
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((year) => (
                <div
                  key={year}
                  className="space-y-4 animate-fade-up"
                  style={{ animationDelay: `${year * 0.1}s` }}
                >
                  <div className="text-center">
                    <h3 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {year}학년
                    </h3>
                    <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-8 animate-pulse"></div>
                  </div>
                  {[1, 2].map((semester) => {
                    const key = `${year}-${semester}`;
                    const courses = roadmapByYearSemester[key] || [];
                    return (
                      <Card
                        key={semester}
                        className="p-5 bg-white/80 backdrop-blur-md border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 group"
                      >
                        <h4 className="font-bold text-slate-700 mb-4 text-center bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl py-3 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                          <span className="text-lg">{semester}학기</span>
                          <span className="ml-2 text-sm text-slate-600 bg-white px-2 py-1 rounded-lg">
                            {courses.reduce((sum, c) => sum + c.credits, 0)}학점
                          </span>
                        </h4>
                        <div className="space-y-3">
                          {courses.map((course) => {
                            const isFromSimulation = simulation.roadmapCourses.some(
                              (sc) => sc.course_code === course.course_code,
                            );
                            const trackName =
                              simulation.userTracks.find((t) => t.track_id === course.track_id)
                                ?.track_name || "";
                            const courseTypeStyle = getCourseTypeStyle(course.course_type);
                            const koreanType = getCourseTypeInKorean(course.course_type);

                            return (
                              <div
                                key={course.course_code}
                                className={`p-4 rounded-xl border-2 text-sm transition-all duration-300 hover:scale-[1.02] ${
                                  isFromSimulation
                                    ? `${courseTypeStyle.bg} ${courseTypeStyle.border} shadow-md hover:shadow-lg`
                                    : `bg-white border-slate-200 hover:${courseTypeStyle.bg} hover:${courseTypeStyle.border} hover:shadow-md`
                                }`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="font-semibold text-slate-800 truncate flex-1 text-base">
                                    {course.course_name}
                                  </div>
                                  <div
                                    className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${courseTypeStyle.badge} whitespace-nowrap`}
                                  >
                                    {koreanType}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-600 mb-3 flex items-center gap-2">
                                  <span className="font-bold text-sm text-indigo-600">
                                    {course.credits}학점
                                  </span>
                                  {trackName && (
                                    <>
                                      <span className="text-slate-400">•</span>
                                      <span className="bg-slate-100 px-2 py-1 rounded-lg">
                                        {trackName}
                                      </span>
                                    </>
                                  )}
                                  {isFromSimulation && (
                                    <>
                                      <span className="text-slate-400">•</span>
                                      <span className="text-blue-600 font-bold bg-blue-100 px-2 py-1 rounded-lg">
                                        시뮬레이션
                                      </span>
                                    </>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {/* 트랙 변경: 전공필수가 아닌 모든 과목에 대해 허용 */}
                                  {!koreanType.includes("전공필수") && (
                                    <button
                                      onClick={() => handleChangeTrack(course)}
                                      className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 hover:scale-105 transition-all duration-200 font-medium"
                                    >
                                      트랙변경
                                    </button>
                                  )}
                                  {/* 제거: 시뮬레이션으로 추가된 과목만 제거 가능 */}
                                  {isFromSimulation && (
                                    <button
                                      onClick={() =>
                                        handleRemoveCourse(course.course_code, course.course_name)
                                      }
                                      className="px-3 py-1.5 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:scale-105 transition-all duration-200 font-medium"
                                    >
                                      제거
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* 수강 가능 과목 목록 */}
          <div className="animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-0.5 bg-gradient-to-r from-transparent to-blue-400 flex-1 rounded-full"></div>
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500">
                  수강 가능한 과목
                </h2>
                <p className="text-slate-500 text-sm mt-1">클릭하여 로드맵에 추가하세요</p>
              </div>
              <div className="h-0.5 bg-gradient-to-l from-transparent to-purple-400 flex-1 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {simulation.availableCourses
                .filter(
                  (course) =>
                    !simulation.roadmapCourses.some((sc) => sc.course_code === course.course_code),
                )
                .filter(
                  (course) =>
                    !completedEnrolledCourses.some(
                      (cc: CourseListItem) => cc.course.course_code === course.course_code,
                    ),
                )
                .map((course, index) => {
                  const courseTypeStyle = getCourseTypeStyle(course.course_type);
                  const koreanType = getCourseTypeInKorean(course.course_type);

                  return (
                    <div
                      key={course.course_code}
                      className={`p-5 cursor-pointer hover:shadow-2xl transition-all duration-300 rounded-2xl border-2 ${courseTypeStyle.border} ${courseTypeStyle.bg} hover:scale-105 group animate-fade-up`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleAddCourse(course)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="font-bold text-slate-800 truncate flex-1 text-base leading-tight">
                          {course.course_name}
                        </div>
                        <div
                          className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${courseTypeStyle.badge} whitespace-nowrap`}
                        >
                          {koreanType}
                        </div>
                      </div>
                      <div className="text-sm text-slate-700 mb-3">
                        <span className="font-bold text-xl text-indigo-600">
                          {course.credit}학점
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mb-4 flex items-center gap-2">
                        <span className="font-medium bg-slate-100 px-2 py-1 rounded-lg">
                          {course.open_grade}학년
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-lg">
                          {course.open_semester === "FIRST" ? "1학기" : "2학기"}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 font-bold flex items-center gap-2 group-hover:text-blue-700 transition-colors">
                        <svg
                          className="w-4 h-4 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        클릭하여 추가
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* 사이드바 - 졸업요건 및 버튼 */}
      <div className="w-80 bg-white/90 backdrop-blur-lg border-l border-slate-200/50 flex flex-col text-gray-500 relative z-10">
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <h3 className="font-bold text-slate-800 text-lg">졸업요건 진행률</h3>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          {graduationProgress && (
            <div className="space-y-6 animate-fade-up">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-slate-700">총 이수 학점</span>
                  <span className="text-indigo-700 font-bold">
                    {graduationProgress.totalSimulated}/{graduationProgress.totalRequired}
                  </span>
                </div>
                <ProgressBar
                  value={graduationProgress.totalSimulated}
                  max={graduationProgress.totalRequired}
                  className="h-3 bg-indigo-200 rounded-full overflow-hidden"
                />
                <div className="text-xs text-slate-600 mt-2 text-center">
                  {Math.round(
                    (graduationProgress.totalSimulated / graduationProgress.totalRequired) * 100,
                  )}
                  % 완료
                </div>
              </div>
              {graduationProgress.trackProgress.map((track: TrackProgress, index) => (
                <div
                  key={track.track_name}
                  className="p-5 bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h4 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                    {track.track_name}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-green-700 flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          전공기초
                        </span>
                        <span className="font-bold text-green-800 bg-green-100 px-2 py-1 rounded-lg">
                          {track.major_basic.completed_credits}/{track.major_basic.required_credits}
                        </span>
                      </div>
                      <ProgressBar
                        value={track.major_basic.completed_credits}
                        max={track.major_basic.required_credits}
                        className="h-2 bg-green-200 rounded-full overflow-hidden"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-purple-700 flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          전공필수
                        </span>
                        <span className="font-bold text-purple-800 bg-purple-100 px-2 py-1 rounded-lg">
                          {track.major_required.completed_credits}/
                          {track.major_required.required_credits}
                        </span>
                      </div>
                      <ProgressBar
                        value={track.major_required.completed_credits}
                        max={track.major_required.required_credits}
                        className="h-2 bg-purple-200 rounded-full overflow-hidden"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-blue-700 flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          전공선택
                        </span>
                        <span className="font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded-lg">
                          {Math.max(
                            0,
                            track.major_subtotal.completed_credits -
                              track.major_basic.completed_credits -
                              track.major_required.completed_credits,
                          )}
                          /
                          {Math.max(
                            0,
                            track.major_subtotal.required_credits -
                              track.major_basic.required_credits -
                              track.major_required.required_credits,
                          )}
                        </span>
                      </div>
                      <ProgressBar
                        value={Math.max(
                          0,
                          track.major_subtotal.completed_credits -
                            track.major_basic.completed_credits -
                            track.major_required.completed_credits,
                        )}
                        max={Math.max(
                          0,
                          track.major_subtotal.required_credits -
                            track.major_basic.required_credits -
                            track.major_required.required_credits,
                        )}
                        className="h-2 bg-blue-200 rounded-full overflow-hidden"
                      />
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-bold text-indigo-700 flex items-center gap-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          전공소계
                        </span>
                        <span className="font-bold text-indigo-800 bg-indigo-100 px-2 py-1 rounded-lg">
                          {track.major_subtotal.completed_credits}/
                          {track.major_subtotal.required_credits}
                        </span>
                      </div>
                      <ProgressBar
                        value={track.major_subtotal.completed_credits}
                        max={track.major_subtotal.required_credits}
                        className="h-3 bg-indigo-200 rounded-full overflow-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden p-6 space-y-3 mt-auto">
          <Button
            onClick={simulation.resetSimulation}
            variant="secondary"
            className="w-full py-3 rounded-xl hover:scale-105 transition-all duration-300"
            disabled={!simulation.isModified}
          >
            초기화
          </Button>
          <Button
            onClick={simulation.saveSimulation}
            variant="primary"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300"
            disabled={!simulation.isModified}
          >
            저장
          </Button>
          <Button
            onClick={simulation.cancelChanges}
            variant="outline"
            className="w-full py-3 rounded-xl hover:scale-105 transition-all duration-300"
            disabled={!simulation.isModified}
          >
            취소
          </Button>
        </div>
      </div>

      {/* 모달들 */}
      <AddCourseModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        course={selectedCourseForAdd}
        userTracks={simulation.userTracks}
        onAdd={handleConfirmAddCourse}
      />

      <ChangeTrackModal
        open={changeTrackModalOpen}
        onClose={() => setChangeTrackModalOpen(false)}
        course={selectedCourseForTrackChange}
        userTracks={simulation.userTracks}
        availableCourses={simulation.availableCourses}
        isExistingCourse={isSelectedCourseExisting}
        onChangeTrack={handleConfirmChangeTrack}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
