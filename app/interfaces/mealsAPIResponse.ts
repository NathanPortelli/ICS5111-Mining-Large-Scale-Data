import { FoodMenuItem } from "./foodMenuItem";

export interface MealsAPIResponse {
  breakfast: FoodMenuItem[];
  lunch: FoodMenuItem[];
  dinner: FoodMenuItem[];
}
