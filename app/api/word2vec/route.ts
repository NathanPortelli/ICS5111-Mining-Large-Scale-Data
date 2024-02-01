import { errorResponse, okResponse } from "@/app/utils/responses";
import { Word2Vec } from "@/app/utils/word2vec";
import foundationFoodsJSON from "@/app/data/foundation_foods.json";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const word2vec = new Word2Vec();

    foundationFoodsJSON.forEach((food) => {
      word2vec.addWords([food.target, ...food.context]);
    });

    for (let epoch = 0; epoch < 100; epoch++) {
      foundationFoodsJSON.forEach((food) => {
        word2vec.train(food.target, food.context);
      });
    }

    const wordList = Array.from(word2vec.vocab);
    const vectors = wordList.map((word) => word2vec.getWordVector(word));

    return okResponse({ vectors, wordList });
  } catch (error) {
    return errorResponse({ message: error });
  }
}
