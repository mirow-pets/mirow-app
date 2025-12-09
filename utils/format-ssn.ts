export const formatSsn = (value: string) => {
  const ssn = value.replace(/\D/g, "");
  if (ssn.length <= 3) {
    return ssn;
  } else if (ssn.length <= 5) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  } else {
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  }
};
