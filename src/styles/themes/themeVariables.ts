import { ThemeType } from '@app/interfaces/interfaces';
import { css } from 'styled-components';
import { BASE_COLORS } from './constants';
import { lightColorsTheme } from './light/lightTheme';

export const themeObject = {
  light: lightColorsTheme,
  dark: lightColorsTheme,
};

export const antThemeObject = {
  light: {},
  dark: {},
};

const getThemeVariables = (theme: ThemeType) => css`
  color-scheme: ${theme};
  --header-color: ${themeObject[theme].header};
  --primary-gradient-color: ${themeObject[theme].primaryGradient};
  --error-color: ${themeObject[theme].error};
  --success-color: ${themeObject[theme].success};
  --grey1: ${themeObject[theme].grey1};
  --grey2: ${themeObject[theme].grey2};
  --grey3: ${themeObject[theme].grey3};
  --grey4: ${themeObject[theme].grey4};
  --blue-dark: ${themeObject[theme].blueDark};
  --scroll-color: ${themeObject[theme].scroll};

  --text-sider-primary-color: ${themeObject[theme].textSiderPrimary};
  --text-sider-secondary-color: ${themeObject[theme].textSiderSecondary};

  --cover-bg-color: ${themeObject[theme].coverBg};
  --cover-text-color: ${themeObject[theme].coverText};

  --notification-success-color: ${themeObject[theme].notificationSuccess};
  --notification-primary-color: ${themeObject[theme].notificationPrimary};
  --notification-warning-color: ${themeObject[theme].notificationWarning};
  --notification-error-color: ${themeObject[theme].notificationError};
`;

export const lightThemeVariables = css`
  ${getThemeVariables('light')}
`;

export const commonThemeVariables = css`
  color-scheme: light dark;
  --white: ${BASE_COLORS.white};
  --black: ${BASE_COLORS.black};
  --green: ${BASE_COLORS.green};
  --orange: ${BASE_COLORS.orange};
  --gray: ${BASE_COLORS.gray};
  --lightgrey: ${BASE_COLORS.lightgrey};
  --violet: ${BASE_COLORS.violet};
  --lightgreen: ${BASE_COLORS.lightgreen};
  --pink: ${BASE_COLORS.pink};
  --blue: ${BASE_COLORS.blue};
  --skyblue: ${BASE_COLORS.skyblue};
  --red: ${BASE_COLORS.red};
  --aquamarine: ${BASE_COLORS.aquamarine};
`;

export const antOverrideCssVariables = css`
  --ant-primary-1: var(--primary1-color) !important;
`;

export const elementMappingVariables = css`
  --element-object-bg: #ff6666;
  --element-category-bg: #ff8833;
  --element-subcategory-bg: #33b1ff;
  --sider-bg: #ecf1ff;
`;

export const connectionRequestVariables = css`
  --revision-card-bg: #ffc8c9;
`;
