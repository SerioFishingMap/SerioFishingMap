import { Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";

/**
 * usage
 *
 * const [fruit, setFruit] = useState("");

  const options = [
    { label: "りんご", value: "apple" },
    { label: "みかん", value: "orange" },
    { label: "ぶどう", value: "grape" },
  ];
  <SelectBox
          label="好きなフルーツ"
          options={options}
          value={fruit}
          onChange={setFruit}
        />
 */

export type SelectOption = {
  label: string;
  value: string;
};

type SelectBoxProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function SelectBox({
  label,
  options,
  value,
  placeholder = "選択してください",
  onChange,
}: SelectBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      {label && (
        <label
          style={{ display: "block", marginBottom: "4px", fontWeight: 600 }}
        >
          {label}
        </label>
      )}
      <Select
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        borderRadius="md"
        focusBorderColor="teal.400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
