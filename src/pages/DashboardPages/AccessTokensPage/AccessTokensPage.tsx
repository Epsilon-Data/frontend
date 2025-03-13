import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AccessTokensPage.styles';
import { RiCopperCoinFill } from 'react-icons/ri';
import { GenerateModal } from './GenerateModal/GenerateModal';
import { notificationController } from '@app/controllers/notificationController';
import { getTokenList, generateToken, AccessTokenInfo } from '@app/api/token.api';
import { Button, Input, List, Skeleton, Space, Tooltip } from 'antd';
import { MdOutlineContentCopy } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa6';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

const AccessTokensPage: React.FC = () => {
  const { t } = useTranslation();
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<AccessTokenInfo[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [token, setToken] = useState('');
  const [isCopyClicked, setIsCopyClicked] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    getTokenList().then((res) => {
      setInitLoading(false);
      setList(res);
    });
  }, []);

  const handleGenerate = (name: string) => {
    setSubmitLoading(true);
    generateToken(name)
      .then((res) => {
        setToken(res.token);
      })
      .catch(() => {
        notificationController.error({
          message: t('dashboard.pat.generate.failNotify'),
        });
      });
    setSubmitLoading(false);
    setIsGenerateModalOpen(false);
  };

  return (
    <>
      <PageTitle>{t('dashboard.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="pat"
          title={t('dashboard.pat.title')}
          extra={
            <S.GenerateButton type="primary" onClick={() => setIsGenerateModalOpen(true)} icon={<RiCopperCoinFill />}>
              {t('dashboard.pat.generate.title')}
            </S.GenerateButton>
          }
          padding="1.25rem 1.25rem 0"
        >
          <S.InstructionCard>
            <S.ContentHeader>{t('dashboard.pat.instructions')}</S.ContentHeader>
          </S.InstructionCard>

          <S.CopyCard hidden={token.length == 0}>
            <S.ContentHeader>Token Generated</S.ContentHeader>
            <BaseRow>
              <S.Content style={{ marginTop: '0.5rem' }}>Name: {name}</S.Content>
            </BaseRow>
            <BaseRow>
              <BaseCol span={12}>
                <Space.Compact block size="small" direction="horizontal">
                  <Input value={token} disabled />
                  <Tooltip title={isCopyClicked ? 'Copied!' : ''} arrow={false} placement="right" open={isCopyClicked}>
                    <Button
                      icon={
                        isCopyClicked ? (
                          <FaCheck style={{ marginTop: '0.3rem', color: 'var(--success-color)' }} />
                        ) : (
                          <MdOutlineContentCopy style={{ marginTop: '0.3rem' }} />
                        )
                      }
                      style={{ width: 50 }}
                      onClick={() => {
                        navigator.clipboard.writeText(token);
                        setIsCopyClicked(true);
                        setTimeout(() => setIsCopyClicked(false), 3500);
                      }}
                    />
                  </Tooltip>
                </Space.Compact>
              </BaseCol>
              <BaseCol span={2} offset={10}>
                <S.DeleteButton danger type="default" style={{ marginTop: '0.5rem' }}>
                  Delete
                </S.DeleteButton>
              </BaseCol>
            </BaseRow>
          </S.CopyCard>
          <List
            className="token-list"
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <S.DeleteButton key={item.id} danger type="default">
                    Delete
                  </S.DeleteButton>,
                ]}
              >
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<a onClick={() => setIsGenerateModalOpen(true)}>{item.name}</a>}
                    description={`Expires on ${item.expiry}`}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </S.Card>
        <GenerateModal
          name={name}
          setName={setName}
          isModalOpen={isGenerateModalOpen}
          setIsModalOpen={setIsGenerateModalOpen}
          onSubmit={handleGenerate}
          loading={isSubmitLoading}
        />
      </S.CardWrapper>
    </>
  );
};

export default AccessTokensPage;
