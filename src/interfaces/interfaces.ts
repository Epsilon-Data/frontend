import { NumericLiteral } from 'typescript';

export type Dimension = number | string;

export type ChartData = number[];

export type xData = number[] | string[];

export type LanguageType = 'de' | 'en';

export type ThemeType = 'light' | 'dark';

export interface ChartSeries {
  seriesName: string;
  value: number;
  data: {
    day: number;
    value: NumericLiteral;
  };
  name: string;
}

export type ChartSeriesData = ChartSeries[];

export type Severity = 'success' | 'error' | 'info' | 'warning';

export type TwoFactorAuthOption = 'email' | 'phone';

export type ActivityStatusType = 'sold' | 'booked' | 'added';

export enum CurrencyTypeEnum {
  USD = 'USD',
  ETH = 'ETH',
  BTC = 'BTC',
}

export interface RequestDetails {
  id?: string;
  requestor?: string;
  date?: Date;
  status?: number;
  projectInfo: ProjectInfoFormValues;
  orgAdminEmail?: string;
  databaseInfo?: DatabaseInfoFormValues;
  dataInfo: DataInfoFormValues;
  additionalInfo?: string;
  revisionInfo?: string;
}

export interface ProjectInfoFormValues {
  id?: string;
  customId: string;
  name: string;
  duration: Date[];
  lead: string;
  members: string[];
  university: string;
  faculty: string;
  ethicsId: string;
  description: string;
  isOwnData?: boolean | null;
}

export interface DataInfoFormValues {
  collectionDuration: Date[];
  participantsNumber: number | null;
  description?: string;
  keywords?: string[];
}

export interface DatabaseInfoFormValues {
  name: string;
  type: string;
  host?: string;
  port?: string;
  username?: string;
  password?: string;
}

export type DatabaseConnectionDetails = {
  readonly type: string;
  readonly host: string;
  readonly port: string;
  readonly username: string;
  readonly password: string;
  readonly name: string;
  readonly ssl?: boolean;
};

export interface RolePermissions {
  role: string;
  access: {
    nodeId: string;
    nodeName: string;
    nodeType: string;
    permissions: string[];
  }[];
}

export interface TemplatePermissions {
  templateId: string;
  active: boolean;
  settings: RolePermissions[];
}

export interface DescriptiveAnalysis {
  id: string;
  variables: { name: string; type: string; table: string }[];
  calculate: string[];
}
