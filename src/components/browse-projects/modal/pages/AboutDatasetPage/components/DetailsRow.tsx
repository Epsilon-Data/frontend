import { Col, Row } from 'antd';

type DetailsRowProps = {
  title: string;
  content: React.ReactNode;
  titleWidth?: number;
  contentWidth?: number;
};

export const DetailsRow: React.FC<DetailsRowProps> = ({ title, content, titleWidth, contentWidth }) => {
  return (
    <Row className="mb-4">
      <Col span={titleWidth ?? 9} className="flex justify-between font-normal">
        <span>{title}</span>
        <span>:</span>
      </Col>
      <Col span={contentWidth ?? 13} className="ml-6 font-light">
        {content}
      </Col>
    </Row>
  );
};
