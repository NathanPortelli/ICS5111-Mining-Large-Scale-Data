import { Firestore, collection, getDocs } from 'firebase/firestore';
import { Word2Vec } from './word2vec';

class WordContent {
  private word2VecModel: Word2Vec;
  private firestore: Firestore;

  constructor(firestore: Firestore) {
    this.word2VecModel = new Word2Vec();
    this.firestore = firestore;
  }

  async loadStopwords() {
    const stopwordsSnapshot = await getDocs(collection(this.firestore, 'stopwords'));
    const stopwords = stopwordsSnapshot.docs.map(doc => doc.data().word);
    this.word2VecModel.addWords(stopwords);
  }

  async loadRecipeData() {
    const recipesSnapshot = await getDocs(collection(this.firestore, 'jamieOliverRecipes'));
    recipesSnapshot.forEach(doc => {
      const recipeData = doc.data();
      const recipeText = `${recipeData.title} ${recipeData.recipe}`;
      const words = recipeText.split(/\s+/);
      this.word2VecModel.addWords(words);
    });
  }

  async findSimilarRecipes(inputText: string, inputCalories: number): Promise<any[]> {
    const inputWords = inputText.split(/\s+/);

    // Check if all words in the input exist in the model
    if (!inputWords.every(word => this.word2VecModel.hasWord(word))) {
      throw new Error('Not all words in the input text have embeddings.');
    }

    // Train the model with the input words (optional)
    inputWords.forEach(targetWord => {
      const contextWords = inputWords.filter(word => word !== targetWord);
      this.word2VecModel.train(targetWord, contextWords);
    });

    // Load recipe data
    await this.loadRecipeData();

    // Find similar recipes
    const similarRecipes = await this.findMostSimilarRecipes(inputWords, 10);

    // Sort and filter recipes based on inputCalories
    const topRecipes = this.sortAndFilterRecipes(similarRecipes, inputCalories);

    return topRecipes;
  }

  private async findMostSimilarRecipes(inputWords: string[], limit: number): Promise<{ recipe: any, similarity: number }[]> {
    const recipeCollection = collection(this.firestore, 'jamieOliverRecipes');
    const recipesSnapshot = await getDocs(recipeCollection);
    const similarRecipes: { recipe: any, similarity: number }[] = [];

    recipesSnapshot.forEach(doc => {
      const recipeData = doc.data();
      const recipeText = `${recipeData.title} ${recipeData.recipe}`;
      const recipeWords = recipeText.split(/\s+/);
      const similarity = this.calculateSimilarity(inputWords, recipeWords);

      similarRecipes.push({ recipe: recipeData, similarity });
    });

    // Sort recipes by similarity
    similarRecipes.sort((a, b) => b.similarity - a.similarity);

    return similarRecipes;
  }

  private sortAndFilterRecipes(recipes: { recipe: any, similarity: number }[], inputCalories: number): any[] {
    // Filter top recipes based on inputCalories
    const filteredRecipes = recipes.filter(recipe => typeof recipe.recipe.calories === 'number');

    // Sort filtered recipes based on the absolute difference in calories
    filteredRecipes.sort((a, b) => Math.abs(a.recipe.calories - inputCalories) - Math.abs(b.recipe.calories - inputCalories));

    // Get the top 3 recipes
    const topRecipes = filteredRecipes.slice(0, 3).map(entry => entry.recipe);

    return topRecipes;
  }

  private calculateSimilarity(words1: string[], words2: string[]): number {
    // Get vectors for words in both sets
    const vectors1 = words1.map(word => this.word2VecModel.getWordVector(word) || []);
    const vectors2 = words2.map(word => this.word2VecModel.getWordVector(word) || []);

    // Calculate the dot product
    const dotProduct = vectors1.reduce((sum, vector1, index) => {
      const vector2 = vectors2[index];
      return sum + this.dotProduct(vector1, vector2);
    }, 0);

    // Calculate the magnitude of each vector
    const magnitude1 = Math.sqrt(vectors1.reduce((sum, vector) => sum + this.magnitudeSquared(vector), 0));
    const magnitude2 = Math.sqrt(vectors2.reduce((sum, vector) => sum + this.magnitudeSquared(vector), 0));

    // Avoid division by zero
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    // Calculate cosine similarity
    const similarity = dotProduct / (magnitude1 * magnitude2);

    return similarity;
  }

  private dotProduct(vector1: number[], vector2: number[]): number {
    return vector1.reduce((sum, value, index) => sum + value * vector2[index], 0);
  }

  private magnitudeSquared(vector: number[]): number {
    return vector.reduce((sum, value) => sum + value ** 2, 0);
  }
}

export default WordContent;
