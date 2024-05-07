/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './OtherSettingsPage.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { FaMinusCircle, FaPlus } from 'react-icons/fa';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useParams } from 'react-router-dom';
import { deleteCover, getProjectSettings, uploadProjectCover, uploadVis } from '@app/api/databaseSources.api';
import { useMounted } from '@app/hooks/useMounted';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Typography, Upload, UploadFile } from 'antd';
import { LuUpload } from 'react-icons/lu';
import { UploadChangeParam } from 'antd/lib/upload';
import { notificationController } from '@app/controllers/notificationController';

function isValidTableauUrl(url: string) {
  return url.startsWith('https://public.tableau.com/views/');
}

const OtherSettingsPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [form] = BaseForm.useForm();
  const { isMounted } = useMounted();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [visList, setVisList] = useState<{ title: string; url: string }[]>([]);
  const [isGetSettings, setIsGetSettings] = useState(false);

  const fetch = useCallback(
    (id: string | undefined) => {
      getProjectSettings(id).then((res) => {
        if (isMounted.current) {
          setVisList(res.visualisations);
          setFileList(res.cover);
          setIsGetSettings(true);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const onChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const { file } = info;

    if (file.status === 'removed') {
      deleteCover(id)
        .then(() => {
          notificationController.success({ message: t('databaseSources.otherSettings.deleteSuccess') });
        })
        .catch(() => {
          notificationController.error({ message: t('databaseSources.otherSettings.deleteFail') });
        });
    }
  };

  const onSubmit = () => {
    let tableau = form.getFieldValue('tableau');
    tableau = tableau.map((item: { url: string }) => ({
      ...item,
      url: 'https://' + item.url,
    }));
    const isValid = tableau.every((item: { url: string }) => isValidTableauUrl(item.url));
    if (isValid) {
      uploadVis(id, JSON.stringify(tableau))
        .then(() => {
          notificationController.success({ message: t('databaseSources.otherSettings.submitSuccess') });
        })
        .catch(() => {
          notificationController.error({ message: t('databaseSources.otherSettings.submitFail') });
        });
    } else {
      notificationController.error({ message: t('databaseSources.otherSettings.urlInvalid') });
    }
  };

  return (
    <>
      <PageTitle>{t('databaseSources.otherSettings.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="other-settings" title={t('databaseSources.otherSettings.title')} padding="1.25rem 1.25rem 0">
          <BaseForm form={form} name="settings-form" style={{ width: '80%' }}>
            {isGetSettings && (
              <>
                <BaseCol span={24}>
                  <BaseForm.Item label={t('databaseSources.otherSettings.cover')}>
                    <Upload
                      listType="picture"
                      defaultFileList={fileList}
                      maxCount={1}
                      onChange={onChange}
                      customRequest={({ file, onProgress, onSuccess }) => {
                        if (onProgress && onSuccess) {
                          uploadProjectCover(id, new File([file], 'cover.png'), (progressEvent: any) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress({ percent: percentCompleted });
                          })
                            .then((response) => {
                              onSuccess(response);
                              notificationController.success({
                                message: t('databaseSources.otherSettings.uploadSuccess'),
                              });
                            })
                            .catch(() =>
                              notificationController.error({ message: t('databaseSources.otherSettings.uploadFail') }),
                            );
                        }
                      }}
                    >
                      <BaseButton icon={<LuUpload />}>{t('databaseSources.otherSettings.upload')}</BaseButton>
                      <Typography.Text type="secondary">
                        {t('databaseSources.otherSettings.uploadInfo')}
                      </Typography.Text>
                    </Upload>
                  </BaseForm.Item>
                </BaseCol>
                <BaseCol>
                  <div style={{ marginBottom: '1rem' }}>
                    {' '}
                    <S.InputTitle>{t('databaseSources.otherSettings.vis')}</S.InputTitle>
                  </div>
                  <BaseForm.List name="tableau" initialValue={visList}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <S.VisInputSpace key={key} align="baseline">
                            <BaseForm.Item
                              {...restField}
                              name={[name, 'title']}
                              rules={[{ required: true, message: t('databaseSources.otherSettings.missingTitle') }]}
                            >
                              <S.VisInput
                                style={{ width: '20rem' }}
                                placeholder={t('databaseSources.otherSettings.visTitle')}
                              />
                            </BaseForm.Item>
                            <BaseForm.Item
                              {...restField}
                              name={[name, 'url']}
                              rules={[{ required: true, message: t('databaseSources.otherSettings.visUrl') }]}
                            >
                              <S.VisInput
                                addonBefore="https://"
                                style={{
                                  width: '36rem',
                                  display: 'inline-block',
                                  position: 'relative',
                                  top: '-0.95rem',
                                }}
                                placeholder="Tableau URL"
                              />
                            </BaseForm.Item>
                            <FaMinusCircle
                              size={20}
                              style={{ display: 'inline-block', position: 'relative', top: '0.2rem', color: 'red' }}
                              onClick={() => remove(name)}
                            />
                          </S.VisInputSpace>
                        ))}
                        <S.VisInputSpace>
                          <BaseForm.Item>
                            <BaseButton type="dashed" onClick={() => add()} block icon={<FaPlus />}>
                              {t('databaseSources.otherSettings.addTableau')}
                            </BaseButton>
                          </BaseForm.Item>
                          <BaseForm.Item>
                            <BaseButton type="primary" onClick={() => onSubmit()} block>
                              {t('databaseSources.otherSettings.submitVis')}
                            </BaseButton>
                          </BaseForm.Item>
                        </S.VisInputSpace>
                      </>
                    )}
                  </BaseForm.List>
                </BaseCol>
              </>
            )}
          </BaseForm>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default OtherSettingsPage;
