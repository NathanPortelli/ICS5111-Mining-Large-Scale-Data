export class Word2Vec {
  vocab: Set<string>;
  wordVectors: Map<string, number[]>;
  learningRate: number = 0.01;
  vectorSize: number = 50;

  constructor() {
    this.vocab = new Set<string>();
    this.wordVectors = new Map<string, number[]>();
  }

  // Add sentences to word2vec vocabulary
  addSentences(sentences: string[][]) {
    sentences.forEach((words) => {
      this.addWords(words);
    });
  }

  // Add words to word2vec vocabulary
  addWords(words: string[]) {
    words.forEach((word) => {
      if (!this.vocab.has(word)) {
        this.vocab.add(word);
        // Set word vectors randomly
        this.wordVectors.set(
          word,
          Array.from({ length: this.vectorSize }, () => Math.random())
        );
      }
    });
  }

  // Initialize word vectors
  initializeVectors() {
    this.vocab.forEach((word) => {
      // Set word vectors randomly
      this.wordVectors.set(
        word,
        Array.from({ length: this.vectorSize }, () => Math.random())
      );

      // Normalize the newly initialized vector
      const vector = this.wordVectors.get(word) || [];
      this.normalizeVector(vector);
      this.wordVectors.set(word, vector);
    });
  }

  // Train the model with sentences incorporating subsampling and epochs
  trainWithSentences(
    sentences: string[][],
    subsamplingThreshold: number = 1e-3,
    epochs: number = 100
  ) {
    for (let epoch = 1; epoch <= epochs; epoch++) {
      const wordFrequencies: Map<string, number> = new Map();

      // Calculate word frequencies
      sentences.forEach((words) => {
        words.forEach((word) => {
          wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
        });
      });

      // Total number of words in the training data
      const totalWords = Array.from(wordFrequencies.values()).reduce(
        (sum, freq) => sum + freq,
        0
      );

      sentences.forEach((words) => {
        for (let i = 0; i < words.length; i++) {
          const targetWord = words[i];

          // Subsample frequent words
          if (
            Math.random() >
            1 -
              Math.sqrt(
                (subsamplingThreshold /
                  (wordFrequencies.get(targetWord) || 1)) *
                  (totalWords / wordFrequencies.size)
              )
          ) {
            continue; // Skip this word
          }

          const contextWords = words
            .slice(Math.max(0, i - 5), i)
            .concat(words.slice(i + 1, i + 6));
          this.train(targetWord, contextWords);
        }
      });
    }
  }

  // Train the model
  train(targetWord: string, contextWords: string[]) {
    const targetVector = this.wordVectors.get(targetWord) || [];
    contextWords.forEach((contextWord) => {
      const contextVector = this.wordVectors.get(contextWord) || [];
      const dotProduct = targetVector.reduce(
        (sum, val, i) => sum + val * contextVector[i],
        0
      );
      const error = 1 / (1 + Math.exp(-dotProduct));
      const gradient = error - 1;

      // Update target and context word vectors
      targetVector.forEach((val, i) => {
        targetVector[i] -= this.learningRate * gradient * contextVector[i];
        contextVector[i] -= this.learningRate * gradient * targetVector[i];
      });

      // Normalize vectors
      this.normalizeVector(targetVector);
      this.normalizeVector(contextVector);

      // Update word vectors in model
      this.wordVectors.set(targetWord, targetVector);
      this.wordVectors.set(contextWord, contextVector);
    });
  }

  // Normalize a vector to unit length
  normalizeVector(vector: number[]) {
    const length = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    vector.forEach((val, i) => {
      vector[i] = val / length;
    });
  }

  // Extract ingredients from an array of strings
  extractIngredients(
    textArray: string[],
    knownIngredients: string[],
    threshold: number = 0.7
  ): string[] {
    const wordVectors: number[][] = [];

    // Preprocess and tokenize each string in the array
    textArray.forEach((inputText) => {
      const preprocessedText = inputText.toLowerCase().replace(/[.,]/g, "");
      const tokenizedText = preprocessedText.split(" ");

      // Get word vectors for each word in the tokenized text
      const vectors = tokenizedText.map(
        (word) => this.getWordVector(word) || []
      );
      wordVectors.push(...vectors);
    });

    // Calculate cosine similarity with known ingredient vectors
    const similarityScores: Map<string, number> = new Map();
    knownIngredients.forEach((ingredient) => {
      const ingredientVector = this.getWordVector(ingredient) || [];
      const similarity = this.calculateCosineSimilarity(
        wordVectors,
        ingredientVector
      );
      similarityScores.set(ingredient, similarity);
    });

    // Extract ingredients based on similarity scores
    const extractedIngredients = knownIngredients.filter((ingredient) => {
      const similarity = similarityScores.get(ingredient);
      return similarity !== undefined && similarity >= threshold;
    });

    return extractedIngredients;
  }

  // Function to calculate cosine similarity between vectors
  calculateCosineSimilarity(vectors1: number[][], vector2: number[]): number {
    const dotProduct = vectors1.reduce(
      (sum, vector) => sum + this.dot(vector, vector2),
      0
    );
    const magnitude1 = Math.sqrt(
      vectors1.reduce((sum, vector) => sum + this.dot(vector, vector), 0)
    );
    const magnitude2 = Math.sqrt(this.dot(vector2, vector2));

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0; // Prevent division by zero
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  // Function to calculate dot product between two vectors
  dot(vector1: number[], vector2: number[]): number {
    return vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  }

  // Get vector for a specific word
  getWordVector(enteredWord: string): number[] | null {
    const vector = this.wordVectors.get(enteredWord);

    return vector ?? null;
  }
}
