/**
 * Recipe scaling utility.
 */

import { z } from "zod";

/**
 * Schema for a recipe ingredient.
 * Allows extra properties to match Pydantic's extra="allow" behavior.
 */
export const IngredientSchema = z
  .object({
    amount: z.number().nullable().optional(),
    unit: z.string(),
    name: z.string(),
    note: z.string().nullable().optional(),
  })
  .passthrough();

/**
 * TypeScript type for Ingredient inferred from schema.
 */
export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * Schema for a recipe with servings and ingredients.
 * Allows extra properties to match Pydantic's extra="allow" behavior.
 */
export const RecipeSchema = z
  .object({
    servings: z
      .number()
      .int()
      .positive("Servings must be positive")
      .refine((v) => v > 0, { message: "Servings must be positive" }),
    ingredients: z.array(IngredientSchema),
    name: z.string().nullable().optional(),
    prep_time: z.string().nullable().optional(),
  })
  .passthrough();

/**
 * TypeScript type for Recipe inferred from schema.
 */
export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Scale a recipe to a different number of servings.
 *
 * @param recipe - Recipe object with servings and ingredients
 * @param new_servings - Target number of servings
 * @returns New Recipe object with scaled ingredient amounts
 *
 * @example
 * ```typescript
 * import { Recipe, Ingredient, scale_recipe } from "lethimcook";
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
export function scale_recipe(recipe: Recipe, new_servings: number): Recipe {
  if (new_servings <= 0) {
    throw new Error("New servings must be positive");
  }

  const scale_factor = new_servings / recipe.servings;

  // Scale each ingredient
  const scaled_ingredients: Ingredient[] = recipe.ingredients.map(
    (ingredient) => {
      const ingredient_copy = { ...ingredient };
      if (ingredient.amount !== null && ingredient.amount !== undefined) {
        ingredient_copy.amount = ingredient.amount * scale_factor;
      }
      return IngredientSchema.parse(ingredient_copy);
    }
  );

  // Create new recipe with scaled ingredients
  const { servings, ingredients, ...rest } = recipe;
  const new_recipe = {
    ...rest,
    servings: new_servings,
    ingredients: scaled_ingredients,
  };

  return RecipeSchema.parse(new_recipe);
}
