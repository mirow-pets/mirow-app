export const formatPhoneNumber = (value: string) => {
  const phNumber = value.replace(/\D/g, "");
  if (phNumber.length <= 3) {
    return phNumber;
  } else if (phNumber.length <= 6) {
    return `${phNumber.slice(0, 3)}-${phNumber.slice(3, 6)}`;
  } else {
    return `${phNumber.slice(0, 3)}-${phNumber.slice(3, 6)}-${phNumber.slice(
      6,
      10
    )}`;
  }
};
