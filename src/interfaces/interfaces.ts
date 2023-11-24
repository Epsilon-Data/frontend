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
  projectName: string;
  projectDuration: Date[];
  projectLead: string;
  projectTeamMembers: string[];
  university: string;
  faculty: string;
  ethicsApprovalId: string;
  projectDescription: string;
  isOwnData: boolean | null;
  orgAdminEmail?: string;
  databaseInfo?: {
    name: string;
    type: string;
    url: string;
    username: string;
    password: string;
  };
  dataInfo: {
    collectionDuration: Date[];
    participantsNumber: number | null;
    description: string;
    keywords: string[];
  };
  additionalInfo?: string;
}
