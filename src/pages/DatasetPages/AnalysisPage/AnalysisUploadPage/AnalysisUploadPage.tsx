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
import { addScriptMapping, getScriptMapping } from '@app/api/scripts.api';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { CSV_REGEX } from '@app/constants/datasets';

hljs.registerLanguage('r-lang', r);

const AnalysisUploadPage: React.FC = () => {
  const { scriptId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const codeRef = useRef<HTMLDivElement>(null);
  const [mapping, setMapping] = useState<any>();
  const [script, setScript] = useState<string>();
  const [lines, setLines] = useState<string[]>([]);
  const [csvNames, setCsvNames] = useState<string[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const getMapping = useCallback(
    (id: string | undefined) => {
      getScriptMapping(id).then(async (res) => {
        if (isMounted.current) {
          setMapping(res.mapping);
          setCsvNames(res.csv);
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

  useEffect(() => {
    if (script) {
      const splitLines = script.split('\n');
      setLines(splitLines);
      const highlighted = [];

      for (let i = 0; i < splitLines.length; i++) {
        CSV_REGEX.lastIndex = 0;
        const isMatch = CSV_REGEX.test(splitLines[i]);
        if (isMatch) {
          highlighted.push(i);
        }
      }

      setHighlightedLines(highlighted);
    }
  }, [script]);

  const conditions = csvNames.length > 0 && mapping;

  const scrollToLine = (lineNumber: number) => {
    const lineElement = document.getElementById(`line-${lineNumber}`);
    if (lineElement && codeRef.current) {
      const elementOffsetTop = lineElement.offsetTop;
      const codeContainerHeight = codeRef.current.clientHeight;
      const lineElementHeight = lineElement.clientHeight;
      const scrollPosition = elementOffsetTop - codeContainerHeight / 4 + lineElementHeight / 2;
      const start = codeRef.current.scrollTop;
      const distance = scrollPosition - start;
      const duration = 600; // Duration of the animation
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // Ensure progress does not exceed 1
        const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const easedProgress = easeInOutQuad(progress);

        if (codeRef.current) {
          codeRef.current.scrollTop = start + distance * easedProgress;
        }

        if (progress < 1) {
          window.requestAnimationFrame(animateScroll);
        }
      };

      window.requestAnimationFrame(animateScroll);
    }
  };

  const handleLocateClick = (item: string) => {
    const lineIndex = highlightedLines.find((index) => lines[index].includes(item));
    if (lineIndex !== undefined && lineIndex !== -1) {
      scrollToLine(lineIndex);
    }
  };

  const handleProceedClick = () => {
    addScriptMapping(scriptId, mapping);
    navigate(-1);
  };

  return (
    <>
      <PageTitle>{t('dataset.analysis.upload.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="metadata" title={t('dataset.analysis.upload.title')} padding="1.25rem 1.25rem 0">
          <BaseRow gutter={[50, 30]}>
            <BaseCol span={10}>
              <S.InputHeader>
                {t('dataset.analysis.upload.' + (conditions ? 'instructions' : 'missingError'))}
              </S.InputHeader>
              {conditions &&
                Object.keys(mapping).map((item, index) => {
                  return (
                    <BaseRow key={index} style={{ marginBottom: '1.5rem' }}>
                      <BaseCol span={14}>
                        <S.InputHeader>{item}</S.InputHeader>
                        <S.CSVSelect
                          defaultValue={mapping[item]}
                          showSearch
                          placeholder={t('dataset.analysis.upload.csvPlaceholder')}
                          optionFilterProp="label"
                          onChange={onSelectChange(item)}
                          options={csvNames.map((item) => ({
                            value: item,
                            label: item,
                          }))}
                        />
                      </BaseCol>
                      <BaseCol span={9} offset={1}>
                        <BaseButton
                          type="default"
                          block
                          style={{ marginTop: '2.8rem' }}
                          onClick={() => handleLocateClick(item)}
                        >
                          {t('dataset.analysis.upload.locate')}
                        </BaseButton>
                      </BaseCol>
                    </BaseRow>
                  );
                })}
              <BaseButton type="primary" block style={{ width: '50%' }} onClick={handleProceedClick}>
                {t('dataset.analysis.upload.proceed')}
              </BaseButton>
            </BaseCol>
            <BaseCol span={14}>
              <pre>
                <code className="r-lang" ref={codeRef} style={{ borderRadius: '10px', maxHeight: '600px' }}>
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      id={`line-${index}`}
                      style={{ backgroundColor: highlightedLines.includes(index) ? '#7e67dc' : 'transparent' }}
                    >
                      {line}
                    </div>
                  ))}
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
