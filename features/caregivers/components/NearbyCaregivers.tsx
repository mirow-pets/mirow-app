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
import { TCaregiversResponse } from "@/types/caregivers";
import { centToMajorUnit, formatCurrency } from "@/utils";

interface CaregiverNearby {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  distanceInMiles: number;
  overallRating: number;
  totalReviews: number;
  services: { label: string; serviceRate: number }[];
}

const CaregiversNearby = ({
  onClick,
  onSeeMore,
}: {
  onClick: (_caregiverId: TCaregiver["usersId"]) => void;
  onSeeMore?: () => void;
}) => {
  const { lat, lng } = useLocation();

  const { data: caregiversNearby, isLoading } = useQuery<TCaregiversResponse>({
    queryKey: ["caregivers-nearby", lat, lng],
    queryFn: () =>
      Get(
        addQueryParams("/v2/caregivers", {
          radius: 5,
          lat,
          lng,
          filter: JSON.stringify({
            limit: 10,
          }),
        })
      ),
    enabled: !!lat && !!lng,
  });

  if (isLoading || !lat || !lng)
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
              onPress={() => onClick(caregiver.usersId)}
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
                  borderRadius: 8,
                  width: "100%",
                  height: 100,
                  borderWidth: 0,
                }}
              />
              <View>
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
                    {caregiver.firstName} {caregiver.usersId}
                  </ThemedText>
                  {caregiver.averageStarRatings ? (
                    <View style={{ flexDirection: "row" }}>
                      {Array.from({ length: caregiver.averageStarRatings }).map(
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
                      width: 80,
                      fontSize: 11,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {caregiver.services?.[0]?.label}
                  </ThemedText>
                  <ThemedText
                    style={{
                      color: whiteColor,
                      fontSize: 11,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatCurrency(
                      centToMajorUnit(caregiver.services?.[0]?.serviceRate)
                    )}
                  </ThemedText>
                </View>
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
