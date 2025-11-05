/**
 * Tests for core conversion functionality.
 */

import { describe, it, expect } from "vitest";
import { convert } from "../src/converter.js";

describe("Volume Conversions", () => {
  it("should convert cups to ml", () => {
    const result = convert(2, "cups", "ml");
    expect(Math.abs(result - 473.176)).toBeLessThan(0.01);
  });

  it("should convert tsp to tbsp", () => {
    const result = convert(3, "tsp", "tbsp");
    expect(Math.abs(result - 1)).toBeLessThan(0.01);
  });

  it("should convert gallon to liter", () => {
    const result = convert(1, "gallon", "l");
    expect(Math.abs(result - 3.785)).toBeLessThan(0.01);
  });

  it("should convert fl oz to ml", () => {
    const result = convert(8, "fl oz", "ml");
    expect(Math.abs(result - 236.588)).toBeLessThan(0.01);
  });

  it("should handle same unit conversion", () => {
    const result = convert(5, "cup", "cup");
    expect(result).toBe(5);
  });
});

describe("Weight Conversions", () => {
  it("should convert pounds to grams", () => {
    const result = convert(1, "pound", "g");
    expect(Math.abs(result - 453.592)).toBeLessThan(0.01);
  });

  it("should convert oz to grams", () => {
    const result = convert(16, "oz", "g");
    expect(Math.abs(result - 453.592)).toBeLessThan(0.01);
  });

  it("should convert kg to lbs", () => {
    const result = convert(1, "kg", "lb");
    expect(Math.abs(result - 2.205)).toBeLessThan(0.01);
  });

  it("should convert grams to ounces", () => {
    const result = convert(100, "g", "oz");
    expect(Math.abs(result - 3.527)).toBeLessThan(0.01);
  });
});

describe("Temperature Conversions", () => {
  it("should convert fahrenheit to celsius", () => {
    let result = convert(32, "fahrenheit", "celsius");
    expect(Math.abs(result - 0)).toBeLessThan(0.01);

    result = convert(212, "f", "c");
    expect(Math.abs(result - 100)).toBeLessThan(0.01);

    result = convert(350, "f", "c");
    expect(Math.abs(result - 176.67)).toBeLessThan(0.1);
  });

  it("should convert celsius to fahrenheit", () => {
    let result = convert(0, "celsius", "fahrenheit");
    expect(Math.abs(result - 32)).toBeLessThan(0.01);

    result = convert(100, "c", "f");
    expect(Math.abs(result - 212)).toBeLessThan(0.01);
  });

  it("should convert celsius to kelvin", () => {
    const result = convert(0, "celsius", "kelvin");
    expect(Math.abs(result - 273.15)).toBeLessThan(0.01);
  });

  it("should convert kelvin to celsius", () => {
    const result = convert(273.15, "kelvin", "celsius");
    expect(Math.abs(result - 0)).toBeLessThan(0.01);
  });
});

describe("Count Conversions", () => {
  it("should convert count to item", () => {
    const result = convert(5, "count", "item");
    expect(result).toBe(5);
  });
});

describe("Error Handling", () => {
  it("should reject incompatible units", () => {
    expect(() => convert(1, "cups", "grams")).toThrow(/Cannot convert between/);
  });

  it("should reject unknown unit", () => {
    expect(() => convert(1, "blorg", "ml")).toThrow(/Unknown unit/);
  });

  it("should reject temperature weight mix", () => {
    expect(() => convert(100, "celsius", "grams")).toThrow(/Cannot convert between/);
  });
});

describe("Unit Variations", () => {
  it("should handle teaspoon variations", () => {
    const result1 = convert(1, "tsp", "ml");
    const result2 = convert(1, "teaspoon", "ml");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
  });

  it("should handle pound variations", () => {
    const result1 = convert(1, "lb", "g");
    const result2 = convert(1, "lbs", "g");
    const result3 = convert(1, "pound", "g");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
    expect(Math.abs(result1 - result3)).toBeLessThan(0.001);
  });

  it("should be case insensitive", () => {
    const result1 = convert(1, "CUP", "ML");
    const result2 = convert(1, "cup", "ml");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
  });
});
