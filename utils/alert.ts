import { Alert } from "react-native";

export interface AlertArgs {
  title: string;
  description?: string;
}

export const alert = ({ title, description }: AlertArgs) => {
  Alert.alert(
    title,
    description,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
};
