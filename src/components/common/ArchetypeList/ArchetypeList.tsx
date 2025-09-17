import React from 'react';
import { Button, Card, Col, Row, Tag } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { Archetype } from '@app/api/archetypes.api';

export const ArchetypeList: React.FC<{
  archetypes: Archetype[];
  onArchetypeClick: (projectId: string) => void;
}> = ({ archetypes, onArchetypeClick }) => {
  return (
    <Row gutter={16} style={{ marginTop: '2rem' }}>
      {archetypes.map((archetype) => {
        const lastModifiedDate = new Date(archetype.lastModified);
        return (
          <Col key={archetype.id} span={8}>
            <Card
              cover={
                <div className="w-full h-28 flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText rounded-t overflow-hidden">
                  <div className="group w-full h-28 flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText rounded-t overflow-hidden">
                    <div className="leading-1 p-8 text-center">{archetype.name.charAt(0).toUpperCase()}</div>
                    <div className="group-hover:opacity-100 absolute top-0 left-0 w-full h-[56%] bg-black/50 opacity-0 transition-opacity duration-300 rounded-t flex items-center justify-center z-2">
                      <Button
                        onClick={() => onArchetypeClick(archetype.id)}
                        icon={<IoChevronForwardOutline />}
                        iconPosition="end"
                        className="view-project-btn flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo border-none text-white hover:from-primaryGradientFrom hover:to-primaryGradientTo hover:text-white hover:shadow-none focus:from-primaryGradientFrom focus:to-primaryGradientTo focus:text-white focus:shadow-none active:from-primaryGradientFrom active:to-primaryGradientTo active:text-white active:shadow-none"
                      >
                        View archetype
                      </Button>
                    </div>
                  </div>
                </div>
              }
              variant="borderless"
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <div className="text-xs font-normal font-inter">{archetype.name}</div>
                </Col>
                <Col>
                  <Tag className="text-xs font-normal font-inter py-1" bordered={false} color="#000">
                    {archetype.status
                      .toLowerCase()
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </Tag>
                </Col>
              </Row>
              <Row>
                <div className="text-xs font-light font-inter">
                  Last modified:{' '}
                  {`${lastModifiedDate.getDate()} ${lastModifiedDate.toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${lastModifiedDate.getFullYear()}`}
                </div>
              </Row>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
