export const formatDateToMDY = (_date?: string | Date) => {
  if (!_date) return "-";
  const date = new Date(_date);
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${month}-${day}-${year}`;
};

export const formatToDateTextMDY = (_date: string | Date) => {
  const date = new Date(_date);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTimeToAmPm = (_date: string | Date) => {
  const date = new Date(_date);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
};

export const formatDateToYMD = (_date?: string | Date) => {
  if (!_date) return "-";
  const date = new Date(_date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
