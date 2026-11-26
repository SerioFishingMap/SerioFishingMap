// components/TimeInput.tsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";

type TimeInputValue = string; // "HH:mm" or "HH:mm:ss"

export type TimeInputProps = {
  value?: TimeInputValue; // "HH:mm" or "HH:mm:ss"
  onChange?: (value: TimeInputValue) => void;
  label?: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  showSeconds?: boolean; // true: "HH:mm:ss", false: "HH:mm"
  minuteStep?: number; // default 1
  secondStep?: number; // default 1
  leftAddon?: React.ReactNode; // e.g. timezone display
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

const pad2 = (n: number) => n.toString().padStart(2, "0");

const parseTimeString = (str?: string, showSeconds?: boolean) => {
  if (!str) return { hh: 0, mm: 0, ss: 0 };
  const parts = str.split(":").map((x) => Number(x));
  const [hh = 0, mm = 0, ss = 0] = parts;
  return {
    hh: clamp(isNaN(hh) ? 0 : hh, 0, 23),
    mm: clamp(isNaN(mm) ? 0 : mm, 0, 59),
    ss: clamp(isNaN(ss) ? 0 : ss, 0, 59) * (showSeconds ? 1 : 0),
  };
};

export const TimeInput: React.FC<TimeInputProps> = ({
  value = "00:00",
  onChange,
  label,
  helperText,
  error,
  isRequired,
  isDisabled,
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  leftAddon,
}) => {
  const { hh, mm, ss } = useMemo(
    () => parseTimeString(value, showSeconds),
    [value, showSeconds]
  );

  const emitChange = useCallback(
    (nextHH: number, nextMM: number, nextSS: number) => {
      const base = `${pad2(clamp(nextHH, 0, 23))}:${pad2(clamp(nextMM, 0, 59))}`;
      const next = showSeconds ? `${base}:${pad2(clamp(nextSS, 0, 59))}` : base;
      onChange?.(next);
    },
    [onChange, showSeconds]
  );

  const onHourChange = (valStr: string, valNum: number) => {
    const v = isNaN(valNum) ? 0 : valNum;
    emitChange(clamp(v, 0, 23), mm, ss);
  };
  const onMinuteChange = (valStr: string, valNum: number) => {
    const v = isNaN(valNum) ? 0 : valNum;
    // ステップにスナップ（任意）
    const snapped = clamp(Math.round(v / minuteStep) * minuteStep, 0, 59);
    emitChange(hh, snapped, ss);
  };
  const onSecondChange = (valStr: string, valNum: number) => {
    const v = isNaN(valNum) ? 0 : valNum;
    const snapped = clamp(Math.round(v / secondStep) * secondStep, 0, 59);
    emitChange(hh, mm, snapped);
  };

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}

        <HStack spacing={2} role="group" aria-label="time-input">
          {/* Hour */}
          <NumberInput
            value={pad2(hh)}
            min={0}
            max={23}
            onChange={onHourChange}
            keepWithinRange
            clampValueOnBlur
            step={1}
            inputMode="numeric"
          >
            <NumberInputField aria-label="hour" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Text>:</Text>

          {/* Minute */}
          <NumberInput
            value={pad2(mm)}
            min={0}
            max={59}
            onChange={onMinuteChange}
            keepWithinRange
            clampValueOnBlur
            step={minuteStep}
            inputMode="numeric"
          >
            <NumberInputField aria-label="minute" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          {showSeconds && (
            <>
              <Text>:</Text>
              {/* Second */}
              <NumberInput
                value={pad2(ss)}
                min={0}
                max={59}
                onChange={onSecondChange}
                keepWithinRange
                clampValueOnBlur
                step={secondStep}
                inputMode="numeric"
              >
                <NumberInputField aria-label="second" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </>
          )}
        </HStack>
      </InputGroup>

      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default TimeInput;
