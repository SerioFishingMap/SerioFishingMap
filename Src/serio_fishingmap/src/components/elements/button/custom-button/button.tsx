import { Button, ButtonProps } from "@chakra-ui/react";
import { FC } from "react";

type CustomButtonProps = {
  mode?: "primary" | "danger" | "secondary" | "ghost" | "success" | "warning";
  label: string;
  size?: "lg" | "md" | "sm" | "xs";
  color?: string; //任意でオーバーライド
  leftIcon?: string;
  rightIcon?: string;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
} & ButtonProps;

const getModeStyles = (
  mode: string,
): { colorScheme: string; variant?: string } => {
  switch (mode) {
    case "danger":
      return { colorScheme: "red", variant: "solid" };
    case "secondary":
      return { colorScheme: "gray", variant: "solid" };
    case "ghost":
      return { colorScheme: "gray", variant: "ghost" };
    case "success":
      return { colorScheme: "green", variant: "solid" };
    case "warning":
      return { colorScheme: "yellow", variant: "solid" };
    case "primary":
    default:
      return { colorScheme: "cyan", variant: "solid" };
  }
};

export const CustomButton: FC<CustomButtonProps> = ({
  mode = "primary",
  label,
  size = "md",
  color,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  isDisabled = false,
  ...props
}) => {
  const { colorScheme, variant } = getModeStyles(mode);

  return (
    <Button
      spinnerPlacement="start"
      isDisabled={isDisabled}
      colorScheme={color ?? colorScheme}
      variant={variant}
      borderRadius="md"
      px={6}
      py={4}
      {...props}
    >
      {label}
    </Button>
  );
};
