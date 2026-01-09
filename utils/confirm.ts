import { Alert } from "react-native";

export interface ConfirmArgs {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  onConfirm: () => void;
}

export const confirm = ({
  title,
  description,
  confirmText,
  cancelText,
  hideCancel,
  onConfirm,
}: ConfirmArgs) => {
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
