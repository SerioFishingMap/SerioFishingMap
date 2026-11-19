import { Text } from "@chakra-ui/react";

type LabelProps = {
  text: string;
  size?: "sm" | "md" | "bodytext" | "subtitle" | "title"; // サイズの選択肢
  color?:
    | "primary"
    | "danger"
    | "secondary"
    | "success"
    | "warning"
    | "default"; // 色の選択肢
};

const sizeMap = {
  sm: "sm",
  md: "md",
  bodytext: "lg",
  subtitle: "3xl",
  title: "5xl",
};

const colorMap = {
  default: "black",
  primary: "cyan.600",
  danger: "red.500",
  secondary: "gray.600",
  success: "green.500",
  warning: "yellow.500",
};

export const Label = ({
  text,
  size = "bodytext",
  color = "default",
}: LabelProps) => {
  return (
    <Text fontSize={sizeMap[size]} color={colorMap[color]}>
      {text}
    </Text>
  );
};
