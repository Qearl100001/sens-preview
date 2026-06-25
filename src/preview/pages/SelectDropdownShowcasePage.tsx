import { Divider, Space, Typography } from "antd";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dropdownMenuDesignDoc from "../../design-system/components/base/dropdown-menu.design.md?raw";
import dropdownMenuDevDoc from "../../design-system/components/base/dropdown-menu.md?raw";
import type { FunctionalSkin } from "../../design-system/functional-skin";
import {
  DropdownMenuStatesPreview,
} from "../../ui";
import {
  SELECT_DROPDOWN_DEMO_WIDTH,
  SelectDropdownContentStatesPreview,
  SelectDropdownStatesPreview,
  SensSelectDropdown,
} from "../../ui/SensSelectDropdown";
import { DropdownMenuUsageScenarios } from "../DropdownMenuUsageScenarios";
import { ComponentShowcaseLayout } from "../ComponentShowcaseLayout";

const { Text } = Typography;
const I18N_NS = "组件库";

const DEMO_OPTIONS = [
  { value: "a", label: "选项 A" },
  { value: "b", label: "选项 B" },
  { value: "c", label: "选项 C" },
];

const SEARCH_DEMO_OPTIONS = [
  { value: "1", label: "北京" },
  { value: "2", label: "上海" },
  { value: "3", label: "广州" },
  { value: "4", label: "深圳" },
  { value: "5", label: "杭州" },
  { value: "6", label: "成都" },
  { value: "7", label: "武汉" },
  { value: "8", label: "西安" },
  { value: "xm", label: "项目" },
  {
    value: "cq",
    label: "重庆市",
    searchText: "chongqing chong qing cq",
  },
];

type PreviewOutletContext = {
  skin: FunctionalSkin;
};

function SelectDropdownDemo() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const placeholder = t(`${I18N_NS}.sensd-select-placeholder`, { defaultValue: "请选择" });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SensSelectDropdown
        functionalSkin={skin}
        placeholder={placeholder}
        style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
        options={DEMO_OPTIONS}
        defaultValue="b"
      />
      <SensSelectDropdown
        functionalSkin={skin}
        searchable
        searchMode="local"
        placeholder="可搜索选择"
        style={{ width: SELECT_DROPDOWN_DEMO_WIDTH }}
        defaultOpen
        options={SEARCH_DEMO_OPTIONS}
        defaultValue="2"
      />
      <Divider style={{ margin: 0 }} />
      <DropdownMenuUsageScenarios />
    </Space>
  );
}

function SelectDropdownMatrix() {
  const { skin } = useOutletContext<PreviewOutletContext>();
  const { t } = useTranslation();
  const label = (key: string, defaultValue: string) => t(`${I18N_NS}.${key}`, { defaultValue });

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <SelectDropdownStatesPreview title="R1 · 选项行 2×5" functionalSkin={skin} />
      <SelectDropdownContentStatesPreview title="R2 · 内容区六面" functionalSkin={skin} />
      <DropdownMenuStatesPreview
        title={label("sensd-dropdown-menu-matrix-title", "下拉菜单 / 选项行")}
      />
    </Space>
  );
}

export default function SelectDropdownShowcasePage() {
  return (
    <ComponentShowcaseLayout
      title="下拉浮层 Select Dropdown"
      demo={<SelectDropdownDemo />}
      matrix={<SelectDropdownMatrix />}
      designDocSource={dropdownMenuDesignDoc}
      devDocSource={dropdownMenuDevDoc}
    />
  );
}
