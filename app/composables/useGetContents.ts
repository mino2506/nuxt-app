import { getContentArrayResponseSchema } from "~/features/content/schema/getContents.schema";

export function useGetContents() {
  const config = useRuntimeConfig();
  const url = `/contents`;

  const { data, pending, error, refresh } = useFetch(url, {
    baseURL: config.public.apiBase,
    transform: (raw) => {
      const parsed = getContentArrayResponseSchema.safeParse(raw);
      if (!parsed.success) throw new Error("Invalid content response");
      return parsed.data.data;
    },
  });

  return {
    data,
    pending,
    error,
    refresh,
  };
}
