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

export interface PaymentCard {
  cvc: string;
  expiry: string;
  name: string;
  number: string;
  // eslint-disable-next-line
  focused: any;
  background: string;
  isEdit: boolean;
}

export interface RequestDetails {
  id?: number;
  requestor?: number;
  date?: Date;
  status?: number;
  projectInfo: ProjectInfoFormValues;
  orgAdminEmail?: string;
  databaseInfo?: DatabaseInfoFormValues;
  dataInfo: DataInfoFormValues;
  additionalInfo?: string;
}

export interface ProjectInfoFormValues {
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
  url?: string;
  username?: string;
  password?: string;
}
