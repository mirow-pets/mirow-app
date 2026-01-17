import { useQueryClient } from "@tanstack/react-query";

export const useRefetchQueries = () => {
  const queryClient = useQueryClient();

  const refetch = async (keys: (string | undefined)[][]) => {
    await Promise.all(
      keys.map((queryKey) =>
        queryClient.refetchQueries({
          queryKey,
        })
      )
    );
  };

  return { refetch };
};
