import React from 'react';
import * as S from './ProjectList.styles';
import { ProjectSummaryInfo } from '@app/api/projects.api';
import { Card, Col, Row } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';

export const ProjectList: React.FC<{
  projects: ProjectSummaryInfo[];
  mode: 'personal' | 'shared';
  layout: 'list' | 'grid';
}> = ({ projects }) => {
  return (
    <Row gutter={16} style={{ marginTop: '2rem' }}>
      {projects.map((project) => (
        <Col key={project.projectId} span={8}>
          <Card
            cover={
              <S.Cover>
                <S.Cover>
                  <S.CoverText>{project.name.charAt(0).toUpperCase()}</S.CoverText>
                  <S.CoverOverlay className="overlay">
                    <S.ViewButton
                      onClick={() => console.log('View details', project.projectId)}
                      icon={<IoChevronForwardOutline />}
                      iconPosition="end"
                    >
                      View project
                    </S.ViewButton>
                  </S.CoverOverlay>
                </S.Cover>
              </S.Cover>
            }
            variant="borderless"
          >
            <Row justify="space-between" align="middle">
              <Col>
                <S.Text>{project.name}</S.Text>
              </Col>
              <Col>
                <S.StatusTag bordered={false} color="#000">
                  {project.status
                    .toLowerCase()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </S.StatusTag>
              </Col>
            </Row>
            <Row>
              <S.SubText>
                Last modified:{' '}
                {new Date(project.createdDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </S.SubText>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
