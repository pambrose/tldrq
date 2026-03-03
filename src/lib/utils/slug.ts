import { randomBytes } from "crypto";

export function generateShareSlug(): string {
  return randomBytes(6).toString("base64url").slice(0, 8);
}
