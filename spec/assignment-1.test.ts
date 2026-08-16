import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// The contract from this week's spec: "one clear, testable interaction that
// changes what the visitor sees" — here, allocating a fixed fund across N
// startups and seeing the resulting fund return. These assert the structural
// hooks that interaction needs to exist through, not the random outcome of a
// draw (that's exercised live, at the crit, across both marking viewports).
const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;

describe("power law allocator", () => {
  it("declares a fixed fund to allocate", () => {
    const total = doc.querySelector('[data-testid="fund-total"]');
    expect(total, "a visible element must state the fixed fund amount").toBeTruthy();
  });

  it("gives each startup its own allocation control", () => {
    const sliders = doc.querySelectorAll('[data-testid="allocation-slider"]');
    expect(sliders.length, "need at least two startups to compare strategies").toBeGreaterThanOrEqual(2);
    for (const slider of sliders) {
      expect(slider.tagName, "each allocation control is a range input").toBe("INPUT");
      expect(slider.getAttribute("type")).toBe("range");
    }
  });

  it("shows a live running total so the visitor can see the sum constraint", () => {
    const remaining = doc.querySelector('[data-testid="fund-remaining"]');
    expect(remaining, "a running total/remaining indicator must exist").toBeTruthy();
    expect(
      remaining?.getAttribute("aria-live"),
      "it updates as sliders move, so it must announce to assistive tech",
    ).toBe("polite");
  });

  it("has a control that runs the allocation and draws returns", () => {
    const submit = doc.querySelector('[data-testid="allocate-submit"]');
    expect(submit, "a submit control must exist").toBeTruthy();
    expect(submit?.hasAttribute("disabled"), "must be usable on first load").toBe(false);
  });

  it("has a live region for the resulting fund return, so it can be resubmitted repeatedly", () => {
    const result = doc.querySelector('[data-testid="fund-return"]');
    expect(result, "a result region must exist").toBeTruthy();
    expect(
      result?.getAttribute("aria-live"),
      "the return changes on each submit without a page reload, so it must announce to assistive tech",
    ).toBe("polite");
  });
});
