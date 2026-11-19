import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

// usage

{
  /* <Box p={4}>
  <TextAreaInput
    label="メッセージ"
    value={text}
    onChange={(e) => {
      setText(e.target.value);
    }}
    placeholder="ここに入力してください"
    isRequired
  />
  <Button mt={4} onClick={handleSubmit} colorScheme="teal">
    送信
  </Button>
</Box> */
}

type TextAreaInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isRequired?: boolean;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  isRequired = false,
}) => {
  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        resize="vertical"
      />
    </FormControl>
  );
};

export default TextAreaInput;
