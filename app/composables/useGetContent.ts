import { z } from "zod";
import { getContentResponseSchema } from "~/features/content/schema/getContent.schema";

export function useGetContent(id: string | number) {
  const config = useRuntimeConfig();
  const url = `/contents/${id}`;

  // console.warn(`${config.public.apiBase}/${url}`);

  const { data, pending, error, refresh } = useFetch(url, {
    baseURL: config.public.apiBase, // .env で管理
    key: `content:${id}`,
    transform: (raw) => {
      const parsed = getContentResponseSchema.safeParse(raw);
      if (!parsed.success) throw new Error("Invalid content response");
      return parsed.data.data; // ← GetContentResponseData
    },
  });

  return {
    fetchData: data, // Ref<GetContentResponseData | null>
    fetchPending: pending,
    fetchError: error,
    refresh,
  };
}
