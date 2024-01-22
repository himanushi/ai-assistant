import { useSignal } from "@preact/signals";
import styles from "~/Home.module.css";

const originalFace = "🐱";
const clickedFace = "👂";

export const Home = () => {
  const face = useSignal(originalFace);

  const handleMouseDown = () => {
    face.value = clickedFace;
  };

  const handleMouseUp = () => {
    face.value = originalFace;
  };

  return (
    <div
      className={styles.face}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {face}
    </div>
  );
};
