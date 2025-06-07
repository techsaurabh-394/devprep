import axios from 'axios';

export const checkGrammar = async (text) => {
  try {
    const response = await axios.post(
      'https://api.languagetool.org/v2/check',
      {
        text,
        language: 'en-US',
      }
    );
    return response.data.matches;
  } catch (error) {
    console.error('Error checking grammar:', error);
  }
};
