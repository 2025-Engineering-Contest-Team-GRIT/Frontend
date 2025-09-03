export enum StudentStatus {
  FRESHMAN = '신입생',
  SOPHOMORE = '재학생',
}

export enum CareerPath {
  MOBILE_SOFTWARE = '모바일소프트웨어',
  WEB_ENGINEERING = '웹공학',
  BIG_DATA = '빅데이터',
  DIGITAL_CONTENTS_VR = '디지털콘텐츠·가상현실',
  NONE = '미정',
}

export enum CourseStatus {
  COMPLETED = '이수 완료',
  ENROLLED = '수강 중',
  RECOMMENDED = 'AI 추천',
  MANDATORY = '전공 필수',
}

export enum CourseCategory {
    FOUNDATION = '전기',
    MANDATORY = '전필',
    ELECTIVE = '전선',
    LIBERAL_ARTS_REQUIRED = '교양필수',
    CORE_LIBERAL_ARTS = '핵심교양',
    LIBERAL_ARTS_ELECTIVE = '일반교양',
}

export enum CompetencyCategory {
    FOUNDATION = '기초역량',
    DEVELOPMENT = '개발역량',
    APPLICATION = '응용/심화역량',
}

export type Track = '모바일소프트웨어 트랙' | '웹공학 트랙' | '빅데이터 트랙' | '디지털콘텐츠·가상현실 트랙' | '트랙 미지정';

export type { CourseStatus as CourseStatusType };

export interface Course {
  id: string;
  name: string;
  credits: number;
  status: CourseStatus;
  category: CourseCategory;
  competency?: CompetencyCategory;
  description?: string;
  syllabusLink?: string;
  professor?: string;
  prerequisites?: string[];
  grade?: string; // e.g., 'A+', 'B0', etc.
  track?: Track;
  year?: number;
  semester?: number;
}

export interface Semester {
  year: number;
  semester: number;
  courses: Course[];
}

export interface Roadmap {
  semesters: Semester[];
}

export interface TimetableSlot {
  day: '월' | '화' | '수' | '목' | '금';
  startTime: string; // "09:00"
  endTime: string; // "11:45"
  courseName: string;
  location: string;
  courseId: string;
}

export interface StudyStyle {
    creditLoad: 'light' | 'normal' | 'heavy';
    preference: 'theory' | 'practice' | 'balanced';
    ratio: 'major' | 'general' | 'balanced';
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

export interface Student {
  id: number;
  name: string;
  studentId: string;
  status: StudentStatus;
  major: string;
  tracks: Track[];
  careerPaths: CareerPath[];
  roadmap: Roadmap;
  completedCredits: number;
  totalCredits: number;
  gpa?: number;
  timetable?: TimetableSlot[];
  isRoadmapConfigured: boolean;
  isTimetableConfigured: boolean;
  studyStyle?: StudyStyle;
  interests?: string[];
  minor?: string;
  academicGoals?: string[];
  profileSharingEnabled?: boolean;
  profileUrlPassword?: string;
  profileVisibility?: 'public' | 'link_only' | 'private';
  consentChoices?: ConsentChoices;
  profileDisplayOptions?: ProfileDisplayOptions;
  favoriteCourseIds?: string[];
}

// A mock database of all courses for a major
export interface AllCourses {
    id: string;
    name: string;
    credits: number;
    category: CourseCategory;
    year?: number;
    semester?: number;
    competency?: CompetencyCategory;
    prerequisites?: string[];
    track?: Track;
}

// Enhanced types for Next.js with calculated fields
export interface StudentWithMetrics extends Student {
  currentYear: number | null;
  currentSemester: number | null;
  gpa: number;
  completedCredits: number;
}
