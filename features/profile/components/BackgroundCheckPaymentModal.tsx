export interface BackgroundCheckPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPay: () => void;
  loading?: boolean;
}

/**
 * Web-only: use BackgroundCheckPaymentModal.web.tsx for CardElement modal.
 * On native, payment is handled without a modal (e.g. redirect / native flow).
 */
export function BackgroundCheckPaymentModal(
  _props: BackgroundCheckPaymentModalProps
) {
  return null;
}
