function findIsSentencesContains(message, arrayOfContents) {
  // Split the message into sentences based on punctuation marks
  const sentences = message.split(/[.!?]/).filter(Boolean);

  // Check each sentence to see if it contains any word from arrayOfContents
  return sentences.some((sentence) => {
    const words = sentence.split(/\s+/).map((word) => word.toLowerCase());
    return arrayOfContents.some((name) => words.includes(name.toLowerCase()));
  });
}

module.exports = { findIsSentencesContains };
