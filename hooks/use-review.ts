import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { TCreateReview } from "@/features/bookings/validations";
import { Post } from "@/services/http-service";

import { useModal } from "./use-modal";

export const useReview = () => {
  const queryClient = useQueryClient();
  const { setOpenId } = useModal();

  const onError = (err: Error) => {
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

  const { mutate: createReview, isPending: isCreatingReview } = useMutation({
    mutationFn: (input: TCreateReview) => Post(`/reviews`, input),
    onError,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["booking"],
      });

      Toast.show({
        type: "success",
        text1: "Review added successfully!",
      });

      setOpenId("");
    },
  });

  return { createReview, isCreatingReview };
};
