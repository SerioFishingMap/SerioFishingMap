"use client";

import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export type CheckboxOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
};

export type CheckboxGroupFieldProps = {
  label: string;
  name: string;
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  helperText?: string;
  error?: string;
  onChange?: (values: string[]) => void;
  isRequired?: boolean;
};

export function CheckboxGroupField({
  label,
  name,
  options,
  value,
  defaultValue,
  helperText,
  error,
  onChange,
  isRequired,
}: CheckboxGroupFieldProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);

  const selected = isControlled ? value : internal;

  const allValues = useMemo(() => options.map((o) => o.value), [options]);
  const allChecked =
    selected.length === allValues.length && selected.length > 0;
  const isIndeterminate =
    selected.length > 0 && selected.length < allValues.length;

  useEffect(() => {
    if (isControlled) return;
    setInternal(defaultValue ?? []);
  }, [defaultValue, isControlled]);

  const setValues = (vals: string[]) => {
    if (isControlled) onChange?.(vals);
    else {
      setInternal(vals);
      onChange?.(vals);
    }
  };

  const toggleAll = (checked: boolean) => {
    setValues(checked ? allValues : []);
  };

  const toggleOne = (val: string, checked: boolean) => {
    setValues(
      checked
        ? Array.from(new Set([...selected, val]))
        : selected.filter((v) => v !== val)
    );
  };

  const hasError = Boolean(error);

  return (
    <FormControl isInvalid={hasError} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>

      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => {
          toggleAll(e.target.checked);
        }}
      >
        すべて選択
      </Checkbox>

      <CheckboxGroup
        value={selected}
        onChange={(vals) => {
          setValues(vals as string[]);
        }}
      >
        <Flex direction="column" gap={2} mt={3}>
          {options.map((opt) => (
            <Checkbox
              key={opt.value}
              name={name}
              value={opt.value}
              isDisabled={opt.isDisabled}
              onChange={(e) => {
                toggleOne(opt.value, e.target.checked);
              }}
            >
              {opt.label}
            </Checkbox>
          ))}
        </Flex>
      </CheckboxGroup>

      {helperText && !hasError && <FormHelperText>{helperText}</FormHelperText>}
      {hasError && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
