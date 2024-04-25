import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ProjectDetails.styles';
import { Typography } from 'antd';
import { InfoItem } from '@app/components/display-info/InfoItem';
import { DATE_FORMAT } from '@app/constants/connectionRequest';
import { format } from 'date-fns';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProjectDetails: React.FC<{ info: any }> = ({ info }) => {
  const { t } = useTranslation();
  const { Title } = Typography;

  return (
    <>
      <Title level={5} style={{ marginBottom: '1rem' }}>
        {t('browse.info.details.altTitle')}
      </Title>
      <S.InfoArea>
        {info.duration.length > 0 && (
          <InfoItem
            label={t('browse.info.details.duration')}
            text={`${format(info.duration[0], DATE_FORMAT)} - ${format(info.duration[1], DATE_FORMAT)}`}
            paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
          />
        )}
        <InfoItem
          label={t('browse.info.details.lead')}
          text={info.lead}
          paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
        />
        <InfoItem
          label={t('browse.info.details.members')}
          text={info.members.join(', ')}
          paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
        />
        <InfoItem
          label={t('browse.info.details.university')}
          text={info.university}
          paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
        />
        <InfoItem
          label={t('browse.info.details.faculty')}
          text={info.faculty}
          paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
        />
        <InfoItem
          label={t('browse.info.details.ethics')}
          text={info.ethicsId}
          paragraphProps={{ style: { fontSize: '1rem', marginTop: '0.5rem' } }}
        />
      </S.InfoArea>
    </>
  );
};
