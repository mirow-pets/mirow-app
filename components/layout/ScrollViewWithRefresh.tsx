import { ReactNode } from "react";
import { ScrollViewProps } from "react-native";

import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { useThemeColor } from "@/hooks/use-theme-color";

export interface ScrollViewWithRefreshProps extends ScrollViewProps {
  children: ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
}

export const ScrollViewWithRefresh = ({
  children,
  loading = false,
  onRefresh,
  ...props
}: ScrollViewWithRefreshProps) => {
  const primaryColor = useThemeColor({}, "primary");
  return (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      {...props}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          colors={[primaryColor]}
        />
      }
    >
      {children}
    </ScrollView>
  );
};
