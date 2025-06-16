class InterviewService {
  constructor() {
    if (!("webkitSpeechRecognition" in window)) {
      throw new Error("Speech recognition is not supported in this browser");
    }
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  startRecording(onResult, onError) {
    return new Promise((resolve, reject) => {
      try {
        this.recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          onResult(transcript);
        };

        this.recognition.onerror = (error) => {
          onError(error);
        };

        this.recognition.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Get audio metrics from the microphone stream
  async getAudioStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;

    return {
      analyser,
      stream,
      getAudioLevel: () => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        return average;
      },
      stopStream: () => {
        stream.getTracks().forEach((track) => track.stop());
        audioContext.close();
      },
    };
  }

  // Analyze voice metrics
  analyzeVoiceMetrics(audioLevel) {
    return {
      volume: audioLevel / 255, // Normalize to 0-1
      pace: this.calculateSpeakingPace(audioLevel),
      clarity: this.estimateClarity(audioLevel),
    };
  }

  calculateSpeakingPace(audioLevel) {
    // Simple implementation - could be made more sophisticated
    if (audioLevel < 50) return "too quiet";
    if (audioLevel > 200) return "too loud";
    return "good";
  }

  estimateClarity(audioLevel) {
    // Simple implementation - could be enhanced with more sophisticated analysis
    if (audioLevel < 30) return "unclear";
    if (audioLevel > 220) return "distorted";
    return "clear";
  }

  // Fetch questions from backend
  static async fetchQuestions(role, jobDescription = "") {
    const response = await fetch("/api/interview/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, jobDescription }),
    });
    if (!response.ok) throw new Error("Failed to fetch questions");
    const data = await response.json();
    return data.questions;
  }

  // Submit answers for evaluation
  static async evaluateAnswers({ role, questions, answers, audioMetrics }) {
    const response = await fetch("/api/interview/evaluate-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, questions, answers, audioMetrics }),
    });
    if (!response.ok) throw new Error("Failed to evaluate answers");
    return await response.json();
  }
}

export default InterviewService;
