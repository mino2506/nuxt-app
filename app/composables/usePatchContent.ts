import { useSubmitFactory } from "./useSubmitFactory";
import { patchContentFormSchema } from "~/features/content/schema/patchContent.schema";
import { submitPatchContent } from "~/features/content/api/updateContent";
import type {
  PatchContentForm,
  PatchContentResponseData,
} from "~/features/content/types/patchContent.type";

export function usePatchContent(id: string | number) {
  return useSubmitFactory<PatchContentForm, PatchContentResponseData>(
    patchContentFormSchema,
    (form) => submitPatchContent(id, form)
  );
}
