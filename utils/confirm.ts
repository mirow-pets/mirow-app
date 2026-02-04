import { Alert, Platform } from "react-native";

export interface ConfirmArgs {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  onConfirm: () => void;
}

let webConfirmHandler: ((_args: ConfirmArgs) => void) | null = null;

/** Used by ConfirmProvider to register the web dialog. Do not call directly. */
export const setWebConfirmHandler = (
  handler: ((_args: ConfirmArgs) => void) | null
) => {
  webConfirmHandler = handler;
};

export const confirm = (args: ConfirmArgs) => {
  if (Platform.OS === "web") {
    if (webConfirmHandler) {
      webConfirmHandler(args);
      return;
    }
    // Fallback if ConfirmProvider not mounted (e.g. SSR or early call)
    const message = [args.title, args.description].filter(Boolean).join("\n\n");
    if (typeof window !== "undefined" && window.confirm(message)) {
      args.onConfirm();
    }
    return;
  }

  const { title, description, confirmText, cancelText, hideCancel, onConfirm } =
    args;

  Alert.alert(
    title,
    description,
    [
      ...(hideCancel
        ? []
        : [
            {
              text: cancelText ?? "Cancel",
              style: "cancel" as "cancel",
            },
          ]),
      {
        text: confirmText ?? "Confirm",
        onPress: onConfirm,
        style: "destructive",
      },
    ],
    { cancelable: false }
  );
};
