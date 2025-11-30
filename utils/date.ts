export const formatDateToMDY = (date?: Date) => {
  if (!date) return "-";
  date = new Date(date);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${month}-${day}-${year}`;
};
