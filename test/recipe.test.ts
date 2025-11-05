/**
 * Tests for recipe scaling functionality.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { Ingredient, Recipe, IngredientSchema, RecipeSchema, scale_recipe, ValueError } from '../src/recipe';

describe('RecipeScaling', () => {
  describe('test_double_recipe', () => {
    it('should double all ingredient amounts when servings are doubled', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { amount: 2, unit: "cups", name: "flour" },
          { amount: 1, unit: "tsp", name: "salt" },
        ]
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.servings).toBe(8);
      expect(scaled.ingredients).toHaveLength(2);
      expect(scaled.ingredients[0].amount).toBe(4);
      expect(scaled.ingredients[1].amount).toBe(2);
    });
  });

  describe('test_halve_recipe', () => {
    it('should halve all ingredient amounts when servings are halved', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { amount: 2, unit: "cups", name: "flour" },
          { amount: 4, unit: "tbsp", name: "butter" },
        ]
      };
      const scaled = scale_recipe(recipe, 2);

      expect(scaled.servings).toBe(2);
      expect(scaled.ingredients[0].amount).toBe(1);
      expect(scaled.ingredients[1].amount).toBe(2);
    });
  });

  describe('test_scale_to_odd_number', () => {
    it('should scale ingredients proportionally to odd serving counts', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { amount: 2, unit: "cups", name: "flour" },
        ]
      };
      const scaled = scale_recipe(recipe, 6);

      expect(scaled.servings).toBe(6);
      expect(scaled.ingredients[0].amount).toBe(3);
    });
  });

  describe('test_fractional_scaling', () => {
    it('should handle fractional results from scaling', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { amount: 3, unit: "cups", name: "flour" },
        ]
      };
      const scaled = scale_recipe(recipe, 3);

      expect(scaled.servings).toBe(3);
      expect(scaled.ingredients[0].amount).toBeDefined();
      expect(Math.abs(scaled.ingredients[0].amount! - 2.25)).toBeLessThan(0.01);
    });
  });

  describe('test_preserve_ingredient_properties', () => {
    it('should maintain unit, name, and note during scaling', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { amount: 2, unit: "cups", name: "flour", note: "all-purpose" },
        ]
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.ingredients[0].unit).toBe("cups");
      expect(scaled.ingredients[0].name).toBe("flour");
      expect(scaled.ingredients[0].note).toBe("all-purpose");
    });
  });

  describe('test_ingredient_without_amount', () => {
    it('should handle ingredients without amounts', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: [
          { unit: "pinch", name: "salt" },
        ]
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.ingredients[0].unit).toBe("pinch");
      expect(scaled.ingredients[0].name).toBe("salt");
    });
  });

  describe('test_preserve_additional_recipe_fields', () => {
    it('should maintain name and prep_time during scaling', () => {
      const recipe: Recipe = {
        servings: 4,
        name: "Chocolate Chip Cookies",
        prep_time: "15 minutes",
        ingredients: [
          { amount: 2, unit: "cups", name: "flour" },
        ]
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.name).toBe("Chocolate Chip Cookies");
      expect(scaled.prep_time).toBe("15 minutes");
    });
  });

  describe('test_empty_ingredients_list', () => {
    it('should handle recipes with no ingredients', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: []
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.servings).toBe(8);
      expect(scaled.ingredients).toHaveLength(0);
    });
  });
});

describe('RecipeScalingErrors', () => {
  describe('test_missing_servings', () => {
    it('should throw validation error when servings is missing', () => {
      expect(() => {
        RecipeSchema.parse({
          ingredients: [
            { amount: 2, unit: "cups", name: "flour" },
          ]
        });
      }).toThrow(z.ZodError);
    });
  });

  describe('test_missing_ingredients', () => {
    it('should throw validation error when ingredients is missing', () => {
      expect(() => {
        RecipeSchema.parse({ servings: 4 });
      }).toThrow(z.ZodError);
    });
  });

  describe('test_zero_servings', () => {
    it('should throw validation error when servings is zero', () => {
      expect(() => {
        RecipeSchema.parse({
          servings: 0,
          ingredients: []
        });
      }).toThrow(z.ZodError);
    });
  });

  describe('test_negative_servings', () => {
    it('should throw ValueError when scaling to negative servings', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: []
      };
      expect(() => {
        scale_recipe(recipe, -2);
      }).toThrow(ValueError);
      expect(() => {
        scale_recipe(recipe, -2);
      }).toThrow(/positive/);
    });
  });
});
