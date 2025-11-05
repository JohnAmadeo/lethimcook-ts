/**
 * Tests for recipe scaling functionality.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { Ingredient, Recipe, IngredientSchema, RecipeSchema, scale_recipe, ValueError } from '../src/recipe';

describe('Recipe Scaling', () => {
  describe('TestRecipeScaling', () => {
    it('test_double_recipe', () => {
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

    it('test_halve_recipe', () => {
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

    it('test_scale_to_odd_number', () => {
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

    it('test_fractional_scaling', () => {
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

    it('test_preserve_ingredient_properties', () => {
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

    it('test_ingredient_without_amount', () => {
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

    it('test_preserve_additional_recipe_fields', () => {
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

    it('test_empty_ingredients_list', () => {
      const recipe: Recipe = {
        servings: 4,
        ingredients: []
      };
      const scaled = scale_recipe(recipe, 8);

      expect(scaled.servings).toBe(8);
      expect(scaled.ingredients).toHaveLength(0);
    });
  });

  describe('TestRecipeScalingErrors', () => {
    it('test_missing_servings', () => {
      expect(() => {
        RecipeSchema.parse({
          ingredients: [
            { amount: 2, unit: "cups", name: "flour" },
          ]
        });
      }).toThrow(z.ZodError);
    });

    it('test_missing_ingredients', () => {
      expect(() => {
        RecipeSchema.parse({ servings: 4 });
      }).toThrow(z.ZodError);
    });

    it('test_zero_servings', () => {
      expect(() => {
        RecipeSchema.parse({
          servings: 0,
          ingredients: []
        });
      }).toThrow(z.ZodError);
    });

    it('test_negative_servings', () => {
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
