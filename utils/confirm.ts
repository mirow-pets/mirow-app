import { Alert } from "react-native";

export interface ConfirmArgs {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export const confirm = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
}: ConfirmArgs) => {
  Alert.alert(
    title,
    description,
    [
      {
        text: cancelText ?? "Cancel",
        style: "cancel",
      },
      {
        text: confirmText ?? "Confirm",
        onPress: onConfirm,
        style: "destructive",
      },
    ],
    { cancelable: false }
  );
};
