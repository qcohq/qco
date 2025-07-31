import crypto from "node:crypto";
import { basename, extname } from "node:path";
import type { Options } from "@sindresorhus/slugify";
import slugify from "@sindresorhus/slugify";

export function nameToSlug(
  name: string,
  options: Options = { separator: "-" },
): string {
  if (!name.trim()) {
    throw new Error("File name cannot be empty");
  }
  return slugify(name, options);
}

export function generateFileName(name: string): string {
  const MAX_FILENAME_LENGTH = 255;
  const baseName = nameToSlug(name, { separator: "_", lowercase: false });

  const randomSuffixLength = 11;

  if (baseName.length > MAX_FILENAME_LENGTH - randomSuffixLength) {
    throw new Error(
      `File name is too long. Maximum allowed length: ${
        MAX_FILENAME_LENGTH - randomSuffixLength
      } characters`,
    );
  }

  const randomSuffix = crypto.randomBytes(5).toString("hex");
  return `${baseName}_${randomSuffix}`;
}

export function generateS3Key(
  name: string,
  temporary = false,
  customExtension = "",
): string {
  const ext = extname(name);
  const fileName = basename(name, ext);
  const hash = generateFileName(fileName);
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const extension = customExtension || ext;
  return `${temporary ? "temp/" : ""}${year}/${month}/${day}/${hash + extension}`;
}
