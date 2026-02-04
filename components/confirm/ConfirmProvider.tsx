import { ReactNode, useEffect, useState } from "react";

import { Button, Dialog, Portal, Text } from "react-native-paper";

import type { ConfirmArgs } from "@/utils/confirm";
import { setWebConfirmHandler } from "@/utils/confirm";

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<ConfirmArgs | null>(null);

  useEffect(() => {
    setWebConfirmHandler((args) => setPending(args));
    return () => setWebConfirmHandler(null);
  }, []);

  const handleDismiss = () => setPending(null);

  const handleConfirm = () => {
    pending?.onConfirm();
    setPending(null);
  };

  return (
    <>
      {children}
      <Portal>
        <Dialog visible={!!pending} onDismiss={handleDismiss}>
          <Dialog.Title>{pending?.title ?? ""}</Dialog.Title>
          {pending?.description != null && pending.description !== "" && (
            <Dialog.Content>
              <Text variant="bodyMedium">{pending.description}</Text>
            </Dialog.Content>
          )}
          <Dialog.Actions>
            {!pending?.hideCancel && (
              <Button onPress={handleDismiss}>
                {pending?.cancelText ?? "Cancel"}
              </Button>
            )}
            <Button onPress={handleConfirm}>
              {pending?.confirmText ?? "Confirm"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
