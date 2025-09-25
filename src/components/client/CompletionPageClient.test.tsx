import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { CompletionPageClient } from "./CompletionPageClient";

// Mock hooks and components
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/hooks/useStore", () => ({
  useAuth: jest.fn(),
  useCompletionState: jest.fn(),
}));
jest.mock("@/hooks/useData", () => ({
  useCourses: jest.fn(),
}));
jest.mock("@/components/views/CompletionStatusView", () => ({
  CompletionStatusView: jest.fn(() => <div>CompletionStatusView</div>),
}));

describe("CompletionPageClient", () => {
  const push = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("로그인되지 않은 경우 /login으로 리다이렉트한다", () => {
    const { useAuth } = require("@/hooks/useStore");
    useAuth.mockReturnValue({ authInfo: null, isAuthenticated: false });
    const { useCourses } = require("@/hooks/useData");
    useCourses.mockReturnValue({ data: null, isLoading: true, refetch: jest.fn() });
    const { useCompletionState } = require("@/hooks/useStore");
    useCompletionState.mockReturnValue({
      completionInfo: null,
      setCompletionInfo: jest.fn(),
      setAsFavorite: jest.fn(),
      unsetAsFavorite: jest.fn(),
    });

    render(<CompletionPageClient />);
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("로딩 중이면 로딩 메시지를 보여준다", () => {
    const { useAuth } = require("@/hooks/useStore");
    useAuth.mockReturnValue({ authInfo: {}, isAuthenticated: true });
    const { useCourses } = require("@/hooks/useData");
    useCourses.mockReturnValue({ data: null, isLoading: true, refetch: jest.fn() });
    const { useCompletionState } = require("@/hooks/useStore");
    useCompletionState.mockReturnValue({
      completionInfo: null,
      setCompletionInfo: jest.fn(),
      setAsFavorite: jest.fn(),
      unsetAsFavorite: jest.fn(),
    });

    render(<CompletionPageClient />);
    expect(screen.getByText("이수 과목을 불러오는 중...")).toBeInTheDocument();
  });

  it("completionInfo가 있으면 CompletionStatusView를 렌더링한다", async () => {
    const { useAuth } = require("@/hooks/useStore");
    useAuth.mockReturnValue({ authInfo: {}, isAuthenticated: true });
    const { useCourses } = require("@/hooks/useData");
    useCourses.mockReturnValue({ data: { foo: "bar" }, isLoading: false, refetch: jest.fn() });
    const { useCompletionState } = require("@/hooks/useStore");
    useCompletionState.mockReturnValue({
      completionInfo: { foo: "bar" },
      setCompletionInfo: jest.fn(),
      setAsFavorite: jest.fn(),
      unsetAsFavorite: jest.fn(),
    });

    render(<CompletionPageClient />);
    await waitFor(() => {
      expect(screen.getByText("CompletionStatusView")).toBeInTheDocument();
    });
  });
});
