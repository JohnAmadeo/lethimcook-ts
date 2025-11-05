/**
 * Recipe scaling utility.
 */

import { z } from 'zod';

/**
 * Schema for a recipe ingredient.
 * Supports optional amount and note fields, with passthrough for extra properties.
 */
export const IngredientSchema = z.object({
  amount: z.number().optional(),
  unit: z.string(),
  name: z.string(),
  note: z.string().optional(),
}).passthrough();

/**
 * Type inference for Ingredient from schema.
 */
export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * Schema for a recipe with servings and ingredients.
 * Servings must be a positive integer.
 */
export const RecipeSchema = z.object({
  servings: z.number().int().positive({
    message: "Servings must be positive"
  }),
  ingredients: z.array(IngredientSchema),
  name: z.string().optional(),
  prep_time: z.string().optional(),
}).passthrough();

/**
 * Type inference for Recipe from schema.
 */
export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Scale a recipe to a different number of servings.
 *
 * @param recipe - Recipe object with servings and ingredients
 * @param newServings - Target number of servings
 * @returns New Recipe object with scaled ingredient amounts
 * @throws Error if newServings is not positive
 *
 * @example
 * ```typescript
 * const recipe: Recipe = {
 *   servings: 4,
 *   ingredients: [
 *     { amount: 2, unit: "cups", name: "flour" },
 *     { amount: 1, unit: "tsp", name: "salt" },
 *   ]
 * };
 * const scaled = scale_recipe(recipe, 8);
 * ```
 */
export function scale_recipe(recipe: Recipe, newServings: number): Recipe {
  if (newServings <= 0) {
    throw new ValueError("New servings must be positive");
  }

  const scaleFactor = newServings / recipe.servings;

  // Scale each ingredient
  const scaledIngredients: Ingredient[] = recipe.ingredients.map(ingredient => {
    const ingredientCopy = { ...ingredient };
    if (ingredient.amount !== undefined) {
      ingredientCopy.amount = ingredient.amount * scaleFactor;
    }
    return ingredientCopy;
  });

  // Create new recipe with scaled ingredients
  const { servings: _, ingredients: __, ...rest } = recipe;
  const newRecipe: Recipe = {
    servings: newServings,
    ingredients: scaledIngredients,
    ...rest,
  };

  return RecipeSchema.parse(newRecipe);
}

/**
 * Custom ValueError class to match Python's ValueError behavior.
 */
export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
}
