/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryPanel } from "../components/QueryPanel";

describe("QueryPanel", () => {
  it("renders the query input", () => {
    render(<QueryPanel />);
    expect(
      screen.getByPlaceholderText("Ask a question about your documents...")
    ).toBeDefined();
  });

  it("renders the heading", () => {
    render(<QueryPanel />);
    expect(screen.getByText("Query Documents")).toBeDefined();
  });
});
