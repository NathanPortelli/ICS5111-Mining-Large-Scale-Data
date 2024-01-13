export interface MealFoods {
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
}

export interface MealRequestBody {
  meals: MealFoods;
  total_calories: number;
}
