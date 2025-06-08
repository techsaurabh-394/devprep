import { useSpeechRecognition } from 'react-speech-recognition';

export const useCustomSpeechRecognition = () => {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  return {
    transcript,
    resetTranscript,
    listening,
  };
};
