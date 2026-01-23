import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native-gesture-handler";

import { UserAvatar } from "@/components/image/UserAvatar";
import { ThemedText } from "@/components/themed-text";
import { darkBlueColor, primaryColor, whiteColor } from "@/constants/theme";
import { useLocation } from "@/hooks/use-location";
import { addQueryParams, Get } from "@/services/http-service";
import { TCaregiver } from "@/types";

interface CaregiverNearby {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  distanceInMiles: number;
  overallRating: number;
  totalReviews: number;
}

const CaregiversNearby = ({
  onClick,
  onSeeMore,
}: {
  onClick: (_caregiverId: TCaregiver["usersId"]) => void;
  onSeeMore?: () => void;
}) => {
  const { lat, long } = useLocation();

  const { data: caregiversNearby, isLoading } = useQuery<CaregiverNearby[]>({
    queryKey: ["caregivers-nearby", lat, long],
    queryFn: () =>
      Get(
        addQueryParams("/v2/caregivers/nearby", {
          lat,
          long,
        })
      ),
    enabled: !!lat && !!long,
  });

  if (isLoading || !lat || !long)
    return <ActivityIndicator size={32} color={whiteColor} />;

  if (!caregiversNearby?.length)
    return (
      <View style={{ height: 150 }}>
        <ThemedText style={{ color: whiteColor, textAlign: "center" }}>
          No caregivers nearby
        </ThemedText>
      </View>
    );

  return (
    <View
      style={{
        gap: 32,
      }}
    >
      <ScrollView horizontal style={{ width: "100%", flexWrap: "wrap" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            justifyContent: "center",
            paddingHorizontal: 16,
          }}
        >
          {caregiversNearby?.map((caregiver, i) => (
            <TouchableOpacity
              onPress={() => onClick(caregiver.id)}
              key={i}
              style={{
                width: 160,
                height: 160,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: darkBlueColor,
              }}
            >
              <UserAvatar
                src={caregiver.profileImage}
                style={{
                  borderRadius: 0,
                  width: "100%",
                  height: 100,
                  borderWidth: 0,
                }}
              />
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ThemedText
                  style={{
                    color: whiteColor,
                    fontWeight: "bold",
                    width: 80,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {caregiver.firstName} {caregiver.id}
                </ThemedText>
                {caregiver.overallRating ? (
                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: caregiver.overallRating }).map(
                      (_, i) => (
                        <AntDesign
                          key={i}
                          name="star"
                          size={11}
                          color={whiteColor}
                        />
                      )
                    )}
                  </View>
                ) : (
                  <ThemedText
                    style={{
                      color: whiteColor,
                      fontWeight: "light",
                      fontSize: 8,
                    }}
                  >
                    No review
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{ alignItems: "flex-end", paddingHorizontal: 16 }}>
        <ThemedText
          onPress={onSeeMore}
          style={{ color: whiteColor, fontSize: 12 }}
        >
          See more {">"}
        </ThemedText>
      </View>
    </View>
  );
};

export interface NearbyCaregiversProps {
  onClick: (_caregiverId: TCaregiver["usersId"]) => void;
  onSeeMore?: () => void;
}

export const NearbyCaregivers = ({
  onClick,
  onSeeMore,
}: NearbyCaregiversProps) => {
  return (
    <View
      style={{
        backgroundColor: primaryColor,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        gap: 32,
        paddingVertical: 32,
      }}
    >
      <View>
        <ThemedText
          type="title"
          style={{
            color: whiteColor,
            fontFamily: "Karantina",
            fontSize: 48,
            textAlign: "center",
          }}
        >
          MY LOCAL PET PRO
        </ThemedText>
        <Text
          style={{
            fontFamily: "Poppins",
            textAlign: "center",
            color: whiteColor,
            fontWeight: "light",
          }}
        >
          Nearby Pet Caregivers
        </Text>
      </View>
      <CaregiversNearby onClick={onClick} onSeeMore={onSeeMore} />
    </View>
  );
};
