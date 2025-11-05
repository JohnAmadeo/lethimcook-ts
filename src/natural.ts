/**
 * Natural language conversion utility using regex and string matching.
 */

import { convert } from "./converter.js";

/**
 * Format a number, removing .0 for integers.
 * @param value - The number to format
 * @returns The formatted number as a string
 */
function _format_number(value: number): string {
  if (value === Math.floor(value)) {
    return Math.floor(value).toString();
  }
  return value.toString();
}

/**
 * Convert using natural language input.
 *
 * Supports patterns like:
 * - "2 cups to ml"
 * - "convert 1.5 pounds to grams"
 * - "how many ml in 3 teaspoons"
 * - "5 fahrenheit to celsius"
 *
 * @param text - Natural language conversion request
 * @returns Formatted string with conversion result
 * @throws {Error} If the input cannot be parsed
 */
export function convert_natural(text: string): string {
  const normalizedText = text.toLowerCase().trim();

  // Pattern 1: "X unit to unit" or "X unit in unit"
  const pattern1 = /^(\d+\.?\d*)\s+([a-z\s]+?)\s+(?:to|in)\s+([a-z\s]+)$/;
  let match = normalizedText.match(pattern1);
  if (match && match[1] && match[2] && match[3]) {
    const value = parseFloat(match[1]);
    const from_unit = match[2].trim();
    const to_unit = match[3].trim();
    const result = convert(value, from_unit, to_unit);
    return `${_format_number(value)} ${from_unit} = ${result.toFixed(2)} ${to_unit}`;
  }

  // Pattern 2: "convert X unit to unit"
  const pattern2 = /^convert\s+(\d+\.?\d*)\s+([a-z\s]+?)\s+to\s+([a-z\s]+)$/;
  match = normalizedText.match(pattern2);
  if (match && match[1] && match[2] && match[3]) {
    const value = parseFloat(match[1]);
    const from_unit = match[2].trim();
    const to_unit = match[3].trim();
    const result = convert(value, from_unit, to_unit);
    return `${_format_number(value)} ${from_unit} = ${result.toFixed(2)} ${to_unit}`;
  }

  // Pattern 3: "how many unit in X unit"
  const pattern3 = /^how\s+many\s+([a-z\s]+?)\s+in\s+(\d+\.?\d*)\s+([a-z\s]+)$/;
  match = normalizedText.match(pattern3);
  if (match && match[1] && match[2] && match[3]) {
    const to_unit = match[1].trim();
    const value = parseFloat(match[2]);
    const from_unit = match[3].trim();
    const result = convert(value, from_unit, to_unit);
    return `${_format_number(value)} ${from_unit} = ${result.toFixed(2)} ${to_unit}`;
  }

  throw new Error(
    `Could not parse conversion request: ${text}\n` +
      "Try formats like: '2 cups to ml' or 'convert 1 pound to grams'"
  );
}
