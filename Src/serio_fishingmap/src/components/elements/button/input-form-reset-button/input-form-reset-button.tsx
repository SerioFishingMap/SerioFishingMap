import { CustomButton } from "../custom-button/button";

export const InputFormResetButton = ({ ...props }) => {
  return (
    <CustomButton
      mode="secondary"
      label="入力内容をリセット"
      {...props}
    ></CustomButton>
  );
};
