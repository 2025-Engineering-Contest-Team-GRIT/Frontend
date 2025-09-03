-- 사용자 테이블
CREATE TABLE users (
    uuid VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    semester VARCHAR(20),
    first_track VARCHAR(50),
    second_track VARCHAR(50)
);

-- 과목 정보 테이블
CREATE TABLE courses (
    course_code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credit INT
);

-- 트랙 정보 테이블
CREATE TABLE tracks (
    track_code VARCHAR(50) PRIMARY KEY,
    track_name VARCHAR(100)
);

-- 과목 세부 정보 테이블
CREATE TABLE course_details (
    course_code VARCHAR(20),
    track_code VARCHAR(50),
    course_type VARCHAR(50),
    prerequisites TEXT,
    semester VARCHAR(20),
    PRIMARY KEY (course_code, track_code),
    FOREIGN KEY (course_code) REFERENCES courses(course_code),
    FOREIGN KEY (track_code) REFERENCES tracks(track_code)
);

-- 추천 과목 테이블
CREATE TABLE recommended_courses (
    track_code VARCHAR(50),
    course_code VARCHAR(20),
    semester VARCHAR(20),
    PRIMARY KEY (track_code, course_code),
    FOREIGN KEY (track_code) REFERENCES tracks(track_code),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);

-- 로드맵 정보 테이블 (이수 과목 포함)
CREATE TABLE roadmaps (
    uuid VARCHAR(36),
    course_code VARCHAR(20),
    track_code VARCHAR(50),
    semester VARCHAR(20),
    grade VARCHAR(10),
    PRIMARY KEY (uuid, course_code),
    FOREIGN KEY (uuid) REFERENCES users(uuid),
    FOREIGN KEY (course_code) REFERENCES courses(course_code),
    FOREIGN KEY (track_code) REFERENCES tracks(track_code)
);

-- 졸업 요건 테이블
CREATE TABLE graduation_requirements (
    uuid VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50),
    progress DECIMAL(5, 2),
    FOREIGN KEY (uuid) REFERENCES users(uuid)
);

CREATE TABLE recommended_courses (
    track_code VARCHAR(50),
    course_code VARCHAR(20),
    semester VARCHAR(20),
    PRIMARY KEY (track_code, course_code),
    FOREIGN KEY (track_code) REFERENCES tracks(track_code),
    FOREIGN KEY (course_code) REFERENCES courses(course_code)
);
