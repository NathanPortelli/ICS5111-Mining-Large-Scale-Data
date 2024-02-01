
export class Word2Vec {
    vocab: Set<string>;
    wordVectors: Map<string, number[]>;
    learningRate: number = 0.01;
    vectorSize: number = 50;
  
    constructor() {
      this.vocab = new Set<string>();
      this.wordVectors = new Map<string, number[]>();
    }
  
    // Add words to word2vec vocabulary
    addWords(words: string[]) {
      words.forEach(word => {
        if (!this.vocab.has(word)) {
          this.vocab.add(word);
          // Set word vectors randomly
          this.wordVectors.set(word, Array.from({ length: this.vectorSize }, () => Math.random()));
        }
      });
    }
  
    // Train the model
    train(targetWord: string, contextWords: string[]) {
      const targetVector = this.wordVectors.get(targetWord) || [];
      contextWords.forEach(contextWord => {
        const contextVector = this.wordVectors.get(contextWord) || [];
        const dotProduct = targetVector.reduce((sum, val, i) => sum + val * contextVector[i], 0);
        const error = 1 / (1 + Math.exp(-dotProduct));
        const gradient = error - 1;
  
        // Update target and context word vectors
        targetVector.forEach((val, i) => {
          targetVector[i] -= this.learningRate * gradient * contextVector[i];
          contextVector[i] -= this.learningRate * gradient * targetVector[i];
        });
  
        // Update word vectors in model
        this.wordVectors.set(targetWord, targetVector);
        this.wordVectors.set(contextWord, contextVector);
      });
    }
  
    // Get vector for a specific word
    getWordVector(enteredWord: string): number[] | null {
      const vector = this.wordVectors.get(enteredWord);
  
      return vector ?? null;
    }

    // Check if word exists in the model
    hasWord(word: string): boolean {
        return this.getWordVector(word) !== null;
      }
  }