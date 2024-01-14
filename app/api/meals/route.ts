import { MealRequestBody, MealFoods } from "@/app/interfaces/mealRequestBody";
import { spoonacularBaseAPI } from "@/app/utils/baseSpoonacular";
import { errorResponse, okResponse } from "@/app/utils/responses";

export async function POST(request: Request) {
  const { meals, total_calories } = (await request.json()) as MealRequestBody;

  const numberOfMeals = Object.keys(meals).length;

  if (!meals || numberOfMeals === 0) {
    return errorResponse({ message: "No meal data provided" });
  }

  if (!total_calories) {
    return errorResponse({ message: "No total calories data provided" });
  }

  try {
    let generatedMealPlan = {};

    for (const meal in meals) {
      const mealFood = meals[meal as keyof MealFoods];

      let caloriesPerMeal = 0;

      if (numberOfMeals === 3) {
        switch (meal) {
          case "breakfast":
            caloriesPerMeal = total_calories * 0.2;
            break;
          case "lunch":
            caloriesPerMeal = total_calories * 0.5;
            break;
          case "dinner": 
            caloriesPerMeal = total_calories * 0.3;
            break;
          default:
            caloriesPerMeal = total_calories * 0.1;
            break;
        }
      } else {
        caloriesPerMeal = total_calories / numberOfMeals;
      }
      //TO REVERT BEFORE TESTING

      // const spoonacularResponse = await spoonacularBaseAPI(
      //   `/recipes/complexSearch?query=${mealFood}&maxCalories=${caloriesPerMeal}&minCalories=${
      //     caloriesPerMeal - 100
      //   }&number=3`
      // );
      // const data = await spoonacularResponse.json();

      const data = {
        results: [
          {
            id: 638174,
            title: "Chicken Lo Mein",
            image: "https://spoonacular.com/recipeImages/638174-312x231.jpg",
            imageType: "jpg",
            nutrition: {
              nutrients: [
                {
                  name: "Calories",
                  amount: 401.421,
                  unit: "kcal",
                },
              ],
            },
          },
          {
            id: 638257,
            title: "Chicken Porridge",
            image: "https://spoonacular.com/recipeImages/638257-312x231.jpg",
            imageType: "jpg",
            nutrition: {
              nutrients: [
                {
                  name: "Calories",
                  amount: 393.05,
                  unit: "kcal",
                },
              ],
            },
          },
          {
            id: 638148,
            title: "Chicken Kale Bake",
            image: "https://spoonacular.com/recipeImages/638148-312x231.jpg",
            imageType: "jpg",
            nutrition: {
              nutrients: [
                {
                  name: "Calories",
                  amount: 418.427,
                  unit: "kcal",
                },
              ],
            },
          },
        ],
        offset: 0,
        number: 3,
        totalResults: 161,
      };

      const mealData = data.results.map((result) => ({
        id: result.id,
        title: result.title,
        image: result.image,
        calories: Math.round(result.nutrition.nutrients[0].amount),
      }));

      generatedMealPlan = {
        ...generatedMealPlan,
        [meal]: mealData,
      };
    }

    return okResponse(generatedMealPlan);
  } catch (error) {
    return errorResponse({ message: error });
  }
}
