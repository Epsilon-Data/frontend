import styled, { css } from 'styled-components';
import { LAYOUT, media } from '@app/styles/themes/constants';
import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';

interface HeaderProps {
  $isTwoColumnsLayout: boolean;
}

export default styled(BaseLayout.Content)<HeaderProps>`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and ${media.xl} {
    ${(props) =>
      props?.$isTwoColumnsLayout &&
      css`
        padding: 0;
      `}
  }
`;
