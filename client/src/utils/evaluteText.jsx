import axios from 'axios';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

// Evaluate grammar using LanguageTool API
export const evaluateGrammar = async (text) => {
  try {
    const response = await axios.post(
      'https://api.languagetool.org/v2/check',
      {
        text,
        language: 'en-US',
      }
    );
    const errors = response.data.matches;
    return (errors.length / text.split(' ').length) * 100;  // Grammatical error rate
  } catch (error) {
    console.error('Error evaluating grammar:', error);
    return 0;
  }
};

// Calculate relevance of the answer to the question
export const evaluateRelevance = async (question, answer) => {
  try {
    const model = await use.load();
    const embeddings = await model.embed([question, answer]);
    return cosineSimilarity(embeddings.arraySync()[0], embeddings.arraySync()[1]);
  } catch (error) {
    console.error('Error evaluating relevance:', error);
    return 0;
  }
};

// Cosine similarity to compare vectors
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = tf.tidy(() => tf.matMul(vecA, vecB, false, true).dataSync());
  const normA = tf.norm(vecA).dataSync();
  const normB = tf.norm(vecB).dataSync();
  return dotProduct / (normA * normB);
};

// Evaluate answer perfection
export const evaluateAnswerPerfection = (answer, question) => {
  let score = 0;
  if (answer.length > 0 && answer.includes(question)) {
    score += 50;
  }
  return score;
};

// Combine all evaluations into one score
export const calculateScore = async (question, answer) => {
  const relevanceScore = await evaluateRelevance(question, answer);
  const grammarScore = await evaluateGrammar(answer);
  const perfectionScore = evaluateAnswerPerfection(answer, question);

  return (relevanceScore * 0.4) + (100 - grammarScore * 0.3) + (perfectionScore * 0.3);
};
