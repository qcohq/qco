/**
 * Utility functions for image handling
 */

export function getImagePath(path: string): string {
  // If path is already a full URL or starts with /, return as is
  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  // Otherwise, prepend the public path
  return `/images/products/${path}`;
}

export function getImageDimensions(
  size: "thumbnail" | "small" | "medium" | "large" = "medium",
): {
  width: number;
  height: number;
} {
  switch (size) {
    case "thumbnail":
      return { width: 80, height: 80 };
    case "small":
      return { width: 240, height: 240 };
    case "medium":
      return { width: 480, height: 480 };
    case "large":
      return { width: 800, height: 800 };
    default:
      return { width: 480, height: 480 };
  }
}

export function generatePlaceholderUrl(
  width: number,
  height: number,
  text: string,
): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(text)}`;
}
