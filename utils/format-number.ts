export const formatNumber = (value: string) => {
  const numValue = value.replace(/[^\d.]/g, "");
  const parts = numValue.split(".");
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return numValue;
};
