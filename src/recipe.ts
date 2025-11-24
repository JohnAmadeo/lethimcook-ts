import { z } from "zod";

/**
 * Schema and type for a recipe ingredient.
 */
export const IngredientSchema = z
  .object({
    amount: z.number().optional(),
    unit: z.string(),
    name: z.string(),
    note: z.string().optional(),
  })
  .passthrough();

export type Ingredient = z.infer<typeof IngredientSchema>;

/**
 * Schema and type for a recipe.
 */
export const RecipeSchema = z
  .object({
    servings: z.number().int().positive(),
    ingredients: z.array(IngredientSchema),
    name: z.string().optional(),
    prep_time: z.string().optional(),
  })
  .passthrough();

export type Recipe = z.infer<typeof RecipeSchema>;

/**
 * Scale a recipe to a different number of servings.
 *
 * Args:
 *   recipe: Recipe object with servings and ingredients
 *   new_servings: Target number of servings
 *
 * Returns:
 *   New Recipe object with scaled ingredient amounts
 *
 * Example:
 *   const recipe = {
 *     servings: 4,
 *     ingredients: [
 *       { amount: 2, unit: "cups", name: "flour" },
 *       { amount: 1, unit: "tsp", name: "salt" },
 *     ]
 *   };
 *   const scaled = scale_recipe(recipe, 8);
 */
export function scale_recipe(recipe: Recipe, new_servings: number): Recipe {
  if (new_servings <= 0) {
    throw new Error("New servings must be positive");
  }

  const scale_factor = new_servings / recipe.servings;

  // Scale each ingredient
  const scaled_ingredients: Ingredient[] = recipe.ingredients.map((ingredient) => {
    const scaled_ingredient = { ...ingredient };
    if (ingredient.amount !== undefined && ingredient.amount !== null) {
      scaled_ingredient.amount = ingredient.amount * scale_factor;
    }
    return scaled_ingredient;
  });

  // Create new recipe with scaled ingredients
  const new_recipe: Recipe = {
    ...recipe,
    servings: new_servings,
    ingredients: scaled_ingredients,
  };

  return new_recipe;
}
