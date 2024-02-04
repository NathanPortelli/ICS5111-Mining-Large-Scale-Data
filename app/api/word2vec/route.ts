import { errorResponse, okResponse } from "@/app/utils/responses";
import { extractTextToArray, fixSentenceSpacing, removeTags, removeWordsFromSentence, splitSentencesIntoWords } from "@/app/utils/textUtil";
import { Word2Vec } from "@/app/utils/word2vec";
import stopwordsJSON from "@/app/data/stopwords.json";

interface RequestBody {
  text: string;
}

export async function POST(request: Request) {
  try {
    const { text } = (await request.json()) as RequestBody;

    const stopWords = stopwordsJSON
      .map((word) => word.word)
      .filter((word): word is string => typeof word === "string");

    const word2vec = new Word2Vec();

    const cleanText = fixSentenceSpacing(removeTags(text));

    const splitText = extractTextToArray(cleanText);

    const textToWords = splitSentencesIntoWords(splitText);

    let textWithoutStopWords: string[][] = [];

    textToWords.forEach((sentence) => {
      textWithoutStopWords.push(
        removeWordsFromSentence(sentence, stopWords)
      );
    });

    word2vec.addSentences(textWithoutStopWords);

    word2vec.initializeVectors();

    word2vec.trainWithSentences(textWithoutStopWords);

    const wordList = Array.from(word2vec.vocab);
    const vectors = wordList.map((word) => word2vec.getWordVector(word));

    return okResponse({ vectors, wordList });
  } catch (error) {
    return errorResponse({ message: error });
  }
}
