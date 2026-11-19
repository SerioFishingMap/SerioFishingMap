import { CustomButton } from "../custom-button/button";

export const AddMemberButton = ({ ...props }) => {
  return <CustomButton label="+メンバーを追加" {...props}></CustomButton>;
};
