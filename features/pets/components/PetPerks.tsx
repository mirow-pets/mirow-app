import { Text, TouchableOpacity, View } from "react-native";

import { Image } from "@/components/image/Image";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";

export interface NearbyCaregiversProps {
  onClick: () => void;
  onSeeMore?: () => void;
}

export const PetPerks = ({ onClick, onSeeMore }: NearbyCaregiversProps) => {
  const images = [
    require("@/assets/images/paw-protect.png"),
    require("@/assets/images/exclusive-savings.png"),
  ];

  return (
    <View
      style={{
        gap: 16,
      }}
    >
      <View>
        <ThemedText
          type="title"
          style={{
            color: primaryColor,
            fontFamily: "Karantina",
            fontSize: 48,
            textAlign: "center",
          }}
        >
          PET PERKS
        </ThemedText>
        <Text
          style={{
            fontFamily: "Poppins",
            textAlign: "center",
            fontWeight: "light",
          }}
        >
          Secure and protect your pets!
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          gap: 16,
          justifyContent: "center",
        }}
      >
        {images.map((image, i) => (
          <TouchableOpacity
            key={i}
            style={{
              height: 90,
              width: 160,
              borderRadius: 16,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={onClick}
          >
            <Image
              source={image}
              style={{
                width: 160,
                height: 90,
                objectFit: "cover",
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ alignItems: "flex-end", paddingHorizontal: 16 }}>
        <ThemedText onPress={onSeeMore} style={{ fontSize: 12 }}>
          See more {">"}
        </ThemedText>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={{
            width: "100%",
            height: 180,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={onClick}
        >
          <Image
            source={require("@/assets/images/become-caregiver.png")}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
