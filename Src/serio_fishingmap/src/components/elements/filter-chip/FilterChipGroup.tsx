"use client";
{
  /* usage
<FilterChipGroup
  options={["React", "Next.js", "Chakra UI", "TypeScript"]}
  defaultSelected={["React"]}
  onChange={(selected) => console.log("選択されたタグ:", selected)}
/>; */
}

import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { FilterChip } from "./FilterChip";

type FilterChipGroupProps = {
  options: string[]; // 表示するチップのラベル一覧
  defaultSelected?: string[]; // 最初に選択されているチップ
  onChange?: (selected: string[]) => void; // 選択状態の変更を通知
}

export const FilterChipGroup = ({
  options,
  defaultSelected = [],
  onChange,
}: FilterChipGroupProps) => {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  const handleToggle = (label: string) => {
    const newSelected = selected.includes(label)
      ? selected.filter((item) => item !== label)
      : [...selected, label];

    setSelected(newSelected);
    onChange?.(newSelected);
  };

  return (
    <HStack spacing={2} wrap="wrap">
      {options.map((label) => (
        <FilterChip
          key={label}
          label={label}
          isSelected={selected.includes(label)}
          onToggle={() => { handleToggle(label); }}
        />
      ))}
    </HStack>
  );
};
