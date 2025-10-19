import type { FetchError } from "ofetch";

export function isFetchError(e: unknown): e is FetchError {
  return (
    typeof e === "object" &&
    e !== null &&
    "response" in e &&
    typeof (e as any).response === "object"
  );
}
