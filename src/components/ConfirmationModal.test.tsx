import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmationModal } from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ConfirmationModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Title"
        message="Message"
      />,
    );
    expect(container.firstChild).toBeNull();
  });
  it("renders title and message when open", () => {
    const { getByText } = render(
      <ConfirmationModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Title"
        message="Message"
      />,
    );
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Message")).toBeInTheDocument();
  });
});
