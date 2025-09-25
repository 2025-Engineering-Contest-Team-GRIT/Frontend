import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders message", () => {
    const { getByText } = render(<Toast message="Test message" />);
    expect(getByText("Test message")).toBeInTheDocument();
  });
});
