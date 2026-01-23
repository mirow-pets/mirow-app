import { ReactNode, useEffect } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { Modal as BaseModal, Portal, useTheme } from "react-native-paper";

import { whiteColor } from "@/constants/theme";
import { useModal } from "@/hooks/use-modal";

import { ThemedText } from "../themed-text";

export interface ModalProps {
  children: ReactNode;
  trigger?: ReactNode;
  title?: string;
  id: string;
  onConfirm?: () => void;
  style?: StyleProp<ViewStyle>;
  cancelText?: string;
  confirmText?: string;
  hideCancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
  open?: boolean;
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
  hideCancel,
  loading,
  disabled,
  open,
}: ModalProps) => {
  const theme = useTheme();
  const { openId, setOpenId } = useModal();

  useEffect(() => {
    setOpenId(open ? id : "");
  }, [id, open, setOpenId]);

  return (
    <>
      {trigger && (
        <TouchableOpacity onPress={() => setOpenId(id)} disabled={disabled}>
          {trigger}
        </TouchableOpacity>
      )}

      <Portal>
        <BaseModal
          visible={openId === id}
          onDismiss={() => setOpenId("")}
          style={{ alignItems: "center" }}
          contentContainerStyle={[styles.modalView, style]}
        >
          {title && <ThemedText style={styles.modalTitle}>{title}</ThemedText>}
          <View>{children}</View>
          <View style={styles.modalFooter}>
            {!hideCancel && (
              <TouchableOpacity
                onPress={() => setOpenId("")}
                disabled={loading}
              >
                <ThemedText style={styles.footerText}>
                  {cancelText || "Cancel"}
                </ThemedText>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity onPress={onConfirm} disabled={loading}>
                <ThemedText
                  style={[styles.footerText, { color: theme.colors.primary }]}
                >
                  {confirmText || "Confirm"}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </BaseModal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    borderRadius: 10,
    padding: 16,
    gap: 32,
    backgroundColor: whiteColor,
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
