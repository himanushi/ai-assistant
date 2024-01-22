import { useSignal } from "@preact/signals";
import styles from "~/Home.module.css";

const originalFace = "🐱";
const clickedFace = "👂";

export const Home = () => {
  const face = useSignal(originalFace);

  const handlePress = () => {
    face.value = clickedFace;
  };

  const handleRelease = () => {
    face.value = originalFace;
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
