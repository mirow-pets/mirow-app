export const formatCurrency = (
  value?: number | string | null,
  currency = "USD"
) => {
  if (!value) return "-";

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
