/**
 * Tests for natural language conversion.
 */

import { describe, it, expect } from "vitest";
import { convert_natural } from "../src/natural.js";

describe("Natural Language Patterns", () => {
  it("should handle basic to pattern", () => {
    const result = convert_natural("2 cups to ml");
    expect(result.toLowerCase()).toContain("2 cups");
    expect(result.toLowerCase()).toContain("ml");
    expect(result).toContain("473");
  });

  it("should handle convert pattern", () => {
    const result = convert_natural("convert 1 pound to grams");
    expect(result.toLowerCase()).toContain("1 pound");
    expect(result.toLowerCase()).toContain("gram");
    expect(result).toContain("453");
  });

  it("should handle how many pattern", () => {
    const result = convert_natural("how many ml in 3 teaspoons");
    expect(result.toLowerCase()).toContain("3 teaspoon");
    expect(result.toLowerCase()).toContain("ml");
  });

  it("should handle decimal values", () => {
    const result = convert_natural("1.5 cups to ml");
    expect(result).toContain("1.5");
  });

  it("should handle temperature conversion", () => {
    const result = convert_natural("350 fahrenheit to celsius");
    expect(result).toContain("350");
    expect(result.toLowerCase()).toContain("fahrenheit");
    expect(result.toLowerCase()).toContain("celsius");
  });

  it("should handle reverse temperature conversion", () => {
    const result = convert_natural("100 celsius to fahrenheit");
    expect(result).toContain("100");
    expect(result.toLowerCase()).toContain("celsius");
    expect(result.toLowerCase()).toContain("fahrenheit");
    expect(result).toContain("212");
  });

  it("should handle temperature conversion with convert pattern", () => {
    const result = convert_natural("convert 32 fahrenheit to celsius");
    expect(result).toContain("32");
    expect(result.toLowerCase()).toContain("fahrenheit");
    expect(result.toLowerCase()).toContain("celsius");
    expect(result).toContain("0");
  });

  it("should handle temperature conversion with how many pattern", () => {
    const result = convert_natural("how many celsius in 212 fahrenheit");
    expect(result).toContain("212");
    expect(result.toLowerCase()).toContain("fahrenheit");
    expect(result.toLowerCase()).toContain("celsius");
    expect(result).toContain("100");
  });

  it("should be case insensitive", () => {
    const result1 = convert_natural("2 CUPS to ML");
    const result2 = convert_natural("2 cups to ml");
    // Both should contain the same numeric result
    expect(result1).toContain("473");
    expect(result2).toContain("473");
  });

  it("should handle multi-word units", () => {
    const result = convert_natural("5 fluid ounce to ml");
    expect(result.toLowerCase()).toContain("fluid ounce");
    expect(result.toLowerCase()).toContain("ml");
  });
});

describe("Natural Language Errors", () => {
  it("should throw error for unparseable input", () => {
    expect(() => convert_natural("this is gibberish")).toThrow("Could not parse");
  });

  it("should throw error for missing value", () => {
    expect(() => convert_natural("cups to ml")).toThrow();
  });

  it("should throw error for invalid unit", () => {
    expect(() => convert_natural("2 blorg to ml")).toThrow();
  });
});
