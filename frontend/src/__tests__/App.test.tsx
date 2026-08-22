/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the application", () => {
    render(<App />);
    expect(screen.getByText("AI Document Intelligence")).toBeDefined();
  });

  it("shows upload page by default", () => {
    render(<App />);
    expect(screen.getByText("Upload Documents")).toBeDefined();
  });
});
