import Toast from "react-native-toast-message";

export const onError = (err: Error) => {
  console.log(err);
  let message = "An unexpected error occurred. Please try again.";

  if ("statusCode" in err && Number(err.statusCode) < 500) {
    message = err.message;
  }

  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
  });
};
