import { Popover } from "antd";
import { useMemo, useState, type CSSProperties } from "react";
import { getColorToken, tokenRgba } from "../../../design-system/color-utils";
import { getDividerColor, getDividerHairlineWidth } from "../../../design-system/divider";
import { buildFunctionalActiveRingShadow, functionalCssVar } from "../../../design-system/functional-skin";
import { SensIcon } from "../../../design-system/icons";
import { getTypographyToken } from "../../../design-system/typography";
import { getUnitToken } from "../../../design-system/unit";
import {
  SearchInput,
  SensButton,
  SensCheckbox,
  SensCheckboxGroup,
  SensMessageProvider,
  SensPageTitleBar,
  SensRadioGroup,
  SensSectionTitle,
  SensSelectDropdown,
  useSensMessage,
} from "../../../ui";
import {
  SensTopNavigation,
  type SensTopNavigationItem,
} from "../../../ui";
import "./sdh-feature-segment-create.css";

type SelectionMode = "single" | "multiple";

interface FeatureItem {
  id: string;
  name: string;
  help?: string;
  mode: SelectionMode;
  operator: string;
  values: string[];
  showAll?: boolean;
  visibleLimit?: number;
}

interface FeatureGroup {
  id: string;
  title: string;
  features: FeatureItem[];
}

interface DisplaySettings {
  showUnlimitedValues: boolean;
  groupsExpanded: boolean;
}

const DISPLAY_SETTINGS_KEY = "sens-preview:sdh-feature-segment-create:display-settings";

const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  showUnlimitedValues: true,
  groupsExpanded: true,
};

const PRODUCT_NAV_ITEMS: SensTopNavigationItem[] = [
  { label: "概览" },
  { label: "分析" },
  { label: "用户分群" },
  { label: "用户洞察" },
  { label: "智能运营" },
  { label: "数据管理", arrow: true },
  { label: "更多", arrow: true },
];

const TEMPLATE_OPTIONS = [
  { label: "学生", value: "student" },
  { label: "东亚银行排除规则模板", value: "bea-exclusion" },
];

const OPERATOR_OPTIONS = [
  { label: "等于", value: "等于" },
  { label: "包含", value: "包含" },
  { label: "有值", value: "有值" },
  { label: "无值", value: "无值" },
];

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "group-long",
    title:
      "超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长展示超长",
    features: [
      {
        id: "exclusion-ctmd",
        name: "Exclusion Rules",
        help: "信贷分期业务排除规则；模板配置为单选。",
        mode: "single",
        operator: "等于",
        values: ["Yes", "No"],
      },
      {
        id: "account-status",
        name: "账户状态",
        mode: "multiple",
        operator: "等于",
        values: ["正常", "冻结", "注销", "休眠", "待激活", "审核中", "已归档"],
        showAll: true,
      },
      {
        id: "device-id",
        name: "设备 ID",
        mode: "single",
        operator: "等于",
        values: ["Device ID", "IDFA", "IDFV", "Android ID", "IMEI"],
      },
      {
        id: "channel",
        name: "渠道来源",
        mode: "multiple",
        operator: "包含",
        values: ["App Store", "Google Play", "官网", "应用宝", "华为", "小米", "OPPO", "vivo", "其他"],
        showAll: true,
        visibleLimit: 6,
      },
    ],
  },
  {
    id: "group-payment",
    title: "支付信息",
    features: [
      {
        id: "pay-method",
        name: "支付方式",
        mode: "multiple",
        operator: "包含",
        values: ["信用卡", "借记卡", "余额", "分期"],
        showAll: true,
      },
      {
        id: "exclusion-card",
        name: "Exclusion Rules for Card",
        help: "信用卡业务排除规则；模板配置为单选。",
        mode: "single",
        operator: "等于",
        values: ["Yes", "No"],
      },
    ],
  },
];

function px(value: number): string {
  return `${value}px`;
}

function loadDisplaySettings(): DisplaySettings {
  try {
    return {
      ...DEFAULT_DISPLAY_SETTINGS,
      ...JSON.parse(localStorage.getItem(DISPLAY_SETTINGS_KEY) || "{}"),
    };
  } catch {
    return { ...DEFAULT_DISPLAY_SETTINGS };
  }
}

function buildPageVars(): CSSProperties {
  return {
    "--sdh-segment-page-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sdh-segment-surface": getColorToken("white"),
    "--sdh-segment-muted-surface": tokenRgba("background-transparent-grey", 0.04),
    "--sdh-segment-text": tokenRgba("text-color-transparent", 0.9),
    "--sdh-segment-sub-text": tokenRgba("text-sub-color-transparent", 0.58),
    "--sdh-segment-icon": getColorToken("icon-color-transparent"),
    "--sdh-segment-link": getColorToken("link-color"),
    "--sdh-segment-outline": tokenRgba("outline-color-transparent", 0.12),
    "--sdh-segment-divider": getDividerColor("light", "transparent"),
    "--sdh-segment-divider-width": px(getDividerHairlineWidth()),
    "--sdh-segment-radius": px(getUnitToken("radius/l")),
    "--sdh-segment-chip-radius": px(getUnitToken("radius/s")),
    "--sdh-segment-page-padding": px(getUnitToken("spacing/vertical/6x")),
    "--sdh-segment-section-gap": px(getUnitToken("spacing/vertical/10x")),
    "--sdh-segment-content-gap": px(getUnitToken("spacing/vertical/4x")),
    "--sdh-segment-row-gap": px(getUnitToken("spacing/vertical/5x")),
    "--sdh-segment-tight-gap": px(getUnitToken("spacing/vertical/2x")),
    "--sdh-segment-inline-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sdh-segment-row-column-gap": px(getUnitToken("spacing/horizontal/6x")),
    "--sdh-segment-icon-gap": px(getUnitToken("spacing/horizontal/1x")),
    "--sdh-segment-value-gap": px(getUnitToken("spacing/horizontal/4x")),
    "--sdh-segment-body-size": px(getTypographyToken("font-size/m")),
    "--sdh-segment-body-line": px(getTypographyToken("line-height/m")),
    "--sdh-segment-heading-size": px(getTypographyToken("font-size/m")),
    "--sdh-segment-heading-line": px(getTypographyToken("line-height/m")),
    "--sdh-segment-heading-weight": getTypographyToken("font-weight/semibold"),
    "--sdh-segment-help-size": px(getTypographyToken("font-size/s")),
    "--sdh-segment-help-line": px(getTypographyToken("line-height/s")),
    "--sdh-segment-chip-bg": tokenRgba("background-transparent-grey", 0.04),
    "--sdh-segment-unlimited-active-bg": functionalCssVar("--sens-skin-light-bg", "component-light-background"),
    "--sdh-segment-unlimited-active-text": functionalCssVar("--sens-skin-primary", "component-primary"),
    "--sdh-segment-focus-ring": buildFunctionalActiveRingShadow(),
    "--sdh-segment-content-radius": px(getUnitToken("radius/xl")),
  } as CSSProperties;
}

function createInitialUnlimited(): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const group of FEATURE_GROUPS) {
    for (const feature of group.features) {
      next[feature.id] = feature.id === "channel" || feature.id === "pay-method";
    }
  }
  return next;
}

function createInitialSelections(): Record<string, string | string[]> {
  return {
    "exclusion-ctmd": "Yes",
    "account-status": ["正常", "冻结"],
    "device-id": "Device ID",
    "channel": [],
    "pay-method": [],
    "exclusion-card": "No",
  };
}

function createInitialOperators(): Record<string, string> {
  const next: Record<string, string> = {};
  for (const group of FEATURE_GROUPS) {
    for (const feature of group.features) {
      next[feature.id] = feature.operator;
    }
  }
  return next;
}

function createInitialExpanded(groupsExpanded: boolean): Record<string, boolean> {
  const next: Record<string, boolean> = {};
  for (const group of FEATURE_GROUPS) {
    next[group.id] = groupsExpanded;
  }
  return next;
}

function DisplaySettingsPanel({
  value,
  onCancel,
  onSave,
}: {
  value: DisplaySettings;
  onCancel: () => void;
  onSave: (next: DisplaySettings) => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <div className="sdh-segment-settings" role="dialog" aria-label="展示设置">
      <div className="sdh-segment-settings-title">展示设置</div>
      <div className="sdh-segment-settings-field">
        <div className="sdh-segment-settings-label">不限状态展示</div>
        <SensRadioGroup
          aria-label="不限状态展示"
          value={draft.showUnlimitedValues ? "show" : "hide"}
          options={[
            { label: "展示特征值", value: "show" },
            { label: "不展示特征值", value: "hide" },
          ]}
          onChange={(next) => setDraft((current) => ({ ...current, showUnlimitedValues: next === "show" }))}
        />
      </div>
      <div className="sdh-segment-settings-field">
        <div className="sdh-segment-settings-label">特征组默认状态</div>
        <SensRadioGroup
          aria-label="特征组默认状态"
          value={draft.groupsExpanded ? "expanded" : "collapsed"}
          options={[
            { label: "默认展开", value: "expanded" },
            { label: "默认折叠", value: "collapsed" },
          ]}
          onChange={(next) => setDraft((current) => ({ ...current, groupsExpanded: next === "expanded" }))}
        />
      </div>
      <div className="sdh-segment-settings-actions">
        <SensButton tone="secondary" size="small" onClick={onCancel}>
          取消
        </SensButton>
        <SensButton tone="primary" size="small" onClick={() => onSave(draft)}>
          保存
        </SensButton>
      </div>
    </div>
  );
}

function FeatureValues({
  feature,
  unlimited,
  showUnlimitedValues,
  selection,
  operator,
  expandedMore,
  onOperatorChange,
  onSelectionChange,
  onExitUnlimited,
  onToggleMore,
}: {
  feature: FeatureItem;
  unlimited: boolean;
  showUnlimitedValues: boolean;
  selection: string | string[];
  operator: string;
  expandedMore: boolean;
  onOperatorChange: (value: string) => void;
  onSelectionChange: (value: string | string[]) => void;
  onExitUnlimited: () => void;
  onToggleMore: () => void;
}) {
  const hidden = unlimited && !showUnlimitedValues;
  const muted = unlimited && showUnlimitedValues;
  const limit = feature.visibleLimit ?? feature.values.length;
  const visibleValues = expandedMore ? feature.values : feature.values.slice(0, limit);
  const hasMore = feature.values.length > limit;

  const exitIfNeeded = () => {
    if (unlimited) onExitUnlimited();
  };

  return (
    <div
      className={`sdh-segment-value-zone${hidden ? " is-hidden" : ""}${muted ? " is-muted" : ""}`}
      onFocusCapture={exitIfNeeded}
    >
      <SensSelectDropdown
        options={OPERATOR_OPTIONS}
        value={operator}
        popupMatchSelectWidth={false}
        onChange={(value) => {
          exitIfNeeded();
          onOperatorChange(String(value));
        }}
      />
      <span className="sdh-segment-divider" aria-hidden="true" />
      {feature.mode === "single" ? (
        <SensRadioGroup
          aria-label={`${feature.name} 候选值`}
          name={feature.id}
          value={typeof selection === "string" ? selection : undefined}
          options={visibleValues.map((item) => ({ label: item, value: item }))}
          onChange={(value) => {
            exitIfNeeded();
            onSelectionChange(value);
          }}
        />
      ) : (
        <>
          {feature.showAll ? (
            <SensCheckbox
              checked={
                Array.isArray(selection) &&
                feature.values.length > 0 &&
                feature.values.every((item) => selection.includes(item))
              }
              indeterminate={
                Array.isArray(selection) &&
                selection.length > 0 &&
                selection.length < feature.values.length
              }
              onChange={(event) => {
                exitIfNeeded();
                onSelectionChange(event.target.checked ? [...feature.values] : []);
              }}
            >
              全选
            </SensCheckbox>
          ) : null}
          <SensCheckboxGroup
            aria-label={`${feature.name} 候选值`}
            value={Array.isArray(selection) ? selection : []}
            options={visibleValues.map((item) => ({ label: item, value: item }))}
            onChange={(value) => {
              exitIfNeeded();
              onSelectionChange(value);
            }}
          />
        </>
      )}
      {hasMore ? (
        <button type="button" className="sdh-segment-more" onClick={onToggleMore}>
          <span>{expandedMore ? "收起" : "更多"}</span>
          <SensIcon name={expandedMore ? "chevron-up" : "chevron-down"} sizeToken="size/icon/s" color="currentColor" />
        </button>
      ) : null}
    </div>
  );
}

function SegmentCreateContent() {
  const message = useSensMessage();
  const [template, setTemplate] = useState("student");
  const [search, setSearch] = useState("");
  const [configuredOnly, setConfiguredOnly] = useState(false);
  const [displaySettings, setDisplaySettings] = useState(loadDisplaySettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState(() => createInitialExpanded(loadDisplaySettings().groupsExpanded));
  const [unlimitedMap, setUnlimitedMap] = useState(createInitialUnlimited);
  const [selections, setSelections] = useState(createInitialSelections);
  const [operators, setOperators] = useState(createInitialOperators);
  const [moreExpanded, setMoreExpanded] = useState<Record<string, boolean>>({});

  const query = search.trim().toLowerCase();

  const visibleGroups = useMemo(() => {
    return FEATURE_GROUPS.map((group) => {
      const features = group.features.filter((feature) => {
        if (configuredOnly && unlimitedMap[feature.id]) return false;
        if (!query) return true;
        return feature.name.toLowerCase().includes(query);
      });
      return { ...group, features };
    }).filter((group) => group.features.length > 0);
  }, [configuredOnly, query, unlimitedMap]);

  const emptyConfigured = configuredOnly && visibleGroups.length === 0;

  function toggleUnlimited(featureId: string) {
    setUnlimitedMap((current) => {
      const nextUnlimited = !current[featureId];
      if (nextUnlimited && configuredOnly) {
        message.info("已移出「仅看已配置」结果");
      }
      if (nextUnlimited) {
        setSelections((prev) => ({
          ...prev,
          [featureId]: Array.isArray(prev[featureId]) ? [] : "",
        }));
      }
      return { ...current, [featureId]: nextUnlimited };
    });
  }

  function saveDisplaySettings(next: DisplaySettings) {
    setDisplaySettings(next);
    localStorage.setItem(DISPLAY_SETTINGS_KEY, JSON.stringify(next));
    setGroupExpanded(createInitialExpanded(next.groupsExpanded));
    setSettingsOpen(false);
    message.success("展示设置已同步");
  }

  return (
    <main className="sdh-segment-page" style={buildPageVars()}>
      <div className="sdh-segment-page__navigation-layer">
        <SensTopNavigation embedded atmosphere activeNavLabel="用户分群" items={PRODUCT_NAV_ITEMS} />
      </div>
      <div className="sdh-segment-page__workspace">
        <SensPageTitleBar
          variant="drilldown"
          title="创建分群"
          breadcrumbItems={[
            { key: "root", label: "实体分群管理" },
            { key: "create", label: "创建分群" },
          ]}
          onBack={() => window.history.back()}
          actions={
            <div className="sdh-segment-actions">
              <SensButton tone="secondary">放弃</SensButton>
              <SensButton
                tone="primary"
                onClick={() => message.success("分群已提交（预览，无后端）")}
              >
                提交
              </SensButton>
            </div>
          }
        />

        <div className="sdh-segment-body">
        <section className="sdh-segment-module" aria-label="创建方式">
          <SensSectionTitle title="创建方式" />
          <div className="sdh-segment-module-body">
            <div className="sdh-segment-inline-meta">
              <span>特征创建</span>
              <SensButton tone="link" size="small">
                切换
              </SensButton>
            </div>
          </div>
        </section>

        <section className="sdh-segment-module" aria-label="分群规则">
          <SensSectionTitle title="分群规则" />
          <div className="sdh-segment-module-body">
            <div className="sdh-segment-toolbar">
              <label className="sdh-segment-template-field">
                <span>模板</span>
                <SensSelectDropdown
                  options={TEMPLATE_OPTIONS}
                  value={template}
                  popupMatchSelectWidth={false}
                  onChange={(value) => setTemplate(String(value))}
                />
              </label>
              <div className="sdh-segment-toolbar-end">
                <SearchInput
                  width={220}
                  placeholder="搜索特征名"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <SensCheckbox
                  checked={configuredOnly}
                  onChange={(event) => setConfiguredOnly(event.target.checked)}
                >
                  仅看已配置
                </SensCheckbox>
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  open={settingsOpen}
                  onOpenChange={setSettingsOpen}
                  content={
                    <DisplaySettingsPanel
                      value={displaySettings}
                      onCancel={() => setSettingsOpen(false)}
                      onSave={saveDisplaySettings}
                    />
                  }
                >
                  <SensButton tone="link" size="small">
                    展示设置
                  </SensButton>
                </Popover>
              </div>
            </div>

            {emptyConfigured ? (
              <div className="sdh-segment-empty">
                <span>暂无已配置特征</span>
                <SensButton tone="secondary" onClick={() => setConfiguredOnly(false)}>
                  查看全部特征
                </SensButton>
              </div>
            ) : (
              <div className="sdh-segment-groups">
                {visibleGroups.map((group) => {
                  const expanded = groupExpanded[group.id] ?? true;
                  return (
                    <section key={group.id} className="sdh-segment-group" aria-label={group.title}>
                      <div className="sdh-segment-group-header">
                        <div className="sdh-segment-group-title">
                          <button
                            type="button"
                            className="sdh-segment-group-toggle"
                            aria-expanded={expanded}
                            aria-label={expanded ? "折叠特征组" : "展开特征组"}
                            onClick={() =>
                              setGroupExpanded((current) => ({ ...current, [group.id]: !expanded }))
                            }
                          >
                            <SensIcon
                              name={expanded ? "chevron-down" : "chevron-right"}
                              sizeToken="size/icon/m"
                              color="currentColor"
                            />
                          </button>
                          <span className="sdh-segment-group-title-text" title={group.title}>
                            {group.title}
                          </span>
                        </div>
                        <SensButton
                          tone="link"
                          size="small"
                          onClick={() =>
                            setUnlimitedMap((current) => {
                              const next = { ...current };
                              for (const feature of group.features) next[feature.id] = false;
                              return next;
                            })
                          }
                        >
                          全部展开组内特征值
                        </SensButton>
                      </div>
                      <div className="sdh-segment-group-body" hidden={!expanded}>
                        {group.features.map((feature) => {
                          const unlimited = unlimitedMap[feature.id] ?? true;
                          return (
                            <div key={feature.id} className="sdh-segment-row">
                              <div className="sdh-segment-feature-name">
                                <span className="sdh-segment-feature-name-text" title={feature.name}>
                                  {feature.name}
                                </span>
                                {feature.help ? (
                                  <span title={feature.help} aria-label={feature.help}>
                                    <SensIcon name="help" sizeToken="size/icon/m" color="currentColor" />
                                  </span>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                className={`sdh-segment-unlimited${unlimited ? " is-active" : ""}`}
                                aria-pressed={unlimited}
                                onClick={() => toggleUnlimited(feature.id)}
                              >
                                不限
                              </button>
                              <FeatureValues
                                feature={feature}
                                unlimited={unlimited}
                                showUnlimitedValues={displaySettings.showUnlimitedValues}
                                selection={selections[feature.id] ?? (feature.mode === "multiple" ? [] : "")}
                                operator={operators[feature.id] ?? feature.operator}
                                expandedMore={Boolean(moreExpanded[feature.id])}
                                onOperatorChange={(value) =>
                                  setOperators((current) => ({ ...current, [feature.id]: value }))
                                }
                                onSelectionChange={(value) =>
                                  setSelections((current) => ({ ...current, [feature.id]: value }))
                                }
                                onExitUnlimited={() =>
                                  setUnlimitedMap((current) => ({ ...current, [feature.id]: false }))
                                }
                                onToggleMore={() =>
                                  setMoreExpanded((current) => ({
                                    ...current,
                                    [feature.id]: !current[feature.id],
                                  }))
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="sdh-segment-module" aria-label="预估">
          <SensSectionTitle title="预估" />
          <div className="sdh-segment-module-body">
            <div className="sdh-segment-estimate">
              <p className="sdh-segment-estimate-copy">
                预估结果仅用于辅助判断分群规模，不作为最终投放受众口径。
              </p>
              <SensButton tone="secondary" onClick={() => message.info("预估能力未接入（预览）")}>
                预估
              </SensButton>
            </div>
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}

export default function SdhFeatureSegmentCreatePage() {
  return (
    <SensMessageProvider>
      <SegmentCreateContent />
    </SensMessageProvider>
  );
}
