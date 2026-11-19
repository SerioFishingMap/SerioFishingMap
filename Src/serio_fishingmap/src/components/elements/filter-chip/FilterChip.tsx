import { HStack, Icon, Tag, TagLabel } from "@chakra-ui/react";
import type { IconProps } from "@chakra-ui/react";

const CheckMarkIcon = (props: IconProps) => (
  <Icon viewBox="0 0 20 20" {...props}>
    <path
      fill="currentColor"
      d="M7.629 13.296L4.333 10l-1.414 1.414 4.71 4.71 9.21-9.21L15.424 5.5z"
    />
  </Icon>
);

type FilterChipProps = {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
};

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onToggle,
}) => {
  return (
    <Tag
      size="md"
      borderRadius="full"
      variant={isSelected ? "solid" : "outline"}
      colorScheme={isSelected ? "teal" : "gray"}
      cursor="pointer"
      onClick={onToggle}
      userSelect="none"
      px={3}
      py={1}
    >
      <HStack spacing={1}>
        {isSelected && <CheckMarkIcon boxSize={3} color="white" />}
        <TagLabel>{label}</TagLabel>
      </HStack>
    </Tag>
  );
};
