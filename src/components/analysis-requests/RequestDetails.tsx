import { useAnalysisRequests } from '@app/hooks/useAnalysisRequests';
import { Button, Col, Row, Spin, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestDetailsHeader } from './RequestDetailsHeader';
import clsx from 'clsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import { RequestTabs } from './RequestTabs';
type RequestDetailsProps = {
  requestId: string;
};

export const RequestDetails = ({ requestId }: RequestDetailsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const { request, fetchRequest, manageLoading } = useAnalysisRequests();

  useEffect(() => {
    const controller = new AbortController();
    fetchRequest(requestId);
    return () => controller.abort();
  }, [requestId, fetchRequest]);

  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowToggle(isOverflowing);
    }
  }, [request?.project?.description]);

  return (
    <Spin spinning={manageLoading}>
      <RequestDetailsHeader name={request?.project?.name ?? ''} status={request?.request?.status ?? ''} />
      <Row>
        <Row gutter={[32, 32]}>
          <Col span={12}>
            <Row>
              <div
                ref={descriptionRef}
                className={clsx(
                  'relative overflow-hidden break-normal mt-10 font-normal',
                  isExpanded ? 'line-clamp-none' : 'line-clamp-6',
                )}
              >
                {request?.project?.description}
              </div>
              {showToggle && (
                <Button
                  type="link"
                  className="text-xs font-medium font-inter mt-2 p-0 inline-flex items-center gap-2"
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  {isExpanded ? t('browse.main.details.about.showLess') : t('browse.main.details.about.showMore')}
                  {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </Button>
              )}
            </Row>
            <Row className="mt-10 flex flex-col">
              <div className="text-sm font-medium font-inter mb-4">{t('browse.main.details.keywords')}</div>
              <div>
                {request?.project?.dbKeywords?.map((keyword: string, index: number) => (
                  <Tag
                    className="w-max mb-2 text-xs font-normal font-inter rounded-2xl py-1 px-3 text-center bg-grey-3 text-black break-words"
                    key={index}
                    variant="filled"
                  >
                    {keyword}
                  </Tag>
                ))}
              </div>
            </Row>
          </Col>
          <Col span={12}>
            <div className="h-[20rem] flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText overflow-hidden mt-10 ">
              <div className="leading-4 p-8 text-center">{request?.project?.name?.charAt(0).toUpperCase()}</div>
            </div>
          </Col>
        </Row>
        <Row className="mt-24 w-full">
          <Col span={24}>
            <RequestTabs request={request} />
          </Col>
        </Row>
      </Row>
    </Spin>
  );
};
