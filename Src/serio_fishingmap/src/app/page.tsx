"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClickFishList = () => {
    router.push("view-lists/fish-list");
  };
  const handleClickInputForm = () => {
    router.push("input-form");
  };

  const handleClickMainMap = () => {
    router.push("fishing-spot-main-map");
  };

  const handleClickMapPage = () => {
    router.push("mock");
  };

  return (
    <div>
      {/* 画面遷移の方法の標準については別途検討。ここではテストコードとして実装 */}
      <button onClick={handleClickFishList}>魚一覧へ</button>
      <br />
      <br />
      <button onClick={handleClickMapPage}>APIテストページへ</button>
      <br></br>
      <button onClick={handleClickInputForm}>入力フォームへ</button>
      <button onClick={handleClickMainMap}>メインマップへ</button>
    </div>
  );
}
