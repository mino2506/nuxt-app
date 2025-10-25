import { getContentResponseSchema } from "~/features/content/schema/getContent.schema";

export function useGetContent(id: string | number) {
  const config = useRuntimeConfig();
  const url = `/contents/${id}`;

  const { data, pending, error, refresh } = useFetch(url, {
    baseURL: config.public.apiBase,
    key: `content:${id}`,
    transform: (raw) => {
      const parsed = getContentResponseSchema.safeParse(raw);
      if (!parsed.success) throw new Error("Invalid content response");
      return parsed.data.data;
    },
  });

  return {
    data: data ?? null,
    pending: pending,
    error: error,
    refresh,
  };
}
