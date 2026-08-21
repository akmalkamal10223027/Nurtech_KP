import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

import SubmitBtn from "./submit";
import FSelect from "./select/f-select";
import FInput from "./input/f-input";
import FInputPrice from "./input/f-input-price";
import FInputPassword from "./input/f-input-password";
import FSelectSearch from "./select/f-select-search";
import FInputArea from "./input/f-input-area";
import FInputRadio from "./input/f-input-radio";
import FInputCheckbox from "./input/f-input-checkbox";
import FInputCheckboxMulti from "./input/f-input-checkbox-multi";

// ref: https://github.com/TanStack/form/discussions/1200
export const { useAppForm } = createFormHook({
  fieldComponents: {
    FInput,
    FInputPrice,
    FInputPassword,
    FInputArea,
    FInputRadio,
    FInputCheckbox,
    FInputCheckboxMulti,
    FSelect,
    FSelectSearch,
  },
  formComponents: {
    SubmitBtn,
  },
  fieldContext: fieldContext,
  formContext: formContext,
});
