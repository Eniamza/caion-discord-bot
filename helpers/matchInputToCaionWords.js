const CaionWord = require('../models/CaionWord');

async function matchInputToCaionWords(input) {
  const words = input.trim().split(/\s+/);
  const n = words.length;
  const results = [];
  let i = 0;

  while (i < n) {
    let matchedThisRound = false;
    const remainingWords = n - i;
    const MAX_PHRASE_LENGTH = 5; // Adjust as needed

    // Try to match phrases starting from position i
    for (let len = Math.min(remainingWords, MAX_PHRASE_LENGTH); len >= 1; len--) {
      const phrase = words.slice(i, i + len).join(' ');

      // Perform a search for this phrase
      const caionWords = await CaionWord.find({ meanings: phrase })
        .collation({ locale: 'en', strength: 2 });

      if (caionWords.length > 0) {
        // Collect the caionWord strings
        const caionWordStrings = caionWords.map(word => word.caionWord);

        // Add the matched segment to results with sequence preserved
        results.push({
          type: 'matched',
          text: phrase,
          caionWords: caionWordStrings,
        });

        i += len; // Move index forward by length of matched phrase
        matchedThisRound = true;
        break; // Break the len loop, move to next position
      }
    }

    if (!matchedThisRound) {
      // No match found starting at position i
      // Record the word as unmatched
      results.push({
        type: 'unmatched',
        text: words[i],
      });
      i += 1;
    }
  }

  return results;
}
  
  module.exports = matchInputToCaionWords;