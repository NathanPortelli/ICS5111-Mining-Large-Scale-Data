export interface JORecipe {
  ID: string;
  Title: string;
  Calories: number;
  Fat: number;
  Carbs: number | string;
  Image: string;
  RecipeSteps: string;
  Ingredients: string[];
}
