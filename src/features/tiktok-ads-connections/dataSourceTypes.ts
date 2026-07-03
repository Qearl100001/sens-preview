export type ConnectionStatus = "enabled" | "disabled";

export interface ConnectionRecord {
  key: string;
  connectionId: number;
  name: string;
  status: ConnectionStatus;
  adAccountCount: number;
  creator: string;
  createdAt: string;
}

export type ConnectionColumnType = "number" | "text" | "status" | "datetime" | "actions";

export interface ConnectionColumnSpec {
  key: string;
  title: string;
  type: ConnectionColumnType;
  dataIndex?: keyof ConnectionRecord;
  width?: number;
  sortable?: boolean;
  ellipsis?: boolean;
  align?: "left" | "right" | "center";
}

export interface ConnectionStatusSpec {
  value: ConnectionStatus;
  label: string;
  tone: "success" | "default";
}

export interface ConnectionActionSpec {
  key: "detail" | "toggleStatus" | "delete";
  label: string;
  enabledLabel?: string;
  disabledLabel?: string;
  disabledWhenStatus?: ConnectionStatus[];
}

export interface DataSourceSpec {
  id: string;
  name: string;
  category: string;
  logoText: string;
  /** Figma logo 资产 key，见 `dataSourceLogos.ts` */
  logoAssetId?: string;
  description: string;
  breadcrumbs: string[];
  infoPanel: {
    helpDocLabel: string;
    sectionTitle: string;
    requiredInfo: string[];
    footnote: string;
  };
  connectionList: {
    searchPlaceholder: string;
    columns: ConnectionColumnSpec[];
    statuses: ConnectionStatusSpec[];
    actions: ConnectionActionSpec[];
    mockData: ConnectionRecord[];
    emptyState: {
      title: string;
      description: string;
      actionLabel: string;
    };
    searchEmptyState: {
      title: string;
      description: string;
    };
  };
  createConnection: {
    title: string;
    submitLabel: string;
    fields: ConnectionFormFieldSpec[];
    accountMapping?: {
      title: string;
      description: string;
      sourceLabel: string;
      targetLabel: string;
      sourceOptions: string[];
      targetOptions: string[];
      addLabel: string;
    };
  };
}

export type ConnectionFormFieldType = "input" | "password" | "textarea" | "select";

export interface ConnectionFormFieldSpec {
  key: string;
  label: string;
  type: ConnectionFormFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
}

export type DataSourceCountUnit = "connections" | "applications";

export interface DataSourceCardSpec {
  id: string;
  name: string;
  category: string;
  logoText: string;
  /** Figma 导出的 logo 资产 key，见 `dataSourceLogos.ts` */
  logoAssetId?: string;
  /** 旧 Demo 描述字段；入口卡视觉还原后不再展示 */
  description?: string;
  connected: boolean;
  connectionCount?: number;
  countUnit?: DataSourceCountUnit;
  beta?: boolean;
  navigable?: boolean;
  /** 不可用：灰底且无下钻，仍保留 disabled hover D3 */
  disabled?: boolean;
}

export interface DataSourceSectionSpec {
  id: string;
  title: string;
  count: number;
  cards: DataSourceCardSpec[];
}
