/**
 * Core unit conversion functionality.
 */

import {
  CONVERSIONS,
  UnitType,
  get_unit_type,
  normalize_unit,
} from "./units.js";

/**
 * Convert a value from one unit to another.
 *
 * @param value - The numeric value to convert
 * @param from_unit - The source unit
 * @param to_unit - The target unit
 * @returns The converted value
 * @throws Error if units are incompatible or unknown
 */
export function convert(value: number, from_unit: string, to_unit: string): number {
  const normalizedFromUnit = normalize_unit(from_unit);
  const normalizedToUnit = normalize_unit(to_unit);

  // Get unit types
  const from_type = get_unit_type(normalizedFromUnit);
  const to_type = get_unit_type(normalizedToUnit);

  // Check compatibility
  if (from_type !== to_type) {
    throw new Error(
      `Cannot convert between ${from_type} and ${to_type}`
    );
  }

  // Handle temperature separately (non-linear conversion)
  if (from_type === UnitType.TEMPERATURE) {
    return _convert_temperature(value, normalizedFromUnit, normalizedToUnit);
  }

  // Handle count (no conversion needed)
  if (from_type === UnitType.COUNT) {
    return value;
  }

  // Convert: from_unit -> base_unit -> to_unit
  const base_value = value * CONVERSIONS[normalizedFromUnit]!;
  const result = base_value / CONVERSIONS[normalizedToUnit]!;

  return result;
}

/**
 * Convert temperature between different scales.
 *
 * @param value - The temperature value to convert
 * @param from_unit - The source temperature unit
 * @param to_unit - The target temperature unit
 * @returns The converted temperature value
 * @throws Error if the temperature unit is unknown
 */
export function _convert_temperature(value: number, from_unit: string, to_unit: string): number {
  // First convert to Celsius
  let celsius: number;

  switch (from_unit) {
    case "celsius":
    case "c":
      celsius = value;
      break;
    case "fahrenheit":
    case "f":
      celsius = (value - 32) * 5 / 9;
      break;
    case "kelvin":
    case "k":
      celsius = value - 273.15;
      break;
    default:
      throw new Error(`Unknown temperature unit: ${from_unit}`);
  }

  // Then convert from Celsius to target
  switch (to_unit) {
    case "celsius":
    case "c":
      return celsius;
    case "fahrenheit":
    case "f":
      return celsius * 9 / 5 + 32;
    case "kelvin":
    case "k":
      return celsius + 273.15;
    default:
      throw new Error(`Unknown temperature unit: ${to_unit}`);
  }
}
