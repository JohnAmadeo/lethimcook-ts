import { describe, it, expect } from "vitest";
import { convert } from "../src/converter";

describe("TestVolumeConversions", () => {
  it("test_cups_to_ml", () => {
    const result = convert(2, "cups", "ml");
    expect(Math.abs(result - 473.176)).toBeLessThan(0.01);
  });

  it("test_tsp_to_tbsp", () => {
    const result = convert(3, "tsp", "tbsp");
    expect(Math.abs(result - 1)).toBeLessThan(0.01);
  });

  it("test_gallon_to_liter", () => {
    const result = convert(1, "gallon", "l");
    expect(Math.abs(result - 3.785)).toBeLessThan(0.01);
  });

  it("test_floz_to_ml", () => {
    const result = convert(8, "fl oz", "ml");
    expect(Math.abs(result - 236.588)).toBeLessThan(0.01);
  });

  it("test_same_unit", () => {
    const result = convert(5, "cup", "cup");
    expect(result).toBe(5);
  });
});

describe("TestWeightConversions", () => {
  it("test_pounds_to_grams", () => {
    const result = convert(1, "pound", "g");
    expect(Math.abs(result - 453.592)).toBeLessThan(0.01);
  });

  it("test_oz_to_grams", () => {
    const result = convert(16, "oz", "g");
    expect(Math.abs(result - 453.592)).toBeLessThan(0.01);
  });

  it("test_kg_to_lbs", () => {
    const result = convert(1, "kg", "lb");
    expect(Math.abs(result - 2.205)).toBeLessThan(0.01);
  });

  it("test_grams_to_ounces", () => {
    const result = convert(100, "g", "oz");
    expect(Math.abs(result - 3.527)).toBeLessThan(0.01);
  });
});

describe("TestTemperatureConversions", () => {
  it("test_fahrenheit_to_celsius", () => {
    let result = convert(32, "fahrenheit", "celsius");
    expect(Math.abs(result - 0)).toBeLessThan(0.01);

    result = convert(212, "f", "c");
    expect(Math.abs(result - 100)).toBeLessThan(0.01);

    result = convert(350, "f", "c");
    expect(Math.abs(result - 176.67)).toBeLessThan(0.1);
  });

  it("test_celsius_to_fahrenheit", () => {
    let result = convert(0, "celsius", "fahrenheit");
    expect(Math.abs(result - 32)).toBeLessThan(0.01);

    result = convert(100, "c", "f");
    expect(Math.abs(result - 212)).toBeLessThan(0.01);
  });

  it("test_celsius_to_kelvin", () => {
    const result = convert(0, "celsius", "kelvin");
    expect(Math.abs(result - 273.15)).toBeLessThan(0.01);
  });

  it("test_kelvin_to_celsius", () => {
    const result = convert(273.15, "kelvin", "celsius");
    expect(Math.abs(result - 0)).toBeLessThan(0.01);
  });
});

describe("TestCountConversions", () => {
  it("test_count_to_count", () => {
    const result = convert(5, "count", "item");
    expect(result).toBe(5);
  });
});

describe("TestErrorHandling", () => {
  it("test_incompatible_units", () => {
    expect(() => convert(1, "cups", "grams")).toThrow(
      /Cannot convert between/
    );
  });

  it("test_unknown_unit", () => {
    expect(() => convert(1, "blorg", "ml")).toThrow(/Unknown unit/);
  });

  it("test_temperature_weight_mix", () => {
    expect(() => convert(100, "celsius", "grams")).toThrow(
      /Cannot convert between/
    );
  });
});

describe("TestUnitVariations", () => {
  it("test_teaspoon_variations", () => {
    const result1 = convert(1, "tsp", "ml");
    const result2 = convert(1, "teaspoon", "ml");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
  });

  it("test_pound_variations", () => {
    const result1 = convert(1, "lb", "g");
    const result2 = convert(1, "lbs", "g");
    const result3 = convert(1, "pound", "g");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
    expect(Math.abs(result1 - result3)).toBeLessThan(0.001);
  });

  it("test_case_insensitive", () => {
    const result1 = convert(1, "CUP", "ML");
    const result2 = convert(1, "cup", "ml");
    expect(Math.abs(result1 - result2)).toBeLessThan(0.001);
  });
});
