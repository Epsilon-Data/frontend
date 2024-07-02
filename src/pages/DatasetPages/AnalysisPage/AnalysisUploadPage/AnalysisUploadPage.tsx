/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AnalysisUploadPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { useMounted } from '@app/hooks/useMounted';
import hljs from 'highlight.js/lib/core';
import r from 'highlight.js/lib/languages/r';
import 'highlight.js/styles/night-owl.min.css';
import { getScriptMapping } from '@app/api/datasets.api';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

hljs.registerLanguage('r-language', r);

const AnalysisUploadPage: React.FC = () => {
  const { scriptId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const codeRef = useRef(null);
  const [mapping, setMapping] = useState<any>();
  const [script, setScript] = useState<string>();
  const [csvNames, setCsvNames] = useState<string[]>([]);

  const getMapping = useCallback(
    (id: string | undefined) => {
      getScriptMapping(id).then(async (res) => {
        if (isMounted.current) {
          setMapping(res.mapping);
          await fetch(res.script)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (reader.result) {
                  setScript(reader.result as string);
                }
              };
              reader.readAsText(blob);
            })
            .catch((error) => console.error('Error fetching the blob:', error));

          setCsvNames(res.csv);
        }
      });
    },
    [isMounted],
  );

  const onSelectChange = (name: string) => (value: any) => {
    setMapping({ ...mapping, [name]: value });
  };

  useEffect(() => {
    getMapping(scriptId);
  }, [getMapping, scriptId]);

  useEffect(() => {
    if (codeRef.current) hljs.highlightElement(codeRef.current);
    return;
  }, []);

  const conditions = csvNames.length > 0 && mapping;

  return (
    <>
      <PageTitle>{t('dataset.analysis.upload.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="metadata" title={t('dataset.analysis.upload.title')} padding="1.25rem 1.25rem 0">
          <BaseRow gutter={[50, 50]}>
            <BaseCol span={10}>
              <S.InputHeader>
                {t('dataset.analysis.upload.' + (conditions ? 'instructions' : 'missingError'))}
              </S.InputHeader>
              <BaseForm>
                {conditions &&
                  Object.keys(mapping).map((item, index) => {
                    return (
                      <BaseRow key={index} style={{ marginBottom: '2rem' }}>
                        <BaseForm.Item name={item} label={item} rules={[{ required: false }]} style={{ width: '80%' }}>
                          <S.CSVSelect
                            showSearch
                            placeholder={t('dataset.analysis.upload.csvPlaceholder')}
                            optionFilterProp="label"
                            onChange={onSelectChange(item)}
                            options={csvNames.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                          />
                        </BaseForm.Item>
                      </BaseRow>
                    );
                  })}
              </BaseForm>
              <BaseButton type="primary" block style={{ width: '80%' }} onClick={() => navigate(-1)}>
                {t('dataset.analysis.upload.proceed')}
              </BaseButton>
            </BaseCol>
            <BaseCol span={14}>
              <pre>
                <code className="r-language" ref={codeRef} style={{ borderRadius: '10px', maxHeight: '600px' }}>
                  {script}
                </code>
              </pre>
            </BaseCol>
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default AnalysisUploadPage;
