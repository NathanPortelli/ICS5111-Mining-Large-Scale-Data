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
        retrievedIngredients = data.Ingredients.filter(
          (ingredient) => ingredient.trim() !== ""
        );
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

    word2vec.addSentences(instructionsWithoutStopWords);

    word2vec.initializeVectors();

    word2vec.trainWithSentences(instructionsWithoutStopWords);

    const allFoundationFoods = foundationFoodsJSON.flatMap(
      (category) => category.items
    );

    const extractIngredients = word2vec.extractIngredients(
      splitInstructions,
      allFoundationFoods
    );

    const uniqueIngredients = [...new Set(extractIngredients)];
    const uniqueRetrievedIngredients = [...new Set(retrievedIngredients)];

    const nonMatchingFromUniqueIngredients = uniqueIngredients.filter(
      (extractedIngredient) => {
        return !uniqueRetrievedIngredients.some((originalIngredient) =>
          originalIngredient
            .toLowerCase()
            .includes(extractedIngredient.toLowerCase())
        );
      }
    );

    const nonMatchingFromOriginalIngredients =
      uniqueRetrievedIngredients.filter((originalIngredient) => {
        return !uniqueIngredients.some((extractedIngredient) =>
          originalIngredient
            .toLowerCase()
            .includes(extractedIngredient.toLowerCase())
        );
      });

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
      originalIngredients: uniqueRetrievedIngredients,
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
