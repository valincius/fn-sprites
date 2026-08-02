import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("sprite row completion styling", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("reacts immediately when a row becomes complete and incomplete", () => {
    render(() => <App />);

    const label = screen.getByTestId("sprite-row-label-BurntPeanut");
    const baseCell = screen.getByTestId("sprite-row-cell-BurntPeanut-base");
    const spriteButton = screen.getByRole("button", {
      name: "BurntPeanut base",
    });
    const initialLabelClasses = label.className;
    const initialCellClasses = baseCell.className;

    expect(label.classList.contains("bg-slate-200/80")).toBe(false);
    expect(label.textContent).toContain("0/1");
    expect(baseCell.classList.contains("bg-slate-100/80")).toBe(false);

    fireEvent.click(spriteButton);

    expect(label.classList.contains("bg-slate-200/80")).toBe(true);
    expect(label.textContent).toContain("1/1");
    expect(baseCell.classList.contains("bg-slate-100/80")).toBe(true);

    fireEvent.click(spriteButton);

    expect(label.className).toBe(initialLabelClasses);
    expect(label.textContent).toContain("0/1");
    expect(baseCell.className).toBe(initialCellClasses);
  });

  it("counts only existing visible variants and leaves missing variants blank", () => {
    window.localStorage.setItem(
      "fn-sprites-collected",
      JSON.stringify(["5", "86", "8", "87", "6", "7"]),
    );

    render(() => <App />);

    const earthLabel = screen.getByTestId("sprite-row-label-Earth");
    const missingHolofoil = screen.getByTestId(
      "sprite-row-cell-Earth-holofoil",
    );

    expect(earthLabel.textContent).toContain("6/6");
    expect(earthLabel.classList.contains("bg-slate-200/80")).toBe(true);
    expect(missingHolofoil.childElementCount).toBe(0);
    expect(missingHolofoil.classList.contains("bg-transparent")).toBe(true);
  });

  it("shows collected and total visible sprite counts in the headers", () => {
    render(() => <App />);

    expect(screen.getByTestId("header-sprite").textContent).toBe("Sprite0/109");
    expect(screen.getByTestId("header-base").textContent).toBe("Base0/25");
    expect(screen.getByTestId("header-holofoil").textContent).toBe(
      "Holofoil0/11",
    );
    expect(screen.getByTestId("header-quack").textContent).toBe("Quack0/4");

    fireEvent.click(screen.getByRole("button", { name: "Earth base" }));

    expect(screen.getByTestId("header-sprite").textContent).toBe("Sprite1/109");
    expect(screen.getByTestId("header-base").textContent).toBe("Base1/25");
    expect(screen.getByTestId("header-holofoil").textContent).toBe(
      "Holofoil0/11",
    );
  });
});
