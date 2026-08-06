import cardDesignDocSource from "../../design-system/components/base/card.design.md?raw";
import cardDevDocSource from "../../design-system/components/base/card.md?raw";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";
import { CardInteractiveShowcase, CardMatrixPanel } from "./basic-styles/CardBasicStylePage";

export default function CardShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="卡片 Card"
      demo={<CardInteractiveShowcase />}
      matrix={<CardMatrixPanel />}
      designDocSource={cardDesignDocSource}
      devDocSource={cardDevDocSource}
    />
  );
}
