/**
 * Recipe scaling utility.
 */

import { z } from 'zod';

/**
 * A recipe ingredient.
 */
export const IngredientSchema = z.object({
  amount: z.number().optional(),
  unit: z.string(),
  name: z.string(),
  note: z.string().optional(),
}).passthrough();

export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * A recipe with servings and ingredients.
 */
export const RecipeSchema = z.object({
  servings: z.number().int().positive({
    message: "Servings must be positive"
  }),
  ingredients: z.array(IngredientSchema),
  name: z.string().optional(),
  prep_time: z.string().optional(),
}).passthrough();

export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Scale a recipe to a different number of servings.
 *
 * @param recipe - Recipe object with servings and ingredients
 * @param newServings - Target number of servings
 * @returns New Recipe object with scaled ingredient amounts
 *
 * @example
 * ```typescript
 * import { Recipe, Ingredient, scale_recipe } from 'lethimcook';
 *
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
  const scaledIngredients: Ingredient[] = recipe.ingredients.map((ingredient) => {
    const ingredientCopy = { ...ingredient };
    if (ingredient.amount !== undefined) {
      ingredientCopy.amount = ingredient.amount * scaleFactor;
    }
    return ingredientCopy;
  });

  // Create new recipe with scaled ingredients
  const { servings, ingredients, ...rest } = recipe;

  return {
    ...rest,
    servings: newServings,
    ingredients: scaledIngredients,
  };
}

/**
 * Custom error class for value errors.
 */
export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValueError';
  }
}
