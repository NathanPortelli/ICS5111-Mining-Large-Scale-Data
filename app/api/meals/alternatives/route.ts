import foundationFoodsJSON from "@/app/data/foundation_foods.json";
import jamieOliverRecipeInstructionsJSON from "@/app/data/jamie_oliver_all_recipe_instructions.json";
import jamieOliverRecipesJSON from "@/app/data/jamie_oliver_food_recipes.json";
import stopwordsJSON from "@/app/data/stopwords.json";
import { AlternativesMealRequestBody } from "@/app/interfaces/alternativesMealRequestBody";
import { FoodMenuItem } from "@/app/interfaces/foodMenuItem";
import { JORecipe } from "@/app/interfaces/jamieOliverRecipe";
import { errorResponse, okResponse } from "@/app/utils/responses";
import {
  removeWordsFromSentence,
  splitSentencesIntoWords,
} from "@/app/utils/textUtil";
import { Word2Vec } from "@/app/utils/word2vec";

function chooseThreeRandomRecipes(arr: JORecipe[]): JORecipe[] {
  if (arr.length <= 3) {
    return arr;
  } else {
    const randomIndices: number[] = [];
    while (randomIndices.length < 3) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    return randomIndices.map((index) => arr[index]);
  }
}

export async function POST(request: Request) {
  const { meal_title, calories } =
    (await request.json()) as AlternativesMealRequestBody;

  if (!meal_title) {
    return errorResponse({ message: "No meal title provided" });
  }

  if (!calories) {
    return errorResponse({ message: "No calories provided" });
  }

  const jamieOliverRecipes = jamieOliverRecipesJSON as JORecipe[];

  const filterJORecipesByCalories = jamieOliverRecipes.filter(
    (recipe: JORecipe) => {
      return Math.abs(recipe.Calories - calories) <= 50;
    }
  );

  const splitMealTitle = splitSentencesIntoWords([meal_title.toLowerCase()]);

  const stopWords: string[] = stopwordsJSON
    .map((word) => word.word)
    .filter((word): word is string => typeof word === "string");

  let titleWithoutStopWords: string[][] = [];

  splitMealTitle.forEach((title) => {
    titleWithoutStopWords.push(removeWordsFromSentence(title, stopWords));
  });

  const word2vec = new Word2Vec();

  word2vec.addSentences(titleWithoutStopWords);

  word2vec.initializeVectors();

  word2vec.trainWithSentences(jamieOliverRecipeInstructionsJSON as unknown as string[][]);

  const allFoundationFoods = foundationFoodsJSON.flatMap(
    (category) => category.items
  );

  const extractIngredients = word2vec.extractIngredients(
    allFoundationFoods,
    titleWithoutStopWords[0]
  );
  const uniqueIngredients = [...new Set(extractIngredients)];

  const filterJORecipesByUniqueIngredients = filterJORecipesByCalories.filter(
    (recipe: JORecipe) => {
      const hasMatchingWord = uniqueIngredients.some((word) =>
        recipe.Title.includes(word)
      );
      return hasMatchingWord ? recipe : null;
    }
  );

  const threeRandomRecipes = chooseThreeRandomRecipes(
    filterJORecipesByUniqueIngredients
  );

  const cleanedRecipes: FoodMenuItem[] = [];

  threeRandomRecipes.forEach((recipe) => {
    cleanedRecipes.push({
      id: recipe.ID,
      title: recipe.Title,
      image: recipe.Image,
      calories: recipe.Calories,
    });
  });

  return okResponse({ alternatives: cleanedRecipes });
}
