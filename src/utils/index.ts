export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (date.toDateString() === "Invalid Date") return dateString;

  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
