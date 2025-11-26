/**
 * Core unit conversion functionality.
 */

import { CONVERSIONS, UnitType, getUnitType, normalizeUnit } from "./units.js";

/**
 * Convert a value from one unit to another.
 *
 * Args:
 *   value: The numeric value to convert
 *   from_unit: The source unit
 *   to_unit: The target unit
 *
 * Returns:
 *   The converted value
 *
 * Throws:
 *   Error: If units are incompatible or unknown
 */
export function convert(
  value: number,
  from_unit: string,
  to_unit: string
): number {
  const normalizedFrom = normalizeUnit(from_unit);
  const normalizedTo = normalizeUnit(to_unit);

  // Get unit types
  const fromType = getUnitType(normalizedFrom);
  const toType = getUnitType(normalizedTo);

  // Check compatibility
  if (fromType !== toType) {
    throw new Error(`Cannot convert between ${fromType} and ${toType}`);
  }

  // Handle temperature separately (non-linear conversion)
  if (fromType === UnitType.TEMPERATURE) {
    return convertTemperature(value, normalizedFrom, normalizedTo);
  }

  // Handle count (no conversion needed)
  if (fromType === UnitType.COUNT) {
    return value;
  }

  // Convert: from_unit -> base_unit -> to_unit
  const baseValue =
    value * CONVERSIONS[normalizedFrom as keyof typeof CONVERSIONS];
  const result = baseValue / CONVERSIONS[normalizedTo as keyof typeof CONVERSIONS];

  return result;
}

/**
 * Convert temperature between different scales.
 */
function convertTemperature(
  value: number,
  from_unit: string,
  to_unit: string
): number {
  // First convert to Celsius
  let celsius: number;
  switch (from_unit) {
    case "celsius":
    case "c":
      celsius = value;
      break;
    case "fahrenheit":
    case "f":
      celsius = ((value - 32) * 5) / 9;
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
      return (celsius * 9) / 5 + 32;
    case "kelvin":
    case "k":
      return celsius + 273.15;
    default:
      throw new Error(`Unknown temperature unit: ${to_unit}`);
  }
}
