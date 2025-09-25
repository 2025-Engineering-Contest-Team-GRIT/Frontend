import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with value", () => {
    const { getByText } = render(<ProgressBar value={50} showLabel />);
    expect(getByText("50%")).toBeInTheDocument();
  });
});
