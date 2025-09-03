import type { AllCourses, Roadmap, Student, Track } from '@/types';
import {
  CareerPath,
  CompetencyCategory,
  CourseCategory,
  CourseStatus,
  StudentStatus,
} from '@/types';
import { rawCourseData } from './courseData';

const categoryMap: Record<string, CourseCategory> = {
  전기: CourseCategory.FOUNDATION,
  전필: CourseCategory.MANDATORY,
  전선: CourseCategory.ELECTIVE,
};

const competencyMap: Record<string, CompetencyCategory> = {
  "1": CompetencyCategory.FOUNDATION,
  "2": CompetencyCategory.FOUNDATION,
  "3": CompetencyCategory.DEVELOPMENT,
  "4": CompetencyCategory.APPLICATION,
};

const prerequisites: Record<string, string[]> = {
  CTE0002: ["CTE0001"],
  V020004: ["CTE0001"],
  V020001: ["CTE0001"],
  V020002: ["CTE0001"],
  V020007: ["V020001"],
  V020010: ["V020002"],
  V020012: ["V020002"],
  V020014: ["V020003"],
  V020017: ["V020008"],
  V021004: ["V020001"],
  V021006: ["V021004"],
  V021005: ["V020001"],
  V024003: ["CTE0002"],
  V024004: ["V024003"],
  V024005: ["V024003"],
  V024006: ["V024005"],
  V022003: ["V020012"],
  V022005: ["V022006"],
  V023004: ["V020001"],
  V023005: ["V020015"],
  V023009: ["V020001"],
};

const majorCourses: AllCourses[] = rawCourseData.map((course) => ({
  ...course,
  category: categoryMap[course.category] || CourseCategory.ELECTIVE,
  competency:
    competencyMap[String(course.year)] || CompetencyCategory.FOUNDATION,
  prerequisites: prerequisites[course.id] || [],
  semester: typeof course.semester === "string" ? parseInt(course.semester, 10) : course.semester,
}));

const liberalArtsCourses: AllCourses[] = [
  {
    id: "L101",
    name: "사고와 표현",
    credits: 3,
    category: CourseCategory.LIBERAL_ARTS_REQUIRED,
  },
  {
    id: "REQ0311",
    name: "영어커뮤니케이션 독해/작문",
    credits: 2,
    category: CourseCategory.LIBERAL_ARTS_REQUIRED
  },
  {
    id: "L102",
    name: "글로벌 의사소통",
    credits: 3,
    category: CourseCategory.LIBERAL_ARTS_REQUIRED,
  },
  {
    id: "G101",
    name: "미적분학 1",
    credits: 3,
    category: CourseCategory.LIBERAL_ARTS_REQUIRED,
  },
  {
    id: "L201",
    name: "미래융합기술과사회",
    credits: 2,
    category: CourseCategory.CORE_LIBERAL_ARTS,
  },
  {
    id: "L202",
    name: "현대사회와 법",
    credits: 3,
    category: CourseCategory.CORE_LIBERAL_ARTS,
  },
  {
    id: "L301",
    name: "생활속의 경제",
    credits: 3,
    category: CourseCategory.LIBERAL_ARTS_ELECTIVE,
  },
  {
    id: "L302",
    name: "심리학의 이해",
    credits: 3,
    category: CourseCategory.LIBERAL_ARTS_ELECTIVE,
  },
];

export const allCourses: AllCourses[] = [
  ...majorCourses,
  ...liberalArtsCourses,
];

const findCourse = (
  id: string,
  track?: Track,
  year?: number,
  semester?: number,
): AllCourses | undefined => {
  return allCourses.find( 
    (c) =>
      c.id === id &&
      (track ? c.track === track : true) &&
      (year ? c.year === year : true) &&
      (semester ? c.semester === semester : true),
  );
};

const freshmanRoadmap: Roadmap = {
  semesters: [
    {
      year: 1,
      semester: 1,
      courses: [
        {
          ...findCourse("CTE0001", "모바일소프트웨어 트랙", 1, 1)!,
          status: CourseStatus.MANDATORY,
          description: "프로그래밍의 기초를 다지는 C언어 학습",
        },
        { ...findCourse("L101")!, status: CourseStatus.MANDATORY },
        { ...findCourse("G101")!, status: CourseStatus.MANDATORY },
      ],
    },
    {
      year: 1,
      semester: 2,
      courses: [
        {
          ...findCourse("CTE0002", "웹공학 트랙", 1, 2)!,
          status: CourseStatus.RECOMMENDED,
          description: "HTML, CSS, JavaScript를 사용한 웹 개발 입문",
        },
        {
          ...findCourse("V020004", "모바일소프트웨어 트랙", 1, 2)!,
          status: CourseStatus.RECOMMENDED,
          description: "다양한 프로그래밍 실습을 통한 역량 강화",
        },
        { ...findCourse("L102")!, status: CourseStatus.RECOMMENDED },
      ],
    },
    {
      year: 2,
      semester: 1,
      courses: [
        {
          ...findCourse("V020001", "모바일소프트웨어 트랙", 2, 1)!,
          status: CourseStatus.RECOMMENDED,
          description:
            "더 큰 규모의 프로그램을 효율적으로 설계하고 구현하는 방법을 배웁니다.",
        },
        {
          ...findCourse("V020002", "모바일소프트웨어 트랙", 2, 1)!,
          status: CourseStatus.RECOMMENDED,
          description: "효율적인 데이터 관리를 위한 필수 개념 학습",
        },
      ],
    },
  ],
};

const sophomoreRoadmap: Roadmap = {
  semesters: [
    {
      year: 1,
      semester: 1,
      courses: [
        {
          ...findCourse("CTE0002", "웹공학 트랙", 1, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "A+",
        },
        {
          ...findCourse("M020040", "웹공학 트랙", 1, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "A0",
        },
        {
          ...findCourse("CTE0001", "모바일소프트웨어 트랙", 1, 2)!,
          status: CourseStatus.COMPLETED,
          grade: "A+",
        },
        { ...findCourse("REQ0311")!, status: CourseStatus.COMPLETED, grade: "A+" },
        { ...findCourse("L101")!, status: CourseStatus.COMPLETED, grade: "B+" },
      ],
    },
    {
      year: 1,
      semester: 2,
      courses: [
        {
          ...findCourse("V020004", "모바일소프트웨어 트랙", 1, 2)!,
          status: CourseStatus.COMPLETED,
          grade: "A0",
        },
        { ...findCourse("G101")!, status: CourseStatus.COMPLETED, grade: "B+" },
        { ...findCourse("L102")!, status: CourseStatus.COMPLETED, grade: "A0" },
      ],
    },
    {
      year: 2,
      semester: 1,
      courses: [
        {
          ...findCourse("V020001", "모바일소프트웨어 트랙", 2, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "A+",
        },
        {
          ...findCourse("V020002", "모바일소프트웨어 트랙", 2, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "A0",
        },
        {
          ...findCourse("V020003", "모바일소프트웨어 트랙", 2, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "B+",
        },
        {
          ...findCourse("V020005", "웹공학 트랙", 2, 1)!,
          status: CourseStatus.COMPLETED,
          grade: "A0",
        },
        { ...findCourse("L201")!, status: CourseStatus.COMPLETED, grade: "A+" },
      ],
    },
    {
      year: 2,
      semester: 2,
      courses: [
        {
          ...findCourse("V021003", "모바일소프트웨어 트랙", 2, 2)!,
          status: CourseStatus.ENROLLED,
        },
        {
          ...findCourse("V024003", "웹공학 트랙", 2, 2)!,
          status: CourseStatus.ENROLLED,
        },
        {
          ...findCourse("V020008", "모바일소프트웨어 트랙", 2, 2)!,
          status: CourseStatus.ENROLLED,
        },
        {
          ...findCourse("V020010", "모바일소프트웨어 트랙", 2, 2)!,
          status: CourseStatus.ENROLLED,
        },
        {
            ...findCourse("V020007", "모바일소프트웨어 트랙", 2, 2)!,
            status: CourseStatus.ENROLLED,
        },
        {
          ...findCourse("L202")!,
          status: CourseStatus.ENROLLED,
        },
      ],
    },
    {
      year: 3,
      semester: 1,
      courses: [
        {
          ...findCourse("V021004", "모바일소프트웨어 트랙", 3, 1)!,
          status: CourseStatus.RECOMMENDED,
          description: "모바일 트랙의 꽃! 안드로이드 앱 개발의 모든 것을 배웁니다. 직접 앱을 기획하고 만들면서 모바일 개발자로서의 실전 역량을 폭발적으로 성장시킬 수 있습니다.",
        },
        {
          ...findCourse("V024004", "웹공학 트랙", 3, 1)!,
          status: CourseStatus.RECOMMENDED,
          description: "웹 서비스의 핵심인 백엔드 서버를 구축하는 방법을 배웁니다. '웹프로그래밍'에서 배운 지식을 바탕으로 데이터베이스와 연동하여 실제 동작하는 웹 애플리케이션을 개발합니다.",
        },
        {
          ...findCourse("V020012", "모바일소프트웨어 트랙", 3, 1)!,
          status: CourseStatus.RECOMMENDED,
          description: "모든 서비스의 기반이 되는 데이터를 효율적으로 관리하고 조작하는 방법을 배웁니다. 모바일과 웹 개발 모두에 필수적인 핵심 기술입니다.",
        },
        {
          ...findCourse("V020014", "모바일소프트웨어 트랙", 3, 1)!,
          status: CourseStatus.RECOMMENDED,
          description: "컴퓨터 시스템의 동작 원리를 깊이 있게 이해하고, 한정된 자원을 효율적으로 관리하는 방법을 배웁니다. 안정적이고 성능 좋은 소프트웨어 개발의 토대가 됩니다.",
        },
        {
            ...findCourse("V020013", "모바일소프트웨어 트랙", 3, 1)!,
            status: CourseStatus.RECOMMENDED,
            description: "성공적인 소프트웨어 프로젝트를 위한 개발 프로세스, 요구사항 분석, 설계, 테스트 등 전 과정을 학습합니다. 협업 능력과 프로젝트 관리 능력을 기를 수 있습니다.",
        },
      ],
    },
    {
      year: 3,
      semester: 2,
      courses: [
        {
            ...findCourse("V021006", "모바일소프트웨어 트랙", 3, 2)!,
            status: CourseStatus.RECOMMENDED,
            description: "'안드로이드 프로그래밍'을 넘어, 최신 기술과 고급 기법을 활용하여 완성도 높은 상용 수준의 모바일 앱을 만드는 방법을 심도 있게 다룹니다.",
        },
        {
            ...findCourse("V024005", "웹공학 트랙", 3, 2)!,
            status: CourseStatus.RECOMMENDED,
            description: "현대 웹 개발의 필수 요소인 React, Vue, Angular 등 프론트엔드 프레임워크를 학습하여 빠르고 효율적으로 사용자 인터페이스(UI)를 개발하는 기술을 익힙니다.",
        },
        {
            ...findCourse("V020017", "모바일소프트웨어 트랙", 3, 2)!,
            status: CourseStatus.RECOMMENDED,
            description: "'데이터 통신' 지식을 바탕으로 실제 네트워크 소켓 프로그램을 작성하며, 클라이언트-서버 모델을 깊이 있게 이해하고 분산 시스템의 기초를 다집니다.",
        },
        {
            ...findCourse("V020018", "모바일소프트웨어 트랙", 3, 2)!,
            status: CourseStatus.RECOMMENDED,
            description: "재사용 가능하고 유지보수가 쉬운, 견고한 코드를 작성하기 위한 검증된 설계 노하우(디자인 패턴)를 배웁니다. 소프트웨어의 품질을 한 단계 끌어올릴 수 있습니다.",
        },
        {
            ...findCourse("V020016", "모바일소프트웨어 트랙", 3, 2)!,
            status: CourseStatus.RECOMMENDED,
            description: "운영체제 위에서 동작하는 응용 프로그램을 개발하기 위해 시스템 콜과 라이브러리를 활용하는 방법을 배웁니다. 시스템 수준의 이해를 높일 수 있습니다.",
        },
      ],
    },
  ],
};

export const mockStudents: { [key in StudentStatus]: Student } = {
  [StudentStatus.FRESHMAN]: {
    id: 1,
    name: "한새내",
    studentId: "2500001",
    status: StudentStatus.FRESHMAN,
    major: "컴퓨터공학부",
    tracks: ["트랙 미지정", "트랙 미지정"],
    careerPaths: [],
    roadmap: freshmanRoadmap,
    completedCredits: 0,
    totalCredits: 130,
    gpa: 0,
    isRoadmapConfigured: false,
    isTimetableConfigured: false,
    consentChoices: {
      profile: true,
      courses: true,
      timetable: true,
    },
    profileSharingEnabled: false,
    profileUrlPassword: "",
    profileVisibility: "private",
    favoriteCourseIds: [],
    profileDisplayOptions: {
      showGrades: true,
      showTimetable: true,
      showStudentId: true,
    },
  },
  [StudentStatus.SOPHOMORE]: {
    id: 2,
    name: "이재학",
    studentId: "2200001",
    status: StudentStatus.SOPHOMORE,
    major: "컴퓨터공학부",
    tracks: ["모바일소프트웨어 트랙", "웹공학 트랙"],
    careerPaths: [CareerPath.MOBILE_SOFTWARE, CareerPath.WEB_ENGINEERING],
    roadmap: sophomoreRoadmap,
    completedCredits: 0, // Will be calculated dynamically
    totalCredits: 130,
    gpa: 0, // Will be calculated dynamically
    isRoadmapConfigured: true,
    isTimetableConfigured: true,
    consentChoices: {
      profile: true,
      courses: true,
      timetable: true,
    },
    studyStyle: {
      creditLoad: "normal",
      preference: "practice",
      ratio: "major",
    },
    interests: ["React", "Node.js", "Kotlin", "Swift", "AWS"],
    academicGoals: ["portfolio"],
    favoriteCourseIds: ["V024005", "V021004"],
    timetable: [
        { day: "월", startTime: "10:30", endTime: "12:00", courseName: "모바일&스마트시스템", location: "공학관 502호", courseId: "V021003" },
        { day: "수", startTime: "10:30", endTime: "12:00", courseName: "모바일&스마트시스템", location: "공학관 502호", courseId: "V021003" },
        { day: "화", startTime: "13:30", endTime: "15:00", courseName: "웹프로그래밍", location: "공학관 601호", courseId: "V024003" },
        { day: "목", startTime: "13:30", endTime: "15:00", courseName: "웹프로그래밍", location: "공학관 601호", courseId: "V024003" },
        { day: "월", startTime: "15:00", endTime: "17:45", courseName: "데이터통신", location: "공학관 405호", courseId: "V020008" },
        { day: "수", startTime: "13:30", endTime: "16:15", courseName: "알고리즘", location: "공학관 408호", courseId: "V020010" },
        { day: "화", startTime: "09:00", endTime: "11:45", courseName: "객체지향언어2", location: "공학관 501호", courseId: "V020007" },
        { day: "금", startTime: "10:00", endTime: "12:45", courseName: "현대사회와 법", location: "상상관 203호", courseId: "L202" },
    ],
    profileSharingEnabled: true,
    profileUrlPassword: "hansung123",
    profileVisibility: "link_only",
    profileDisplayOptions: {
      showGrades: true,
      showTimetable: true,
      showStudentId: false,
    },
  },
};
