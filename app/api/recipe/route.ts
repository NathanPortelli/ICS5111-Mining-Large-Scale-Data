import jamieOliverRecipesJSON from "@/app/data/jamie_oliver_food_recipes.json";
import foundationFoodsJSON from "@/app/data/foundation_foods.json";
import stopwordsJSON from "@/app/data/stopwords.json";
import { errorResponse, okResponse } from "@/app/utils/responses";
import { spoonacularBaseAPI } from "@/app/utils/baseSpoonacular";
import {
  extractTextToArray,
  fixSentenceSpacing,
  removeTags,
  removeWordsFromSentence,
  splitSentencesIntoWords,
} from "@/app/utils/textUtil";
import { Word2Vec } from "@/app/utils/word2vec";
import { NextRequest } from "next/server";
import { JORecipe } from "@/app/interfaces/jamieOliverRecipe";
import { SpoonacularRecipeResponse } from "@/app/interfaces/spoonacularRecipeResponse";

export async function GET(request: NextRequest) {
  const url = new URL(request.url!);
  const mealId = url.searchParams.get("mealId");

  if (!mealId) {
    return errorResponse({ message: "No meal ID provided" });
  }

  try {
    const stopWords = stopwordsJSON
      .map((word) => word.word)
      .filter((word): word is string => typeof word === "string");

    const word2vec = new Word2Vec();

    foundationFoodsJSON.forEach((food) => {
      word2vec.addWords([food.target, ...food.context]);
    });

    for (let epoch = 0; epoch < 100; epoch++) {
      foundationFoodsJSON.forEach((food) => {
        word2vec.train(food.target, food.context);
      });
    }

    let id: string | number = "";
    let title: string = "";
    let image: string = "";
    let fullInstructions: string = "";
    let extractedCalories: number = 0;

    if (Number(mealId)) {
      // const spoonacularResponse = await spoonacularBaseAPI(
      //   `/recipes/${mealId}/information?includeNutrition=true`
      // );
      // const data: SpoonacularRecipeResponse = await spoonacularResponse.json();

      const data: SpoonacularRecipeResponse = {
        vegetarian: false,
        vegan: false,
        glutenFree: true,
        dairyFree: false,
        veryHealthy: false,
        cheap: false,
        veryPopular: false,
        sustainable: false,
        lowFodmap: false,
        weightWatcherSmartPoints: 10,
        gaps: "no",
        preparationMinutes: -1,
        cookingMinutes: -1,
        aggregateLikes: 1,
        healthScore: 44,
        creditsText:
          "Foodista.com – The Cooking Encyclopedia Everyone Can Edit",
        license: "CC BY 3.0",
        sourceName: "Foodista",
        pricePerServing: 171.35,
        extendedIngredients: [
          {
            id: 20040,
            aisle: "Pasta and Rice",
            image: "uncooked-brown-rice.png",
            consistency: "SOLID",
            name: "brown rice",
            nameClean: "brown rice",
            original: "2 cups Brown Rice or Quinoa",
            originalName: "Brown Rice or Quinoa",
            amount: 2,
            unit: "cups",
            meta: [],
            measures: {
              us: {
                amount: 2,
                unitShort: "cups",
                unitLong: "cups",
              },
              metric: {
                amount: 380,
                unitShort: "g",
                unitLong: "grams",
              },
            },
          },
          {
            id: 1001,
            aisle: "Milk, Eggs, Other Dairy",
            image: "butter-sliced.jpg",
            consistency: "SOLID",
            name: "butter",
            nameClean: "butter",
            original: "2 tablespoons butter",
            originalName: "butter",
            amount: 2,
            unit: "tablespoons",
            meta: [],
            measures: {
              us: {
                amount: 2,
                unitShort: "Tbsps",
                unitLong: "Tbsps",
              },
              metric: {
                amount: 2,
                unitShort: "Tbsps",
                unitLong: "Tbsps",
              },
            },
          },
          {
            id: 10211215,
            aisle: "Produce",
            image: "garlic.jpg",
            consistency: "SOLID",
            name: "garlic cloves",
            nameClean: "whole garlic cloves",
            original: "4 Garlic Cloves, chopped",
            originalName: "Garlic Cloves, chopped",
            amount: 4,
            unit: "",
            meta: ["chopped"],
            measures: {
              us: {
                amount: 4,
                unitShort: "",
                unitLong: "",
              },
              metric: {
                amount: 4,
                unitShort: "",
                unitLong: "",
              },
            },
          },
          {
            id: 9152,
            aisle: "Produce",
            image: "lemon-juice.jpg",
            consistency: "LIQUID",
            name: "juice of lemon",
            nameClean: "lemon juice",
            original: "Juice of 1/2 lemon",
            originalName: "Juice lemon",
            amount: 0.5,
            unit: "",
            meta: [],
            measures: {
              us: {
                amount: 0.5,
                unitShort: "",
                unitLong: "",
              },
              metric: {
                amount: 0.5,
                unitShort: "",
                unitLong: "",
              },
            },
          },
          {
            id: 10011457,
            aisle: "Produce",
            image: "spinach.jpg",
            consistency: "SOLID",
            name: "kale",
            nameClean: "spinach",
            original: "1 bunch Kale or spinach",
            originalName: "Kale or spinach",
            amount: 1,
            unit: "bunch",
            meta: [],
            measures: {
              us: {
                amount: 1,
                unitShort: "bunch",
                unitLong: "bunch",
              },
              metric: {
                amount: 1,
                unitShort: "bunch",
                unitLong: "bunch",
              },
            },
          },
          {
            id: 11282,
            aisle: "Produce",
            image: "brown-onion.png",
            consistency: "SOLID",
            name: "onion",
            nameClean: "onion",
            original: "1 small onion finely chopped",
            originalName: "onion finely chopped",
            amount: 1,
            unit: "small",
            meta: ["finely chopped"],
            measures: {
              us: {
                amount: 1,
                unitShort: "small",
                unitLong: "small",
              },
              metric: {
                amount: 1,
                unitShort: "small",
                unitLong: "small",
              },
            },
          },
          {
            id: 1102047,
            aisle: "Spices and Seasonings",
            image: "salt-and-pepper.jpg",
            consistency: "SOLID",
            name: "salt and pepper",
            nameClean: "salt and pepper",
            original: "Salt and Pepper to taste",
            originalName: "Salt and Pepper to taste",
            amount: 6,
            unit: "servings",
            meta: ["to taste"],
            measures: {
              us: {
                amount: 6,
                unitShort: "servings",
                unitLong: "servings",
              },
              metric: {
                amount: 6,
                unitShort: "servings",
                unitLong: "servings",
              },
            },
          },
          {
            id: 5096,
            aisle: "Meat",
            image: "chicken-thighs.png",
            consistency: "SOLID",
            name: "chicken thighs",
            nameClean: "boneless skinless chicken thighs",
            original: "6 skinless chicken thighs",
            originalName: "skinless chicken thighs",
            amount: 6,
            unit: "",
            meta: ["skinless"],
            measures: {
              us: {
                amount: 6,
                unitShort: "",
                unitLong: "",
              },
              metric: {
                amount: 6,
                unitShort: "",
                unitLong: "",
              },
            },
          },
          {
            id: 14412,
            aisle: "Beverages",
            image: "water.png",
            consistency: "LIQUID",
            name: "water",
            nameClean: "water",
            original: "4 cups water or stock",
            originalName: "water or stock",
            amount: 4,
            unit: "cups",
            meta: [],
            measures: {
              us: {
                amount: 4,
                unitShort: "cups",
                unitLong: "cups",
              },
              metric: {
                amount: 946.352,
                unitShort: "ml",
                unitLong: "milliliters",
              },
            },
          },
        ],
        id: 638148,
        title: "Chicken Kale Bake",
        readyInMinutes: 45,
        servings: 6,
        sourceUrl: "http://www.foodista.com/recipe/PT88VTHS/chicken-kale-bake",
        image: "https://spoonacular.com/recipeImages/638148-556x370.jpg",
        imageType: "jpg",
        nutrition: {
          nutrients: [
            {
              name: "Calories",
              amount: 418.43,
              unit: "kcal",
              percentOfDailyNeeds: 20.92,
            },
            {
              name: "Fat",
              amount: 10.38,
              unit: "g",
              percentOfDailyNeeds: 15.96,
            },
            {
              name: "Saturated Fat",
              amount: 3.95,
              unit: "g",
              percentOfDailyNeeds: 24.66,
            },
            {
              name: "Carbohydrates",
              amount: 52.23,
              unit: "g",
              percentOfDailyNeeds: 17.41,
            },
            {
              name: "Net Carbohydrates",
              amount: 48.58,
              unit: "g",
              percentOfDailyNeeds: 17.66,
            },
            {
              name: "Sugar",
              amount: 0.82,
              unit: "g",
              percentOfDailyNeeds: 0.91,
            },
            {
              name: "Cholesterol",
              amount: 117.38,
              unit: "mg",
              percentOfDailyNeeds: 39.13,
            },
            {
              name: "Sodium",
              amount: 380.38,
              unit: "mg",
              percentOfDailyNeeds: 16.54,
            },
            {
              name: "Protein",
              amount: 28.44,
              unit: "g",
              percentOfDailyNeeds: 56.88,
            },
            {
              name: "Vitamin K",
              amount: 277.38,
              unit: "µg",
              percentOfDailyNeeds: 264.18,
            },
            {
              name: "Manganese",
              amount: 2.95,
              unit: "mg",
              percentOfDailyNeeds: 147.31,
            },
            {
              name: "Vitamin A",
              amount: 5457.94,
              unit: "IU",
              percentOfDailyNeeds: 109.16,
            },
            {
              name: "Vitamin B6",
              amount: 0.98,
              unit: "mg",
              percentOfDailyNeeds: 48.79,
            },
            {
              name: "Vitamin B3",
              amount: 9.48,
              unit: "mg",
              percentOfDailyNeeds: 47.41,
            },
            {
              name: "Phosphorus",
              amount: 414.04,
              unit: "mg",
              percentOfDailyNeeds: 41.4,
            },
            {
              name: "Magnesium",
              amount: 164.82,
              unit: "mg",
              percentOfDailyNeeds: 41.2,
            },
            {
              name: "Selenium",
              amount: 26.5,
              unit: "µg",
              percentOfDailyNeeds: 37.85,
            },
            {
              name: "Folate",
              amount: 130.04,
              unit: "µg",
              percentOfDailyNeeds: 32.51,
            },
            {
              name: "Vitamin B1",
              amount: 0.42,
              unit: "mg",
              percentOfDailyNeeds: 27.84,
            },
            {
              name: "Vitamin B5",
              amount: 2.37,
              unit: "mg",
              percentOfDailyNeeds: 23.73,
            },
            {
              name: "Potassium",
              amount: 791.57,
              unit: "mg",
              percentOfDailyNeeds: 22.62,
            },
            {
              name: "Zinc",
              amount: 3.36,
              unit: "mg",
              percentOfDailyNeeds: 22.41,
            },
            {
              name: "Vitamin C",
              amount: 18.38,
              unit: "mg",
              percentOfDailyNeeds: 22.28,
            },
            {
              name: "Iron",
              amount: 3.64,
              unit: "mg",
              percentOfDailyNeeds: 20.24,
            },
            {
              name: "Vitamin B2",
              amount: 0.34,
              unit: "mg",
              percentOfDailyNeeds: 20.1,
            },
            {
              name: "Copper",
              amount: 0.35,
              unit: "mg",
              percentOfDailyNeeds: 17.43,
            },
            {
              name: "Fiber",
              amount: 3.65,
              unit: "g",
              percentOfDailyNeeds: 14.59,
            },
            {
              name: "Vitamin B12",
              amount: 0.73,
              unit: "µg",
              percentOfDailyNeeds: 12.19,
            },
            {
              name: "Calcium",
              amount: 99.6,
              unit: "mg",
              percentOfDailyNeeds: 9.96,
            },
            {
              name: "Vitamin E",
              amount: 1.47,
              unit: "mg",
              percentOfDailyNeeds: 9.8,
            },
          ],
          properties: [
            {
              name: "Glycemic Index",
              amount: 32.96,
              unit: "",
            },
            {
              name: "Glycemic Load",
              amount: 27.76,
              unit: "",
            },
            {
              name: "Inflammation Score",
              amount: -10,
              unit: "",
            },
            {
              name: "Nutrition Score",
              amount: 33.5804347826087,
              unit: "%",
            },
          ],
          flavonoids: [
            {
              name: "Cyanidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Petunidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Delphinidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Malvidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Pelargonidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Peonidin",
              amount: 0,
              unit: "",
            },
            {
              name: "Catechin",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Epigallocatechin",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Epicatechin",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Epicatechin 3-gallate",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Epigallocatechin 3-gallate",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Theaflavin",
              amount: 0,
              unit: "",
            },
            {
              name: "Thearubigins",
              amount: 0,
              unit: "",
            },
            {
              name: "Eriodictyol",
              amount: 0.12,
              unit: "mg",
            },
            {
              name: "Hesperetin",
              amount: 0.36,
              unit: "mg",
            },
            {
              name: "Naringenin",
              amount: 0.03,
              unit: "mg",
            },
            {
              name: "Apigenin",
              amount: 0,
              unit: "mg",
            },
            {
              name: "Luteolin",
              amount: 0.42,
              unit: "mg",
            },
            {
              name: "Isorhamnetin",
              amount: 0.58,
              unit: "mg",
            },
            {
              name: "Kaempferol",
              amount: 3.7,
              unit: "mg",
            },
            {
              name: "Myricetin",
              amount: 0.23,
              unit: "mg",
            },
            {
              name: "Quercetin",
              amount: 4.66,
              unit: "mg",
            },
            {
              name: "Theaflavin-3,3'-digallate",
              amount: 0,
              unit: "",
            },
            {
              name: "Theaflavin-3'-gallate",
              amount: 0,
              unit: "",
            },
            {
              name: "Theaflavin-3-gallate",
              amount: 0,
              unit: "",
            },
            {
              name: "Gallocatechin",
              amount: 0,
              unit: "mg",
            },
          ],
          ingredients: [
            {
              id: 20040,
              name: "brown rice",
              amount: 0.33,
              unit: "cups",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 90.57,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 4.75,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 0,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Folate",
                  amount: 12.67,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 1.7,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 1.14,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 2.15,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 2.53,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0.34,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 46.09,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0.26,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0.18,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 20.9,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 167.2,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Manganese",
                  amount: 2.37,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0.61,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Zinc",
                  amount: 1.28,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Vitamin B6",
                  amount: 0.32,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0.61,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Potassium",
                  amount: 169.73,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin B2",
                  amount: 0.03,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Calories",
                  amount: 229.27,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 48.24,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0.95,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Vitamin B3",
                  amount: 2.73,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Vitamin C",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 1001,
              name: "butter",
              amount: 0.33,
              unit: "tablespoons",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 0.09,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 0.04,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 116.62,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 0.33,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 0.14,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 3.78,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 30.01,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 2.4,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 1.12,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 1.12,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0.14,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Manganese",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0.98,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Trans Fat",
                  amount: 0.15,
                  unit: "g",
                  percentOfDailyNeeds: 1733.13,
                },
                {
                  name: "Vitamin B6",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B2",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Potassium",
                  amount: 1.12,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0.11,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Calories",
                  amount: 33.46,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 10.03,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 0.88,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0.01,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0.05,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Fluoride",
                  amount: 0.13,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Sugar",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 10211215,
              name: "garlic cloves",
              amount: 0.67,
              unit: "",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 0.5,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 0.13,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 0.18,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 0.03,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 0.06,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0.03,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0.04,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 0.34,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0.62,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 3.62,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 3.06,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Manganese",
                  amount: 0.03,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B6",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Potassium",
                  amount: 8.02,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Vitamin B2",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Calories",
                  amount: 2.98,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0.66,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 0.46,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0.28,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Sugar",
                  amount: 0.02,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0.62,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 9152,
              name: "juice of lemon",
              amount: 0.08,
              unit: "",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 0.15,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 0.15,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 0.5,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 0.03,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0.17,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 0.15,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 0.2,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Manganese",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Trans Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 1733.13,
                },
                {
                  name: "Vitamin B6",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Potassium",
                  amount: 2.58,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Vitamin B2",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Calories",
                  amount: 0.55,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0.17,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 0.13,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Sugar",
                  amount: 0.06,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0.97,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 10011457,
              name: "kale",
              amount: 0.17,
              unit: "bunch",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 44.77,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 1.62,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 5313.63,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 273.7,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 109.93,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 0.22,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 1.54,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 1.25,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 44.77,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0.04,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0.81,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0.04,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0.07,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 56.1,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 27.77,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Manganese",
                  amount: 0.51,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0.09,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B6",
                  amount: 0.11,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0.3,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Potassium",
                  amount: 316.2,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 1.15,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Vitamin B2",
                  amount: 0.11,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Calories",
                  amount: 13.03,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 2.06,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 10.94,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0.04,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0.57,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0.41,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Sugar",
                  amount: 0.24,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 15.92,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 11282,
              name: "onion",
              amount: 0.17,
              unit: "small",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 1.17,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 0.13,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 0.23,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 0.05,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 2.22,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 0.01,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0.2,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 0.47,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0.89,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 2.68,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 3.38,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Manganese",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B6",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B2",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Potassium",
                  amount: 17.03,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Calories",
                  amount: 4.67,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 1.09,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 0.71,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0.06,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Fluoride",
                  amount: 0.13,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Sugar",
                  amount: 0.49,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0.86,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 1102047,
              name: "salt and pepper",
              amount: 1,
              unit: "servings",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 0,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 193.79,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 0.12,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Manganese",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B6",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B2",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Potassium",
                  amount: 0.04,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Calories",
                  amount: 0,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Fluoride",
                  amount: 0.01,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Sugar",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 5096,
              name: "chicken thighs",
              amount: 1,
              unit: "",
              nutrients: [
                {
                  name: "Magnesium",
                  amount: 25.99,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
                {
                  name: "Protein",
                  amount: 21.76,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Vitamin A",
                  amount: 27.12,
                  unit: "IU",
                  percentOfDailyNeeds: 109.16,
                },
                {
                  name: "Vitamin K",
                  amount: 3.28,
                  unit: "µg",
                  percentOfDailyNeeds: 264.18,
                },
                {
                  name: "Folate",
                  amount: 4.52,
                  unit: "µg",
                  percentOfDailyNeeds: 32.51,
                },
                {
                  name: "Fat",
                  amount: 4.64,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0.9,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 100.57,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Saturated Fat",
                  amount: 1.16,
                  unit: "g",
                  percentOfDailyNeeds: 24.66,
                },
                {
                  name: "Lycopene",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Vitamin B1",
                  amount: 0.1,
                  unit: "mg",
                  percentOfDailyNeeds: 27.84,
                },
                {
                  name: "Copper",
                  amount: 0.06,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Calcium",
                  amount: 10.17,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Phosphorus",
                  amount: 211.31,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Poly Unsaturated Fat",
                  amount: 1.03,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Manganese",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Mono Unsaturated Fat",
                  amount: 1.61,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Trans Fat",
                  amount: 0.02,
                  unit: "g",
                  percentOfDailyNeeds: 1733.13,
                },
                {
                  name: "Vitamin B6",
                  amount: 0.5,
                  unit: "mg",
                  percentOfDailyNeeds: 48.79,
                },
                {
                  name: "Zinc",
                  amount: 1.72,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Folic Acid",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Potassium",
                  amount: 276.85,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Vitamin E",
                  amount: 0.2,
                  unit: "mg",
                  percentOfDailyNeeds: 9.8,
                },
                {
                  name: "Vitamin B2",
                  amount: 0.2,
                  unit: "mg",
                  percentOfDailyNeeds: 20.1,
                },
                {
                  name: "Calories",
                  amount: 134.47,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Cholesterol",
                  amount: 107.35,
                  unit: "mg",
                  percentOfDailyNeeds: 39.13,
                },
                {
                  name: "Vitamin D",
                  amount: 0,
                  unit: "µg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Caffeine",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Choline",
                  amount: 60.57,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B12",
                  amount: 0.72,
                  unit: "µg",
                  percentOfDailyNeeds: 12.19,
                },
                {
                  name: "Alcohol",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Vitamin B5",
                  amount: 1.36,
                  unit: "mg",
                  percentOfDailyNeeds: 23.73,
                },
                {
                  name: "Selenium",
                  amount: 25.54,
                  unit: "µg",
                  percentOfDailyNeeds: 37.85,
                },
                {
                  name: "Vitamin B3",
                  amount: 6.31,
                  unit: "mg",
                  percentOfDailyNeeds: 47.41,
                },
                {
                  name: "Sugar",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 0.91,
                },
                {
                  name: "Vitamin C",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.28,
                },
              ],
            },
            {
              id: 14412,
              name: "water",
              amount: 0.67,
              unit: "cups",
              nutrients: [
                {
                  name: "Calcium",
                  amount: 4.73,
                  unit: "mg",
                  percentOfDailyNeeds: 9.96,
                },
                {
                  name: "Protein",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 56.88,
                },
                {
                  name: "Manganese",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 147.31,
                },
                {
                  name: "Zinc",
                  amount: 0.02,
                  unit: "mg",
                  percentOfDailyNeeds: 22.41,
                },
                {
                  name: "Potassium",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 22.62,
                },
                {
                  name: "Calories",
                  amount: 0,
                  unit: "kcal",
                  percentOfDailyNeeds: 20.92,
                },
                {
                  name: "Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.41,
                },
                {
                  name: "Fat",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 15.96,
                },
                {
                  name: "Iron",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 20.24,
                },
                {
                  name: "Fiber",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 14.59,
                },
                {
                  name: "Sodium",
                  amount: 7.89,
                  unit: "mg",
                  percentOfDailyNeeds: 16.54,
                },
                {
                  name: "Net Carbohydrates",
                  amount: 0,
                  unit: "g",
                  percentOfDailyNeeds: 17.66,
                },
                {
                  name: "Fluoride",
                  amount: 40.69,
                  unit: "mg",
                  percentOfDailyNeeds: 0,
                },
                {
                  name: "Copper",
                  amount: 0.03,
                  unit: "mg",
                  percentOfDailyNeeds: 17.43,
                },
                {
                  name: "Phosphorus",
                  amount: 0,
                  unit: "mg",
                  percentOfDailyNeeds: 41.4,
                },
                {
                  name: "Magnesium",
                  amount: 1.58,
                  unit: "mg",
                  percentOfDailyNeeds: 41.2,
                },
              ],
            },
          ],
          caloricBreakdown: {
            percentProtein: 27.34,
            percentFat: 22.44,
            percentCarbs: 50.22,
          },
          weightPerServing: {
            amount: 412,
            unit: "g",
          },
        },
        summary:
          'Chicken Kale Bake is a main course that serves 6. For <b>$1.71 per serving</b>, this recipe <b>covers 33%</b> of your daily requirements of vitamins and minerals. One portion of this dish contains about <b>28g of protein</b>, <b>10g of fat</b>, and a total of <b>418 calories</b>. 1 person has tried and liked this recipe. Head to the store and pick up brown rice, juice of lemon, onion, and a few other things to make it today. From preparation to the plate, this recipe takes about <b>45 minutes</b>. It is brought to you by Foodista. It is a good option if you\'re following a <b>gluten free</b> diet. With a spoonacular <b>score of 77%</b>, this dish is solid. Similar recipes include <a href="https://spoonacular.com/recipes/chicken-kale-bake-1234049">Chicken Kale Bake</a>, <a href="https://spoonacular.com/recipes/chicken-thighs-with-sweet-potatoes-and-kale-bake-1170323">Chicken Thighs with Sweet Potatoes and Kale Bake</a>, and <a href="https://spoonacular.com/recipes/chicken-thighs-with-sweet-potatoes-corn-and-kale-bake-616502">Chicken Thighs with Sweet Potatoes Corn and Kale Bake</a>.',
        cuisines: [],
        dishTypes: ["lunch", "main course", "main dish", "dinner"],
        diets: ["gluten free"],
        occasions: [],
        winePairing: {
          pairedWines: [],
          pairingText: "",
          productMatches: [],
        },
        instructions:
          "<ol><li>Combine first seven ingredients in a dutch oven</li><li>Bake at 350 degrees for 1 hour</li><li>While\n the chicken and rice is in the oven finely chop the kale.</li><li>After the chiken and rice has been cooking for about an hour take the chicken out of the pot and reserve on a platter under tin foil</li><li>Mix the kale into the rice and add a little more hot water and replace in the oven for another 10 min.</li><li>Heap the rice on the center of a platter and place chicken on top.</li><li>Squeeze lemon juice over the top and serve.</li></ol>",
        analyzedInstructions: [
          {
            name: "",
            steps: [
              {
                number: 1,
                step: "Combine first seven ingredients in a dutch oven",
                ingredients: [],
                equipment: [
                  {
                    id: 404667,
                    name: "dutch oven",
                    localizedName: "dutch oven",
                    image: "dutch-oven.jpg",
                  },
                ],
              },
              {
                number: 2,
                step: "Bake at 350 degrees for 1 hour",
                ingredients: [],
                equipment: [
                  {
                    id: 404784,
                    name: "oven",
                    localizedName: "oven",
                    image: "oven.jpg",
                  },
                ],
              },
              {
                number: 3,
                step: "While the chicken and rice is in the oven finely chop the kale.After the chiken and rice has been cooking for about an hour take the chicken out of the pot and reserve on a platter under tin foil",
                ingredients: [
                  {
                    id: 0,
                    name: "chicken",
                    localizedName: "chicken",
                    image: "whole-chicken.jpg",
                  },
                  {
                    id: 11233,
                    name: "kale",
                    localizedName: "kale",
                    image: "kale.jpg",
                  },
                  {
                    id: 20444,
                    name: "rice",
                    localizedName: "rice",
                    image: "uncooked-white-rice.png",
                  },
                ],
                equipment: [
                  {
                    id: 404765,
                    name: "aluminum foil",
                    localizedName: "aluminum foil",
                    image: "aluminum-foil.png",
                  },
                  {
                    id: 404784,
                    name: "oven",
                    localizedName: "oven",
                    image: "oven.jpg",
                  },
                  {
                    id: 404752,
                    name: "pot",
                    localizedName: "pot",
                    image: "stock-pot.jpg",
                  },
                ],
              },
              {
                number: 4,
                step: "Mix the kale into the rice and add a little more hot water and replace in the oven for another 10 min.Heap the rice on the center of a platter and place chicken on top.Squeeze lemon juice over the top and serve.",
                ingredients: [
                  {
                    id: 9152,
                    name: "lemon juice",
                    localizedName: "lemon juice",
                    image: "lemon-juice.jpg",
                  },
                  {
                    id: 0,
                    name: "chicken",
                    localizedName: "chicken",
                    image: "whole-chicken.jpg",
                  },
                  {
                    id: 14412,
                    name: "water",
                    localizedName: "water",
                    image: "water.png",
                  },
                  {
                    id: 11233,
                    name: "kale",
                    localizedName: "kale",
                    image: "kale.jpg",
                  },
                  {
                    id: 20444,
                    name: "rice",
                    localizedName: "rice",
                    image: "uncooked-white-rice.png",
                  },
                ],
                equipment: [
                  {
                    id: 404784,
                    name: "oven",
                    localizedName: "oven",
                    image: "oven.jpg",
                  },
                ],
                length: {
                  number: 10,
                  unit: "minutes",
                },
              },
            ],
          },
        ],
        originalId: null,
        spoonacularScore: 82.72515106201172,
        spoonacularSourceUrl:
          "https://spoonacular.com/chicken-kale-bake-638148",
      };

      id = data.id;
      title = data.title;
      image = data.image;
      fullInstructions = fixSentenceSpacing(removeTags(data.instructions));
      extractedCalories =
        data.nutrition.nutrients.find(
          (nutrient) => nutrient.name.toLowerCase() === "calories"
        )?.amount || 0;
    } else {
      const data: JORecipe | undefined = jamieOliverRecipesJSON!.find(
        (recipe) => recipe!.Id === mealId
      );

      if (!data) {
        return errorResponse({ message: "No recipe found" });
      }

      id = data.Id;
      title = data.Title;
      extractedCalories = data.Calories;
      image = data.Image;
      fullInstructions = fixSentenceSpacing(removeTags(data.RecipeSteps));
      extractedCalories = data.Calories;
    }

    const splitInstructions = extractTextToArray(fullInstructions);

    const instructionsToWords = splitSentencesIntoWords(splitInstructions);

    let instructionsWithoutStopWords: string[][] = [];

    instructionsToWords.forEach((instruction) => {
      instructionsWithoutStopWords.push(
        removeWordsFromSentence(instruction, stopWords)
      );
    });

    const foundIngredients: string[] = [];

    instructionsWithoutStopWords.forEach((instruction) => {
      instruction.forEach((word) => {
        if (word2vec.hasWord(word)) {
          foundIngredients.push(word);
        }
      });
    });

    const uniqueIngredients = [...new Set(foundIngredients)];

    const extractedData = {
      id,
      title,
      image,
      instructions: {
        full: fullInstructions,
        split: splitInstructions,
      },
      ingredients: uniqueIngredients,
      calories: extractedCalories ? Math.round(extractedCalories) : null,
    };

    return okResponse(extractedData);
  } catch (error) {
    return errorResponse({ message: error });
  }
}
