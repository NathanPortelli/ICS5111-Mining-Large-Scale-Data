import foundationFoodsJSON from "@/app/data/foundation_foods.json";
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

  const splitMealTitle = splitSentencesIntoWords([meal_title]);

  const stopWords: string[] = stopwordsJSON.map((word) => word.word).filter((word): word is string => typeof word === 'string');

  let titleWithoutStopWords: string[][] = [];

  splitMealTitle.forEach((title) => {
    titleWithoutStopWords.push(removeWordsFromSentence(title, stopWords));
  });

  const word2vec = new Word2Vec();

  foundationFoodsJSON.forEach((food) => {
    word2vec.addWords([food.target, ...food.context]);
  });

  for (let epoch = 0; epoch < 100; epoch++) {
    foundationFoodsJSON.forEach((food) => {
      word2vec.train(food.target, food.context);
    });
  }

  const foundIngredients: string[] = [];

  titleWithoutStopWords.forEach((title) => {
    title.forEach((word) => {
      if (word2vec.hasWord(word.toLowerCase())) {
        foundIngredients.push(word.toLowerCase());
      }
    });
  });

  const uniqueIngredients = [...new Set(foundIngredients)];

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
      id: recipe.Id,
      title: recipe.Title,
      image: recipe.Image,
      calories: recipe.Calories,
    });
  });

  return okResponse({ alternatives: cleanedRecipes });
}
