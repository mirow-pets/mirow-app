import { ListRenderItem, StyleProp, ViewStyle } from "react-native";

import { useInfiniteQuery } from "@tanstack/react-query";
import { FlatList } from "react-native-gesture-handler";

import { ThemedText } from "@/components/themed-text";
import { addQueryParams, Get } from "@/services/http-service";

export interface InfiniteFlatListProps<T> {
  url: string;
  key?: string;
  perPage?: number;
  queryParams?: Record<
    string,
    string | string[] | number | number[] | undefined
  >;
  renderItem: ListRenderItem<T>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  emptyText?: string;
  loadingText?: string;
  order?: string;
}

export const InfiniteFlatList = <T extends object>({
  url,
  key,
  perPage = 5,
  queryParams,
  renderItem,
  contentContainerStyle,
  style,
  emptyText,
  loadingText,
  order,
}: InfiniteFlatListProps<T>) => {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<T[]>(
    {
      queryKey: [key ?? url, queryParams],
      queryFn: ({ pageParam = 0 }) =>
        Get(
          addQueryParams(url, {
            filter: JSON.stringify({
              offset: pageParam?.toString(),
              limit: perPage?.toString(),
              order,
            }),
            ...queryParams,
          })
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < perPage) return undefined;
        return allPages.length * perPage;
      },
      getPreviousPageParam: (firstPage, allPages) => {
        if (allPages.length === 0) return undefined;
        return (allPages.length - 1) * perPage;
      },
      meta: {
        onError: () => {
          console.log("erro");
        },
      },
    }
  );

  const items = data?.pages.flat() || [];

  if (isLoading) return <ThemedText>{loadingText ?? "Loading..."}</ThemedText>;

  if (!items.length) return <ThemedText>{emptyText ?? "No data"}</ThemedText>;

  return (
    <FlatList
      scrollEnabled={true}
      data={items}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      contentContainerStyle={contentContainerStyle}
      style={style}
      renderItem={renderItem}
    />
  );
};
