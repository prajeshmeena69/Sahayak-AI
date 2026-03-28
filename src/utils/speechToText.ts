type ResultCallback = (transcript: string) => void;
type ErrorCallback = (error: string) => void;

let recognition: SpeechRecognition | null = null;
let accumulatedTranscript = "";
let pendingResultCallback: ResultCallback | null = null;

function getSpeechRecognition(): typeof SpeechRecognition | null {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function isSpeechSupported(): boolean {
  return !!getSpeechRecognition();
}

export function startListening(
  speechLocale: string,
  onResult: ResultCallback,
  onError: ErrorCallback
): void {
  const SR = getSpeechRecognition();
  if (!SR) {
    onError("Speech recognition is not supported in this browser. Please use Chrome.");
    return;
  }

  stopListening();

  accumulatedTranscript = "";
  pendingResultCallback = onResult;

  recognition = new SR();
  recognition.lang = speechLocale;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = true; // keep listening until user clicks stop

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        final += result[0].transcript;
      } else {
        interim += result[0].transcript;
      }
    }
    if (final) accumulatedTranscript += (accumulatedTranscript ? " " : "") + final.trim();
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === "no-speech") return; // ignore silence, keep listening
    const msg =
      event.error === "not-allowed"
        ? "Microphone access denied. Please allow microphone permission."
        : `Speech error: ${event.error}`;
    onError(msg);
  };

  recognition.onend = () => {
    // Auto-restarted by browser — restart to keep continuous listening
    if (recognition) {
      try { recognition.start(); } catch { /* already stopped by user */ }
    }
  };

  recognition.start();
}

/**
 * Stop listening and fire the result callback with everything recorded so far.
 */
export function stopListening(): void {
  if (recognition) {
    // Detach onend so we don't auto-restart
    recognition.onend = null;
    try { recognition.stop(); } catch { /* ignore */ }
    recognition = null;
  }

  if (pendingResultCallback && accumulatedTranscript.trim()) {
    pendingResultCallback(accumulatedTranscript.trim());
  }

  accumulatedTranscript = "";
  pendingResultCallback = null;
}
