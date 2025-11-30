import { Alert } from "react-native";

export interface ConfirmArgs {
  title: string;
  description?: string;
  onConfirm: () => void;
}

export const confirm = ({ title, description, onConfirm }: ConfirmArgs) => {
  Alert.alert(
    title,
    description,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: onConfirm,
        style: "destructive",
      },
    ],
    { cancelable: false }
  );
};
