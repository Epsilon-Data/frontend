/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

import * as S from './Step3.styles';

export const Step3: React.FC<{
  id: string | undefined;
}> = ({ id }) => {
  console.log(id);
  return (
    <BaseRow style={{ padding: '0 2rem' }} justify="space-between">
      <S.ViewportCol span={24}>
        <BaseRow></BaseRow>
      </S.ViewportCol>
    </BaseRow>
  );
};
