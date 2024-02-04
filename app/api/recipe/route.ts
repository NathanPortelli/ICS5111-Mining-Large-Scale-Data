import foundationFoodsJSON from "@/app/data/foundation_foods.json";
import jamieOliverRecipeInstructionsJSON from "@/app/data/jamie_oliver_all_recipe_instructions.json";
import jamieOliverRecipesJSON from "@/app/data/jamie_oliver_food_recipes.json";
import stopwordsJSON from "@/app/data/stopwords.json";
import { SpoonacularRecipeResponse } from "@/app/interfaces/spoonacularRecipeResponse";
import { spoonacularBaseAPI } from "@/app/utils/baseSpoonacular";
import { errorResponse, okResponse } from "@/app/utils/responses";
import {
  extractTextToArray,
  fixSentenceSpacing,
  removeTags,
  removeWordsFromSentence,
  splitSentencesIntoWords,
} from "@/app/utils/textUtil";
import { Word2Vec } from "@/app/utils/word2vec";
import { NextRequest } from "next/server";

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

    let id: string | number = "";
    let title: string = "";
    let image: string = "";
    let fullInstructions: string = "";
    let extractedCalories: number = 0;

    if (Number(mealId)) {
      const spoonacularResponse = await spoonacularBaseAPI(
        `/recipes/${mealId}/information?includeNutrition=true`
      );
      const data: SpoonacularRecipeResponse = await spoonacularResponse.json();

      id = data.id;
      title = data.title;
      image = data.image;
      fullInstructions = fixSentenceSpacing(removeTags(data.instructions));
      extractedCalories =
        data.nutrition.nutrients.find(
          (nutrient) => nutrient.name.toLowerCase() === "calories"
        )?.amount || 0;
    } else {
      const data = jamieOliverRecipesJSON!.find(
        (recipe) => recipe!.ID === mealId
      );

      if (!data) {
        return errorResponse({ message: "No recipe found" });
      }

      id = data.ID;
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

    word2vec.addSentences(instructionsWithoutStopWords);

    word2vec.initializeVectors();

    word2vec.trainWithSentences(jamieOliverRecipeInstructionsJSON as unknown as string[][]);

    const allFoundationFoods = foundationFoodsJSON.flatMap(
      (category) => category.items
    );

    const extractIngredients = word2vec.extractIngredients(
      splitInstructions,
      allFoundationFoods
    );

    const uniqueIngredients = [...new Set(extractIngredients)];

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
