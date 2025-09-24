export enum StudentStatus {
  FRESHMAN = "신입생",
  SOPHOMORE = "재학생",
}

export enum CareerPath {
  NONE = "미정",
  MOBILE_SOFTWARE = "모바일소프트웨어",
  BIG_DATA = "빅데이터",
  WEB_ENGINEERING = "웹공학",
  DIGITAL_CONTENTS_VR = "디지털콘텐츠·가상현실",
}

export const CareerPathList: CareerPath[] = [
  CareerPath.NONE,
  CareerPath.MOBILE_SOFTWARE,
  CareerPath.BIG_DATA,
  CareerPath.WEB_ENGINEERING,
  CareerPath.DIGITAL_CONTENTS_VR,
];

export enum CourseStatus {
  COMPLETED = "이수 완료",
  ENROLLED = "수강 중",
  RECOMMENDED = "AI 추천",
  MANDATORY = "전공 필수",
}

export enum CourseCategory {
  FOUNDATION = "전기",
  MANDATORY = "전필",
  ELECTIVE = "전선",
  LIBERAL_ARTS_REQUIRED = "교양필수",
  CORE_LIBERAL_ARTS = "핵심교양",
  LIBERAL_ARTS_ELECTIVE = "일반교양",
}

export enum CompetencyCategory {
  FOUNDATION = "기초역량",
  DEVELOPMENT = "개발역량",
  APPLICATION = "응용/심화역량",
}

export type AuthInfo = {
  token: string;
  userId: string;
};

export type Track =
  | "모바일소프트웨어 트랙"
  | "웹공학 트랙"
  | "빅데이터 트랙"
  | "디지털콘텐츠·가상현실 트랙"
  | "트랙 미지정";

export const trackList = [
  "모바일소프트웨어 트랙",
  "웹공학 트랙",
  "빅데이터 트랙",
  "디지털콘텐츠·가상현실 트랙",
  "트랙 미지정",
];

export type { CourseStatus as CourseStatusType };

export interface Semester {
  year: number;
  semester: number;
  totalCredits: number;
  courses: Course[];
}

// API 응답에 맞춘 Course 타입
export interface Course {
  courseId: number; // API는 number로 전달
  courseName: string;
  credits: number;
  status: string; // ex) "COMPLETED", "ENROLLED" 등
  prerequisiteIds?: number[]; // 선수과목 ID 목록
  courseType: string; // ex) "전공기초" 등
  course_description?: string;
  completed_grade?: string;
}

// export interface TimetableSlot {
//   day: "월" | "화" | "수" | "목" | "금";
//   startTime: string; // "09:00"
//   endTime: string; // "11:45"
//   courseName: string;
//   location: string;
//   courseId: string;
// }

export interface StudyStyle {
  creditLoad: "light" | "normal" | "heavy";
  preference: "theory" | "practice" | "balanced";
  ratio: "major" | "general" | "balanced";
}

export interface ConsentChoices {
  profile: boolean;
  courses: boolean;
  timetable: boolean;
}

export interface ProfileDisplayOptions {
  showGrades: boolean;
  showTimetable: boolean;
  showStudentId: boolean;
}

// export interface Student {
//   id: number;
//   name: string;
//   studentId: string;
//   status: StudentStatus;
//   major: string;
//   tracks: Track[];
//   careerPaths: CareerPath[];
//   roadmap: Roadmap;
//   completedCredits: number;
//   totalCredits: number;
//   gpa?: number;
//   timetable?: TimetableSlot[];
//   isRoadmapConfigured: boolean;
//   isTimetableConfigured: boolean;
//   studyStyle?: StudyStyle;
//   interests?: string[];
//   minor?: string;
//   academicGoals?: string[];
//   profileSharingEnabled?: boolean;
//   profileUrlPassword?: string;
//   profileVisibility?: "public" | "link_only" | "private";
//   consentChoices?: ConsentChoices;
//   profileDisplayOptions?: ProfileDisplayOptions;
//   favoriteCourseIds?: string[];
// }

export interface DashboardInfo {
  userInfo: UserInfo;
  academicStatus: AcademicStatus;
  careerGoal: {
    primaryTracks: string;
  };
  nextSemesterCourses: shortCourseInfo[];
  todaySchedule: Schedule[];
}

export interface UserInfo {
  name: string;
  year: number;
  semester: number;
  department: string;
  tracks: string[];
}

export interface AcademicStatus {
  gpa: number;
  gpaMax: number;
  completedCredits: number;
  totalCreditsRequired: number;
}

export interface Schedule {
  courseName: string;
  professorName: string;
  classroom: string;
  day: "월" | "화" | "수" | "목" | "금";
  start: string; // "10:00:00"
  end: string; // "11:00:00"
}

export interface shortCourseInfo {
  courseId: number;
  courseName: string;
}

// // A mock database of all courses for a major
// export interface AllCourses {
//   id: string;
//   name: string;
//   credits: number;
//   category: CourseCategory;
//   year?: number;
//   semester?: number;
//   competency?: CompetencyCategory;
//   prerequisites?: string[];
//   track?: Track;
// }

/*
"result": {
    "totalCompletedCredits": 0,
    "totalRequiredCredits": 0,
    "trackProgressList": [
      {
        "trackName": "string",
        "category": "string",
        "majorBasic": {
          "completedCredits": 0,
          "requiredCredits": 0
        },
        "majorRequired": {
          "completedCredits": 0,
          "requiredCredits": 0
        },
        "majorSubtotal": {
          "completedCredits": 0,
          "requiredCredits": 0
        }
      }
    ],
    "certifications": [
      {
        "certificationName": "string",
        "completed": true
      }
    ]
  },
  */

export interface GraduationInfo {
  total_completed_credits: number;
  total_required_credits: number;
  track_progress_list: TrackProgress[];
  certifications: Certification[];
}
export interface TrackProgress {
  track_name: string;
  category: string;
  major_basic: MajorRequirement;
  major_required: MajorRequirement;
  major_subtotal: MajorRequirement;
}

export interface MajorRequirement {
  completed_credits: number;
  required_credits: number;
}

export interface Certification {
  certification_name: string;
  completed: boolean;
}

/*
{
    "course": {
      "created_at": "2025-09-24 09:52:11",
      "updated_at": "2025-09-24 09:52:11",
      "id": 28,
      "course_name": "AI를 이용한 주식가치평가",
      "course_code": "M020026",
      "credits": 3,
      "open_grade": 1,
      "open_semester": "FIRST"
    },
    "status": "available",
    "course_type": "전공선택",
    "grade": 1,
    "semester": "FIRST",
    "is_favorite": false
  },
*/

export interface CourseListItem {
  course: DetailedCourse;
  status: "completed" | "enrolled" | "available" | "recommended";
  course_type: string; // ex) "전공기초" 등
  grade: number;
  track_id?: number;
  semester: "FIRST" | "SECOND" | "SUMMER";
  is_favorite: boolean;
}

export interface DetailedCourse {
  created_at: string;
  updated_at: string;
  id: number;
  course_name: string;
  course_code: string;
  course_type?: string;
  credits: number;
  description?: string;
  open_grade: number;
  open_semester: "FIRST" | "SECOND" | "SUMMER";
}

/*
"nextSemesterCourses": [
      {
        "courseId": 24,
        "courseName": "모바일 캡스톤디자인"
      },
      {
        "courseId": 33,
        "courseName": "웹프레임워크2"
      },
      {
        "courseId": 35,
        "courseName": "웹공학 캡스톤디자인"
      }
    ],
*/

// // Enhanced types for Next.js with calculated fields
// export interface StudentWithMetrics extends Student {
//   currentYear: number | null;
//   currentSemester: number | null;
//   gpa: number;
//   completedCredits: number;
// }

/*
[
    {
      "planId": 0,
      "planName": "string",
      "createdAt": "2025-09-24T19:19:36.231Z"
    }
  ]
    */
export interface plan {
  plan_id: number;
  plan_name: string;
  created_at: string;
}

/*

{
    "planId": 0,
    "planName": "string",
    "createdAt": "2025-09-24T19:21:08.695Z",
    "selectedCourses": [
      {
        "courseCode": "string",
        "courseName": "string",
        "credits": 0,
        "openGrade": 0,
        "openSemester": "FIRST"
      }
    ]
  }*/

export interface detailedPlan extends plan {
  selected_courses: shortCourse[];
}

export interface shortCourse {
  course_code: string;
  course_name: string;
  credit: number;
  open_grade: number;
  open_semester: "FIRST" | "SECOND" | "SUMMER";
}

export interface extendedShortCourse extends shortCourse {
  course_type: string;
  applicable_track_ids: number[];
}

export interface planBasicInfo {
  crawling_data: GraduationInfo;
  available_courses: extendedShortCourse[];
  user_tracks: shortTrackInfo[];
}

export interface shortTrackInfo {
  track_id: number;
  track_name: string;
}

/*
{
    "user_tracks": [
      {
        "track_id": 1,
        "track_name": "모바일소프트웨어트랙"
      },
      {
        "track_id": 2,
        "track_name": "웹공학트랙"
      }
    ]
  }
*/
