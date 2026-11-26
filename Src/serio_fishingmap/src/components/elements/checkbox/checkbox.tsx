"use client";

import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export type CheckboxFieldProps = Omit<CheckboxProps, "children"> & {
  label: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, helperText, error, isRequired, id, ...props }, ref) => {
    const controlId = id ?? props.name ?? `chk-${label}`;
    const hasError = Boolean(error);

    return (
      <FormControl id={controlId} isInvalid={hasError} isRequired={isRequired}>
        <Checkbox ref={ref} {...props}>
          {label}
        </Checkbox>
        {helperText && !hasError && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
        {hasError && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

CheckboxField.displayName = "CheckboxField";
