import { StyleSheet, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { Button } from "@/components/button/Button";
import { ThemedText } from "@/components/themed-text";
import { primaryColor, whiteColor } from "@/constants/theme";

export interface AddPaymentMethodResultProps {
  screenState: "success" | "error";
  handleDone: () => void;
  handleTryAgain: () => void;
  errorMessage?: string;
}

export const AddPaymentMethodResult = ({
  screenState,
  handleDone,
  handleTryAgain,
  errorMessage,
}: AddPaymentMethodResultProps) => {
  if (screenState === "success") {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={48} color={primaryColor} />
          </View>
          <ThemedText style={styles.resultTitle}>Great!</ThemedText>
          <ThemedText style={styles.resultMessage}>
            Successfully added your card!
          </ThemedText>
        </View>
        <Button style={styles.resultButton} onPress={handleDone}>
          <ThemedText style={styles.resultButtonText}>Done</ThemedText>
        </Button>
      </View>
    );
  }

  if (screenState === "error") {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="close" size={48} color={primaryColor} />
          </View>
          <ThemedText style={styles.resultTitle}>Oops!</ThemedText>
          <ThemedText style={styles.resultMessage}>
            {errorMessage ?? "Sorry! Something went wrong"}
          </ThemedText>
        </View>
        <Button style={styles.resultButton} onPress={handleTryAgain}>
          <ThemedText style={styles.resultButtonText}>Try Again</ThemedText>
        </Button>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    backgroundColor: "#37B2FF",
    padding: 20,
    justifyContent: "space-between",
    paddingBottom: 100,
  },
  resultContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: whiteColor,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: whiteColor,
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: whiteColor,
    textAlign: "center",
    opacity: 0.95,
  },
  resultButton: {
    backgroundColor: whiteColor,
  },
  resultButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: "600",
  },
});
