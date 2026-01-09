export const MONTHS = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i).toLocaleString("default", { month: "long" })
);

export const monthOptions = MONTHS?.map((month, index) => ({
  value: index,
  label: month,
}));
