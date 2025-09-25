import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as types from "@/types";
import { DashboardView } from "./DashboardView";

describe("DashboardView", () => {
  it("renders without crashing", () => {
    // 타입에 맞는 mock 데이터
    const dashboardInfo: types.DashboardInfo = {
      userInfo: {
        name: "홍길동",
        year: 1,
        semester: 1,
        department: "컴퓨터공학과",
        tracks: ["트랙 미지정"],
      },
      academicStatus: {
        gpa: 4.0,
        gpaMax: 4.5,
        completedCredits: 10,
        totalCreditsRequired: 130,
      },
      careerGoal: {
        primaryTracks: "트랙 미지정",
      },
      nextSemesterCourses: [],
      todaySchedule: [],
    };
    const setActiveView = jest.fn();
    render(<DashboardView dashboardInfo={dashboardInfo} setActiveView={setActiveView} />);
    expect(document.body).toBeInTheDocument();
  });
});
