#!/usr/bin/env node

/**
 * Command-line interface for the lethimcook library.
 */

import { convert_natural } from "./index.js";

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("LetHimCook - Unit Conversion Library");
    console.log("\nUsage:");
    console.log("  lethimcook '2 cups to ml'");
    console.log("  lethimcook 'convert 1 pound to grams'");
    console.log("  lethimcook 'how many ml in 3 teaspoons'");
    console.log("\nSupported units:");
    console.log("  Volume: tsp, tbsp, fl oz, cup, pint, quart, gallon, ml, liter");
    console.log("  Weight: oz, pound, gram, kilogram");
    console.log("  Temperature: fahrenheit, celsius, kelvin");
    process.exit(1);
  }

  const query = args.join(" ");

  try {
    const result = convert_natural(query);
    console.log(result);
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Error: An unknown error occurred");
    }
    process.exit(1);
  }
}

main();
