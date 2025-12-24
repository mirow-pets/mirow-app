import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "./themed-text";

export interface TimerProps {
  state: "start" | "stop";
  onCountingEnded: () => void;
}

export const Timer = ({ state, onCountingEnded }: TimerProps) => {
  const [timer, setTimer] = useState(120);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (state === "start") {
      setTimer(120);
    } else if (state === "stop") {
      setTimer(0);
    }
  }, [state]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onCountingEnded();
    }
  }, [timer, onCountingEnded]);

  return (
    <ThemedText style={styles.timerStyle}>
      Confirm within {formatTime(timer)}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  timerStyle: {
    fontSize: 20,
    marginBottom: 5,
    color: "#020202",
    alignSelf: "center",
    marginTop: 15,
  },
});
