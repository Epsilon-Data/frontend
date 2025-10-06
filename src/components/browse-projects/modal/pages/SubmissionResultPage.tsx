import { Col, Row, Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const { Text } = Typography;

export const SubmissionResultPage = () => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(true);
  const requestStates = [
    { key: 'review', color: 'gold' },
    { key: 'approved', color: 'blue' },
    { key: 'revision', color: '' },
    { key: 'rejected', color: 'red' },
  ];

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };
  return (
    <div className="-mt-8">
      <Row className="bg-grey-4 rounded-t-3xl">
        <div className="pt-12 pb-6 pr-16 pl-20 text-lg">{t('browse.createRequest.form.title')}</div>
      </Row>
      <div className="h-[33rem] py-16 px-24 overflow-y-auto flex flex-col justify-start">
        <div className="mb-16">
          <div className="font-medium font-sans text-grey-1 text-xl">
            {t('browse.createRequest.form.submit.success.title')}
          </div>
          <div className="text-base font-light font-inter text-black">
            {t('browse.createRequest.form.submit.success.description')}
          </div>
        </div>
        <div className="">
          <div className="flex items-center cursor-pointer user-select-none text-blueDark" onClick={toggleDetails}>
            <Text underline className="text-blueDark">
              {t('browse.createRequest.form.submit.next.title')}
            </Text>
            {showDetails ? <FaChevronUp size={10} className="ml-4" /> : <FaChevronDown size={10} className="ml-4" />}
          </div>

          {showDetails && (
            <Row gutter={[16, 16]} className="mt-4">
              {requestStates.map((state, index) => (
                <>
                  <Col span={5} key={index}>
                    <Tag className="rounded-xl" bordered color={state.color}>
                      {t(`browse.createRequest.form.submit.next.${state.key}.title`)}
                    </Tag>
                  </Col>
                  <Col span={19} key={index}>
                    <Text className="font-light">
                      {t(`browse.createRequest.form.submit.next.${state.key}.description`)}
                    </Text>
                  </Col>
                </>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};
