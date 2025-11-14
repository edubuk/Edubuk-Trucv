import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMongoId(id: unknown): id is string {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}
