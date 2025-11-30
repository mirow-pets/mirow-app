import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import { z } from "zod";

import { PetAvatar } from "@/components/image/PetAvatar";
import { Modal } from "@/components/modal/Modal";
import { ThemedText } from "@/components/themed-text";
import { primaryColor } from "@/constants/theme";
import { useModal } from "@/hooks/use-modal";
import { usePet } from "@/hooks/use-pet";
import { TPet } from "@/types";

const petSchema = z.object({
  petId: z.string().uuid().nonempty({ message: "Pet is required" }),
});

type TPetValues = z.infer<typeof petSchema>;

export interface AddPetModalProps {
  trigger: ReactNode;
  onAdded: (_petId: TPet["id"]) => void;
}

export const AddPetModal = ({ trigger, onAdded }: AddPetModalProps) => {
  const { setOpenId } = useModal();
  const { pets, getPetType } = usePet();

  const form = useForm({
    resolver: zodResolver(petSchema),
  });

  const confirm = (values: TPetValues) => {
    onAdded(values.petId);
    setOpenId("");
  };

  const petId = form.watch("petId");

  return (
    <FormProvider {...form}>
      <Modal
        id="select-pet"
        title="Select pet"
        trigger={trigger}
        onConfirm={form.handleSubmit(confirm)}
      >
        <View style={{ height: 300 }}>
          <FlatList
            scrollEnabled={true}
            data={pets}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => form.setValue("petId", item.id)}
              >
                <PetAvatar src={item.profileImage} size={40} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={{ fontSize: 12 }}>
                    {getPetType(item.petTypesId)?.display}
                  </ThemedText>
                </View>
                {petId === item.id && (
                  <Feather name="check" size={24} color={primaryColor} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 4,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
});
