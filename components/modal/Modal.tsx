import { ReactNode, useEffect } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
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
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
  cancelText?: string;
  confirmText?: string;
  hideCancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
  open?: boolean;
  actions?: ReactNode;
}

export const Modal = ({
  title,
  id,
  trigger,
  children,
  onConfirm,
  onCancel,
  style,
  cancelText,
  confirmText,
  hideCancel,
  loading,
  disabled,
  open,
  actions,
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
          <GestureHandlerRootView style={styles.scrollContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <View>{children}</View>
            </ScrollView>
          </GestureHandlerRootView>

          <View style={styles.modalFooter}>
            <View>{actions}</View>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
              }}
            >
              {!hideCancel && (
                <TouchableOpacity
                  onPress={onCancel ?? (() => setOpenId(""))}
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
    minWidth: 300,
    maxWidth: "90%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontWeight: 600,
  },
  scrollContainer: {
    flexShrink: 1,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexGrow: 0,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    flexShrink: 0,
  },
  footerText: {
    fontWeight: 600,
  },
});
