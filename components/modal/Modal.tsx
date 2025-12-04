import { ReactNode } from "react";
import {
  Modal as BaseModal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useModal } from "@/hooks/use-modal";

import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export interface ModalProps {
  children: ReactNode;
  trigger: ReactNode;
  title: string;
  id: string;
  onConfirm?: () => void;
  style?: StyleProp<ViewStyle>;
  cancelText?: string;
  confirmText?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const Modal = ({
  title,
  id,
  trigger,
  children,
  onConfirm,
  style,
  cancelText,
  confirmText,
  loading,
  disabled,
}: ModalProps) => {
  const { openId, setOpenId } = useModal();

  return (
    <>
      <TouchableOpacity onPress={() => setOpenId(id)} disabled={disabled}>
        {trigger}
      </TouchableOpacity>
      <BaseModal
        transparent
        visible={openId === id}
        onRequestClose={() => {
          setOpenId("");
        }}
        style={styles.container}
      >
        <View style={styles.centeredView}>
          <ThemedView style={[styles.modalView, style]}>
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            <View>{children}</View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setOpenId("")}
                disabled={loading}
              >
                <ThemedText style={styles.footerText}>
                  {cancelText || "Cancel"}
                </ThemedText>
              </TouchableOpacity>
              {onConfirm && (
                <TouchableOpacity onPress={onConfirm} disabled={loading}>
                  <ThemedText style={styles.footerText}>
                    {confirmText || "Confirm"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </ThemedView>
        </View>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 16,
  },
  modalView: {
    borderRadius: 10,
    padding: 16,
    elevation: 5,
    flexDirection: "column",
    width: "100%",
    maxHeight: 500,
    gap: 32,
  },
  modalTitle: {
    fontWeight: 600,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  footerText: {
    fontWeight: 600,
  },
});
