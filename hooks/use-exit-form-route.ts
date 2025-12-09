import { useEffect } from "react";

import { useNavigation } from "expo-router";

import { confirm } from "@/utils";

export interface UseExitFormRouteWarningProps {
  disableNavigation?: boolean;
  isDirty: boolean;
  onExit?: () => void;
}

export const useExitFormRouteWarning = ({
  disableNavigation,
  isDirty,
  onExit,
}: UseExitFormRouteWarningProps) => {
  const navigation = useNavigation();

  useEffect(() => {
    // BLOCK NAVIGATION IF FORM IS DIRTY
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (disableNavigation) e.preventDefault();

      if (!isDirty) return;

      // Prevent default behavior of leaving the screen
      e.preventDefault();

      confirm({
        title: "Discard changes?",
        description:
          "You have unsaved changes. Are you sure you want to leave this screen?",
        onConfirm: () => {
          onExit?.();
          navigation.dispatch(e.data.action);
        },
        confirmText: "Exit",
      });
    });

    return unsubscribe;
  }, [navigation, disableNavigation, isDirty, onExit]);
};
