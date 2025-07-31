export const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};
