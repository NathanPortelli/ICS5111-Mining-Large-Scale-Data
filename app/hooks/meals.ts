import { useEffect, useState } from "react";
import { MealsAPIResponse } from "../interfaces/mealsAPIResponse";
import { POST } from "../utils/api";
import { useUser } from "./user";

export function useMeals(totalCalories: number = 1500) {
  const { user } = useUser();
  const [meals, setMeals] = useState<MealsAPIResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    getMeals();
  }, [user]);

  const getMeals = async () => {
    const { prefBreakfast, prefLunch, prefDinner } = user!;

    await POST("/api/meals", {
      meals: {
        breakfast: prefBreakfast,
        lunch: prefLunch,
        dinner: prefDinner,
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
