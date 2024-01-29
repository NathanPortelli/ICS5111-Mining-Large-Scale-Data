import { useEffect, useState } from "react";
import { MealsAPIResponse } from "../interfaces/mealsAPIResponse";
import { POST } from "../utils/api";
import { useUser } from "./user";
import { AlternativesMealsAPIResponse } from "../interfaces/alternativesMealsAPIResponse";
import { set } from "firebase/database";

export function useMeals(totalCalories: number = 1500) {
  const { user } = useUser();
  const [meals, setMeals] = useState<MealsAPIResponse | null>(null);

  useEffect(() => {
    if (!user) return;
    getMeals(totalCalories);
  }, [user, totalCalories]);

  const getMeals = async (total_calories: number) => {
    const { prefBreakfast, prefLunch, prefDinner } = user!;

    await POST("/api/meals", {
      meals: {
        breakfast: prefBreakfast,
        lunch: prefLunch,
        dinner: prefDinner,
      },
      total_calories: total_calories,
    })
      .then(async (response) => {
        const responseMeals = await response.json();
        setMeals(responseMeals);
      })
      .catch((error) => {
        throw new Error("Something went wrong: " + error.message);
      });
  };

  const getAlternativeMeals = async (
    title: string,
    calories: string | number
  ) => {
    const response = await POST("/api/meals/alternatives", {
      meal_title: title,
      calories: calories,
    });

    return response.json();
  };

  return {
    getMeals,
    getAlternativeMeals,
    meals,
  };
}
