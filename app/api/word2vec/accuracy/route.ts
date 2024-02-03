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

    let fullInstructions: string = "";
    let retrievedIngredients: string[] = [];

    if (Number(mealId)) {
      const spoonacularResponse = await spoonacularBaseAPI(
        `/recipes/${mealId}/information?includeNutrition=true`
      );
      const data: SpoonacularRecipeResponse = await spoonacularResponse.json();

      fullInstructions = fixSentenceSpacing(removeTags(data.instructions));
      retrievedIngredients = data.extendedIngredients.map(
        (ingredient) => ingredient.name
      );
    } else {
      const data = jamieOliverRecipesJSON!.find(
        (recipe) => recipe!.ID === mealId
      );

      if (!data) {
        return errorResponse({ message: "No recipe found" });
      }

      fullInstructions = fixSentenceSpacing(removeTags(data.RecipeSteps));
      if (Array.isArray(data.Ingredients)) {
        retrievedIngredients = data.Ingredients.filter(ingredient => ingredient.trim() !== '');
      } else {
        throw new Error("Ingredients are not an array");
      }
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

    const nonMatchingFromUniqueIngredients = uniqueIngredients.filter(
      (extractedIngredient) => {
        return !retrievedIngredients.some((originalIngredient) =>
          originalIngredient
            .toLowerCase()
            .includes(extractedIngredient.toLowerCase())
        );
      }
    );

    const nonMatchingFromOriginalIngredients = retrievedIngredients.filter(
      (originalIngredient) => {
        return !uniqueIngredients.some((extractedIngredient) =>
          originalIngredient
            .toLowerCase()
            .includes(extractedIngredient.toLowerCase())
        );
      }
    );

    const allNonMatchingIngredients = [
      ...nonMatchingFromUniqueIngredients,
      ...nonMatchingFromOriginalIngredients,
    ];

    const matchingIngredients = uniqueIngredients.filter(
      (extractedIngredient) => {
        return retrievedIngredients.some((originalIngredient) =>
          originalIngredient
            .toLowerCase()
            .includes(extractedIngredient.toLowerCase())
        );
      }
    );

    const accuracy =
      (matchingIngredients.length / retrievedIngredients.length) * 100;

    const extractedData = {
      etxractedIngredients: uniqueIngredients,
      originalIngredients: retrievedIngredients,
      nonMatchingFromOriginalIngredients,
      nonMatchingFromUniqueIngredients,
      allNonMatchingIngredients,
      accuracy: `${accuracy.toFixed(2)}%`,
    };

    return okResponse(extractedData);
  } catch (error) {
    return errorResponse({ message: error });
  }
}
