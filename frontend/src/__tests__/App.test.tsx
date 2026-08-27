/// <reference types="vitest" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders the application", () => {
    render(<App />);
    expect(screen.getByText(/Sign In|AI Document/i)).toBeDefined();
  });

  it("shows login form by default", () => {
    render(<App />);
    expect(screen.getByText(/Sign In|Log In|Login/i)).toBeDefined();
  });
});
