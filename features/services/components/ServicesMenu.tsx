import { StyleSheet, TouchableOpacity, View } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { Image, ImageSource } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { Get } from "@/services/http-service";
import { TServiceType } from "@/types";

const imageMapper: Record<string, ImageSource> = {
  boarding: require("@/assets/images/services/boarding.png"),
  walking: require("@/assets/images/services/walking.png"),
  sitting: require("@/assets/images/services/sitting.png"),
  grooming: require("@/assets/images/services/grooming.png"),
  training: require("@/assets/images/services/training.png"),
  "meal-prep": require("@/assets/images/services/meal-prep.png"),
  transportation: require("@/assets/images/services/transportation.png"),
};

export interface ServicesMenuProps {
  onClick: (_type: TServiceType["type"]) => void;
}

export const ServicesMenu = ({ onClick }: ServicesMenuProps) => {
  const { data, isLoading } = useQuery<TServiceType[]>({
    queryKey: ["service-types"],
    queryFn: () => Get("/service-types"),
  });

  return (
    <View style={{ marginHorizontal: 16 }}>
      <View style={styles.menuContainer}>
        {isLoading ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <View style={styles.gridContainer}>
            {data?.map((serviceType, i) => (
              <TouchableOpacity
                key={i}
                style={styles.gridItem}
                onPress={() => onClick(serviceType.type)}
              >
                <Image
                  source={imageMapper[serviceType.type]}
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                />
                <ThemedText
                  type="defaultSemiBold"
                  key={i}
                  style={{ fontSize: 8 }}
                >
                  {serviceType.display}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Distribute items evenly with space between them
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    gap: 8,
  },
  gridItem: {
    width: "23%", // Approximately 3 items per row (30% * 3 = 90%, with 10% for spacing)
    aspectRatio: 1, // Make items square (width = height)
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 10,
    gap: 2,
    backgroundColor: primaryColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
