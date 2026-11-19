"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { resetInputFormAtom } from "../stores/atom";
import { InputFormResetButton as ResetButton } from "@/components/elements/button/input-form-reset-button/input-form-reset-button";

export const InputFormResetButton = () => {
  const [, resetForm] = useAtom(resetInputFormAtom);

  const handleReset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  return <ResetButton type="button" onClick={handleReset} />;
};
