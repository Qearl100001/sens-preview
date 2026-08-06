import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { getUnitToken } from "../design-system/unit";
import { SensMessage, type MessageType } from "./SensMessage";

export type SensMessageDuration = number | null;

export type SensMessageOpenOptions = {
  key?: string;
  type?: MessageType;
  content: ReactNode;
  link?: ReactNode;
  closable?: boolean;
  duration?: SensMessageDuration;
  onClose?: () => void;
};

export type SensMessageShortcutOptions = Omit<SensMessageOpenOptions, "content" | "type">;

export type SensMessageClose = () => void;

export type SensMessageApi = {
  open: (options: SensMessageOpenOptions) => SensMessageClose;
  default: (content: ReactNode, options?: SensMessageShortcutOptions) => SensMessageClose;
  success: (content: ReactNode, options?: SensMessageShortcutOptions) => SensMessageClose;
  info: (content: ReactNode, options?: SensMessageShortcutOptions) => SensMessageClose;
  warning: (content: ReactNode, options?: SensMessageShortcutOptions) => SensMessageClose;
  loading: (content: ReactNode, options?: SensMessageShortcutOptions) => SensMessageClose;
  destroy: (key?: string) => void;
};

export type SensMessageProviderProps = {
  children?: ReactNode;
  hostStyle?: CSSProperties;
  /** 页面顶部偏移；默认使用 spacing/vertical/6x。 */
  top?: number;
};

type SensMessageNotice = Required<Pick<SensMessageOpenOptions, "key" | "type" | "content" | "closable">> &
  Pick<SensMessageOpenOptions, "link" | "duration" | "onClose">;

const DEFAULT_RESULT_DURATION = 3000;

const SensMessageContext = createContext<SensMessageApi | null>(null);

function createMessageKey(counter: number) {
  return `sens-message-${Date.now()}-${counter}`;
}

function resolveDuration(type: MessageType, duration: SensMessageDuration | undefined) {
  if (duration !== undefined) return duration;
  return type === "loading" ? null : DEFAULT_RESULT_DURATION;
}

function resolveClosable(type: MessageType, duration: SensMessageDuration, closable: boolean | undefined) {
  if (closable !== undefined) return closable;
  return duration === null && type !== "loading";
}

function SensMessageNoticeItem({
  notice,
  onClose,
}: {
  notice: SensMessageNotice;
  onClose: (key: string) => void;
}) {
  useEffect(() => {
    if (notice.duration === null || notice.duration === undefined) return undefined;
    const timer = window.setTimeout(() => onClose(notice.key), notice.duration);
    return () => window.clearTimeout(timer);
  }, [notice.duration, notice.key, onClose]);

  return (
    <SensMessage
      type={notice.type}
      closable={notice.closable}
      link={notice.link}
      onClose={() => onClose(notice.key)}
    >
      {notice.content}
    </SensMessage>
  );
}

export function SensMessageProvider({
  children,
  hostStyle,
  top = getUnitToken("spacing/vertical/6x"),
}: SensMessageProviderProps) {
  const [notices, setNotices] = useState<SensMessageNotice[]>([]);
  const noticesRef = useRef<SensMessageNotice[]>([]);
  const counterRef = useRef(0);
  const stackGap = getUnitToken("spacing/vertical/4x");

  useEffect(() => {
    noticesRef.current = notices;
  }, [notices]);

  const closeNotice = useCallback((key: string) => {
    const target = noticesRef.current.find((notice) => notice.key === key);
    setNotices((current) => current.filter((notice) => notice.key !== key));
    target?.onClose?.();
  }, []);

  const open = useCallback(
    (options: SensMessageOpenOptions) => {
      const type = options.type ?? "default";
      const duration = resolveDuration(type, options.duration);
      const key = options.key ?? createMessageKey((counterRef.current += 1));
      const notice: SensMessageNotice = {
        key,
        type,
        content: options.content,
        link: options.link,
        closable: resolveClosable(type, duration, options.closable),
        duration,
        onClose: options.onClose,
      };

      setNotices((current) => [notice, ...current.filter((item) => item.key !== key)]);
      return () => closeNotice(key);
    },
    [closeNotice],
  );

  const api = useMemo<SensMessageApi>(
    () => ({
      open,
      default: (content, options) => open({ ...options, type: "default", content }),
      success: (content, options) => open({ ...options, type: "success", content }),
      info: (content, options) => open({ ...options, type: "info", content }),
      warning: (content, options) => open({ ...options, type: "warning", content }),
      loading: (content, options) => open({ ...options, type: "loading", content, duration: options?.duration ?? null }),
      destroy: (key) => {
        if (key) {
          closeNotice(key);
          return;
        }
        const current = noticesRef.current;
        setNotices([]);
        current.forEach((notice) => notice.onClose?.());
      },
    }),
    [closeNotice, open],
  );

  return (
    <SensMessageContext.Provider value={api}>
      {children}
      {notices.length > 0 ? (
        <div
          aria-live="polite"
          style={{
            position: "fixed",
            insetBlockStart: top,
            insetInline: 0,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: stackGap,
            pointerEvents: "none",
            ...hostStyle,
          }}
        >
          {notices.map((notice) => (
            <div key={notice.key} style={{ pointerEvents: "auto" }}>
              <SensMessageNoticeItem notice={notice} onClose={closeNotice} />
            </div>
          ))}
        </div>
      ) : null}
    </SensMessageContext.Provider>
  );
}

export function useSensMessage() {
  const api = useContext(SensMessageContext);
  if (!api) {
    throw new Error("useSensMessage must be used inside SensMessageProvider.");
  }
  return api;
}
