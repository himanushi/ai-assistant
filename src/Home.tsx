import { useSignal } from "@preact/signals";
import { useEffect, useRef, useState } from "preact/hooks";
import styles from "~/Home.module.css";
import { compilation, speechToText, textToSpeech } from "~/lib/openAiApi";

const originalFace = "🐱";
const clickedFace = "👂";

export const Home = () => {
  const face = useSignal(originalFace);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
      })
      .catch((error) => console.error("音声の取得に失敗しました", error));
  }, []);

  const handlePress = () => {
    face.value = clickedFace;
    audioChunks.current = [];
    mediaRecorder?.start();
  };

  const handleRelease = async () => {
    face.value = originalFace;
    if (mediaRecorder) {
      mediaRecorder.stop();

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const text = await speechToText(audioBlob);
        const content = await compilation(text);
        const blob = await textToSpeech(content);
        if (!blob) return;
        playAudioBlob(blob);
      };
    }
  };

  return (
    <div
      className={styles.face}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      {face}
    </div>
  );
};

const playAudioBlob = (audioBlob: Blob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audioElement = document.createElement("audio");
  audioElement.src = audioUrl;
  audioElement.controls = true;

  audioElement.onended = () => {
    document.body.removeChild(audioElement);
    URL.revokeObjectURL(audioUrl);
  };

  document.body.appendChild(audioElement);
  audioElement.play();
};
