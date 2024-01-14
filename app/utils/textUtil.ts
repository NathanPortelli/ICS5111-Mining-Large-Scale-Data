export function removeTags(input: string): string {
  // HTML tags
  const withoutHtml = input.replace(/<[^>]*>/g, "");

  // Markdown tags and line breaks
  const withoutMarkdown = withoutHtml.replace(
    /([*_~`]|(?:\[(.*?)\]\((.*?)\)))|\n/g,
    ""
  );

  return withoutMarkdown;
}

export function fixSentenceSpacing(input: string): string {
  // // Add space after periods and fix spacing for specific words
  // const fixedText = input.replace(/(\w)\.(\w)/g, '$1. $2');

  // return fixedText;
  const fixedText = input.replace(
    /(\w)\.(\w)|([a-z])([A-Z])/g,
    (match, p1, p2, p3, p4) => {
      if (p1 && p2) {
        return `${p1}. ${p2.charAt(0).toUpperCase() + p2.slice(1)}`;
      } else if (p3 && p4) {
        return `${p3}. ${p4.charAt(0).toUpperCase() + p4.slice(1)}`;
      }
      return match;
    }
  );

  return fixedText;
}

export function extractTextToArray(paragraph: string): string[] {
  const sentences = paragraph.split(". ");

  const trimmedSentences = sentences.map((sentence) => sentence.trim());

  return trimmedSentences;
}

export function splitSentencesIntoWords(sentences: string[]): string[][] {
  return sentences.map((sentence) => {
    return sentence.replace(/[^\w\s]/g, "").split(/\s+/);
  });
}

export function removeWordsFromSentence(
  sentence: string[],
  wordsToRemove: string[]
): string[] {
  return sentence.filter((word) => !wordsToRemove.includes(word.toLowerCase()));
}
