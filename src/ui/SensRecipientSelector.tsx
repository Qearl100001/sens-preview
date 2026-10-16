import { useMemo, useState, type CSSProperties } from "react";
import { getColorToken, tokenRgba } from "../design-system/color-utils";
import { getDividerColor } from "../design-system/divider";
import { getTypographyToken } from "../design-system/typography";
import { getUnitToken } from "../design-system/unit";
import { functionalCssVar } from "../design-system/functional-skin";
import { SensButton } from "./SensButton";
import { SensBadge } from "./SensBadge";
import { SensCheckbox } from "./SensCheckbox";
import { SensEmptyState } from "./SensEmptyState";
import { SearchInput } from "./SearchInput";
import { SearchHighlight } from "./SearchHighlight";
import { SensLineTabs } from "./SensTabs";
import { SensPopover } from "./SensPopover";
import { SensIcon } from "../design-system/icons";
import "./recipient-selector.css";

export type SensRecipientKind = "member" | "role" | "position";

export interface SensRecipientOption {
  value: string;
  label: string;
  kind: SensRecipientKind;
  description?: string;
}

export interface SensRecipientSelectorProps {
  options: SensRecipientOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  triggerLabel?: string;
  maxVisible?: number;
  totalCount?: number;
  loading?: boolean;
  disabled?: boolean;
}

const KIND_LABEL: Record<SensRecipientKind, string> = {
  member: "成员",
  role: "角色",
  position: "职务",
};

function buildVars(): CSSProperties {
  return {
    "--sens-recipient-surface": getColorToken("white"),
    "--sens-recipient-muted": tokenRgba("background-transparent-grey", 0.04),
    "--sens-recipient-border": getDividerColor("weak", "transparent"),
    "--sens-recipient-text": tokenRgba("text-color-transparent", 0.9),
    "--sens-recipient-subtext": tokenRgba("text-sub-color-transparent", 0.58),
    "--sens-recipient-disabled": tokenRgba("text-color-transparent-disable", 0.3),
    "--sens-recipient-link": getColorToken("link-color"),
    "--sens-recipient-primary": getColorToken("component-primary"),
    "--sens-recipient-selected-background": functionalCssVar("--sens-skin-active-bg", "component-active-background"),
    "--sens-recipient-radius": `${getUnitToken("radius/m")}px`,
    "--sens-recipient-remove-size": `${getUnitToken("size/component-height/s")}px`,
    "--sens-recipient-gap": `${getUnitToken("spacing/2x")}px`,
    "--sens-recipient-font": `${getTypographyToken("font-size/m")}px`,
    "--sens-recipient-line": `${getTypographyToken("line-height/m")}px`,
    "--sens-recipient-font-small": `${getTypographyToken("font-size/s")}px`,
    "--sens-recipient-line-small": `${getTypographyToken("line-height/s")}px`,
    "--sens-recipient-title-font": `${getTypographyToken("font-size/m")}px`,
    "--sens-recipient-title-line": `${getTypographyToken("line-height/m")}px`,
    "--sens-recipient-font-weight-regular": String(getTypographyToken("font-weight/regular")),
    "--sens-recipient-title-weight": String(getTypographyToken("font-weight/medium")),
    "--sens-recipient-warning": getColorToken("warning-color"),
    "--sens-recipient-semibold": getTypographyToken("font-weight/semibold"),
    "--sens-recipient-space-top": `${getUnitToken("spacing/1․5x")}px`,
    "--sens-recipient-space-inline": `${getUnitToken("spacing/3x")}px`,
    "--sens-recipient-space-item": `${getUnitToken("spacing/2x")}px`,
    "--sens-recipient-space-group": `${getUnitToken("spacing/4x")}px`,
    "--sens-recipient-footer-height": `${getUnitToken("size/component-height/xl")}px`,
  } as CSSProperties;
}

/** 成员 / 角色 / 职务的分组穿梭选择；数据与已选值由业务方提供。 */
export function SensRecipientSelector({
  options,
  value,
  defaultValue = [],
  onChange,
  triggerLabel = "选择对象",
  maxVisible = 500,
  totalCount,
  loading = false,
  disabled = false,
}: SensRecipientSelectorProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [draftValue, setDraftValue] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeKind, setActiveKind] = useState<SensRecipientKind>("member");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<SensRecipientKind[]>(["member"]);
  const selected = value ?? internalValue;
  const draftSet = useMemo(() => new Set(draftValue), [draftValue]);
  const visibleOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return options
      .filter((option) => option.kind === activeKind)
      .filter((option) => !query || `${option.label} ${option.description ?? ""}`.toLocaleLowerCase().includes(query))
      .slice(0, maxVisible);
  }, [activeKind, maxVisible, options, search]);
  const activeTotalCount = totalCount ?? options.filter((option) => option.kind === activeKind).length;
  const showLoading = loading && activeTotalCount > 100;
  const update = (next: string[]) => {
    const unique = Array.from(new Set(next));
    if (value === undefined) setInternalValue(unique);
    onChange?.(unique);
  };
  const toggleDraft = (id: string, checked: boolean) => {
    setDraftValue((current) => checked ? [...new Set([...current, id])] : current.filter((item) => item !== id));
  };
  const selectedByKind = (kind: SensRecipientKind) => options.filter((option) => option.kind === kind && draftSet.has(option.value));
  const availableCount = search.trim() ? visibleOptions.length : totalCount ?? visibleOptions.length;
  const tabItems = [
    { key: "member", label: KIND_LABEL.member },
    { key: "role", label: KIND_LABEL.role },
    { key: "position", label: KIND_LABEL.position },
  ];
  const content = (
    <div className="sens-recipient-selector" style={buildVars()}>
      <div className="sens-recipient-selector__panes">
        <section className="sens-recipient-selector__pane" aria-label="候选对象">
          <div className="sens-recipient-selector__tabs">
            <SensLineTabs
              items={tabItems}
              activeKey={activeKind}
              size="small"
              barOnly
              onChange={(key) => { setActiveKind(key as SensRecipientKind); setSearch(""); }}
            />
          </div>
          <SearchInput
            aria-label={`搜索${KIND_LABEL[activeKind]}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索"
            visualVariant="minimal"
            width={200}
            style={{ width: "100%" }}
            className="sens-recipient-selector__search"
          />
          <div className="sens-recipient-selector__count">共 {availableCount} 条数据</div>
          <div className="sens-recipient-selector__options" aria-busy={showLoading || undefined}>
            {visibleOptions.map((option) => (
              <SensCheckbox
                key={option.value}
                checked={draftSet.has(option.value)}
                className={draftSet.has(option.value) ? "is-selected" : undefined}
                onChange={(event) => toggleDraft(option.value, event.target.checked)}
              >
                <span className="sens-recipient-selector__option-label"><SearchHighlight text={option.label} keyword={search} /></span>
                {option.description ? <span className="sens-recipient-selector__option-description">（<SearchHighlight text={option.description} keyword={search} />）</span> : null}
              </SensCheckbox>
            ))}
            {visibleOptions.length === 0 ? (
              <SensEmptyState
                scope="non-page"
                type="noResult"
                size="special"
                className="sens-recipient-selector__empty"
                title="暂无匹配对象"
                description={null}
              />
            ) : null}
            {showLoading ? <div className="sens-recipient-selector__loading" role="status" aria-label="加载中"><SensIcon name="loading" size={20} /></div> : null}
          </div>
        </section>
        <section className="sens-recipient-selector__pane sens-recipient-selector__selected" aria-label="已选对象">
          <div className="sens-recipient-selector__groups">
            {(["member", "role", "position"] as const).map((kind) => {
              const items = selectedByKind(kind);
              const isExpanded = expanded.includes(kind);
              return (
                <div className="sens-recipient-selector__group" key={kind}>
                  <button
                    type="button"
                    className="sens-recipient-selector__group-toggle"
                    aria-expanded={isExpanded}
                    onClick={() => setExpanded((current) => isExpanded ? current.filter((item) => item !== kind) : [...current, kind])}
                  >
                    <SensIcon name="chevron-right" size={16} className={isExpanded ? "sens-recipient-selector__chevron is-open" : "sens-recipient-selector__chevron"} />
                    <strong>{KIND_LABEL[kind]}</strong>
                    <SensBadge variant="weakCount" count={items.length} showZero weakState="default" weakSurface="transparent" />
                  </button>
                  {isExpanded && items.length > 0 ? (
                    <ul className="sens-recipient-selector__selected-list">
                      {items.map((item) => (
                        <li key={item.value}>
                          <span>{item.label}</span>
                          <SensButton
                            htmlType="button"
                            tone="dangerLinkWeak"
                            icon={<SensIcon name="close" size={16} />}
                            className="sens-recipient-selector__remove"
                            aria-label={`移除${item.label}`}
                            onClick={() => toggleDraft(item.value, false)}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="sens-recipient-selector__selected-footer">
            <SensButton tone="linkWeak" disabled={draftValue.length === 0} onClick={() => setDraftValue([])}>清空</SensButton>
            <span className="sens-recipient-selector__selected-count">已选 {draftValue.length} 个</span>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <SensPopover
      title="选择对象"
      content={content}
      size="large"
      placement="bottom"
      align="end"
      open={open}
      onOpenChange={(next) => {
        if (next) setDraftValue([...selected]);
        setOpen(next);
      }}
      disabled={disabled}
      className="sens-recipient-selector-popover"
      style={{ "--sens-popover-width": "min(720px, calc(100vw - 32px))" } as CSSProperties}
      actions={
        <>
          <SensButton tone="secondary" onClick={() => { setSearch(""); setOpen(false); }}>放 弃</SensButton>
          <SensButton tone="primary" onClick={() => { update(draftValue); setSearch(""); setOpen(false); }}>完成选择</SensButton>
        </>
      }
    >
      <SensButton tone="link" disabled={disabled}>{triggerLabel}</SensButton>
    </SensPopover>
  );
}
