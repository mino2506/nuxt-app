import { useSubmitFactory } from "./useSubmitFactory";
import { postContentFormSchema } from "~/features/content/schema/postContent.schema";
import { submitPostContent } from "~/features/content/api/createContent";
import type {
  PostContentForm,
  PostContentResponseData,
} from "~/features/content/types/postContent.type";

export function usePostContent() {
  return useSubmitFactory<PostContentForm, PostContentResponseData>(
    postContentFormSchema,
    (form) => submitPostContent(form)
  );
}
