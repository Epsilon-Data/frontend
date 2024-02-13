/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

import * as S from './Step3.styles';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';

export const Step3: React.FC<{
  id: string | undefined;
}> = ({ id }) => {
  console.log(id);
  return (
    <BaseRow style={{ padding: '0 2rem' }} justify="space-between">
      <S.DisplayCol span={24}>
        <BaseRow style={{ display: 'block', margin: '10rem 0' }}>
          <BaseSpin size="large" indicator={<S.Loading rev={undefined} spin></S.Loading>}></BaseSpin>
        </BaseRow>
      </S.DisplayCol>
    </BaseRow>
  );
};
