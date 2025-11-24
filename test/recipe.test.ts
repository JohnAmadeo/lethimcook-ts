import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  Ingredient,
  Recipe,
  IngredientSchema,
  RecipeSchema,
  scale_recipe,
} from "../src/recipe";

describe("Recipe Scaling", () => {
  it("should double recipe", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [
        { amount: 2, unit: "cups", name: "flour" },
        { amount: 1, unit: "tsp", name: "salt" },
      ],
    };
    const scaled = scale_recipe(recipe, 8);

    expect(scaled.servings).toBe(8);
    expect(scaled.ingredients).toHaveLength(2);
    expect(scaled.ingredients[0].amount).toBe(4);
    expect(scaled.ingredients[1].amount).toBe(2);
  });

  it("should halve recipe", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [
        { amount: 2, unit: "cups", name: "flour" },
        { amount: 4, unit: "tbsp", name: "butter" },
      ],
    };
    const scaled = scale_recipe(recipe, 2);

    expect(scaled.servings).toBe(2);
    expect(scaled.ingredients[0].amount).toBe(1);
    expect(scaled.ingredients[1].amount).toBe(2);
  });

  it("should scale to odd number", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [{ amount: 2, unit: "cups", name: "flour" }],
    };
    const scaled = scale_recipe(recipe, 6);

    expect(scaled.servings).toBe(6);
    expect(scaled.ingredients[0].amount).toBe(3);
  });

  it("should handle fractional scaling", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [{ amount: 3, unit: "cups", name: "flour" }],
    };
    const scaled = scale_recipe(recipe, 3);

    expect(scaled.servings).toBe(3);
    expect(scaled.ingredients[0].amount).not.toBeUndefined();
    expect(Math.abs(scaled.ingredients[0].amount! - 2.25)).toBeLessThan(0.01);
  });

  it("should preserve ingredient properties", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [
        { amount: 2, unit: "cups", name: "flour", note: "all-purpose" },
      ],
    };
    const scaled = scale_recipe(recipe, 8);

    expect(scaled.ingredients[0].unit).toBe("cups");
    expect(scaled.ingredients[0].name).toBe("flour");
    expect(scaled.ingredients[0].note).toBe("all-purpose");
  });

  it("should handle ingredient without amount", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [{ unit: "pinch", name: "salt" }],
    };
    const scaled = scale_recipe(recipe, 8);

    expect(scaled.ingredients[0].unit).toBe("pinch");
    expect(scaled.ingredients[0].name).toBe("salt");
    expect(scaled.ingredients[0].amount).toBeUndefined();
  });

  it("should preserve additional recipe fields", () => {
    const recipe: Recipe = {
      servings: 4,
      name: "Chocolate Chip Cookies",
      prep_time: "15 minutes",
      ingredients: [{ amount: 2, unit: "cups", name: "flour" }],
    };
    const scaled = scale_recipe(recipe, 8);

    expect(scaled.name).toBe("Chocolate Chip Cookies");
    expect(scaled.prep_time).toBe("15 minutes");
  });

  it("should handle empty ingredients list", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [],
    };
    const scaled = scale_recipe(recipe, 8);

    expect(scaled.servings).toBe(8);
    expect(scaled.ingredients).toHaveLength(0);
  });
});

describe("Recipe Validation Errors", () => {
  it("should error on missing servings", () => {
    expect(() => {
      RecipeSchema.parse({
        ingredients: [{ amount: 2, unit: "cups", name: "flour" }],
      });
    }).toThrow();
  });

  it("should error on missing ingredients", () => {
    expect(() => {
      RecipeSchema.parse({ servings: 4 });
    }).toThrow();
  });

  it("should error on zero servings", () => {
    expect(() => {
      RecipeSchema.parse({
        servings: 0,
        ingredients: [],
      });
    }).toThrow();
  });

  it("should error on negative servings", () => {
    const recipe: Recipe = {
      servings: 4,
      ingredients: [],
    };
    expect(() => {
      scale_recipe(recipe, -2);
    }).toThrow("positive");
  });
});
