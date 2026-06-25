import { theme } from "antd";
import { Fragment, useMemo } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface HighlightSegment {
  text: string;
  highlight: boolean;
}

/** 大小写不敏感字面子串匹配，全部命中段高亮。仅字面高亮；拼音/首字母过滤命中不在此处理。 */
export function splitByKeyword(text: string, keyword: string): HighlightSegment[] {
  const trimmed = keyword.trim();
  if (!trimmed) return [{ text, highlight: false }];

  const pattern = new RegExp(escapeRegExp(trimmed), "gi");
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlight: false });
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

export interface SearchHighlightProps {
  text: string;
  keyword: string;
  className?: string;
}

/** 关键词高亮：仅 label 字面子串；拼音过滤命中不高亮。仅 colorPrimary，禁 dangerouslySetInnerHTML */
export function SearchHighlight({ text, keyword, className }: SearchHighlightProps) {
  const { token } = theme.useToken();
  const segments = useMemo(() => splitByKeyword(text, keyword), [text, keyword]);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.highlight ? (
          <span
            key={index}
            className="sens-search-highlight"
            style={{ color: token.colorPrimary }}
          >
            {segment.text}
          </span>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </span>
  );
}
