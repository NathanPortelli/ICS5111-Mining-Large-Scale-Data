import { useEffect, useState } from "react";
import { POST } from "../utils/api";
import { MealsAPIResponse } from "../interfaces/mealsAPIResponse";
import { fetchUserFoodPreferences } from "../utils/user";

export function useMeals(totalCalories: number = 1500) {
  const [meals, setMeals] = useState<MealsAPIResponse | null>(null);

  useEffect(() => {
    getMeals();
  }, []);

  const getMeals = async () => {
    const userFoodPreferences = await fetchUserFoodPreferences();

    await POST("/api/meals", {
      meals: {
        breakfast: userFoodPreferences?.prefBreakfast,
        lunch: userFoodPreferences?.prefLunch,
        dinner: userFoodPreferences?.prefDinner,
      },
      total_calories: totalCalories,
    })
      .then(async (response) => {
        const responseMeals = await response.json();
        setMeals(responseMeals);
      })
      .catch((error) => {
        throw new Error("Something went wrong: " + error.message);
      });
  };

  return {
    getMeals,
    meals,
  };
}
