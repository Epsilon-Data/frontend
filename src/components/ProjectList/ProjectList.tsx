import React from 'react';
import * as S from './ProjectList.styles';
import { ProjectSummaryInfo } from '@app/api/projects.api';
import { Card, Col, Row } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { FONT_WEIGHT } from '@app/styles/themes/constants';

export const ProjectList: React.FC<{
  projects: ProjectSummaryInfo[];
  mode: 'personal' | 'shared' | 'all';
  layout: 'list' | 'grid';
  onProjectClick: (projectId: string) => void;
}> = ({ projects, mode, onProjectClick }) => {
  return (
    <Row gutter={16} style={{ marginTop: '2rem' }}>
      {projects.map((project) => {
        const lastModifiedDate = new Date(project.lastModified);
        return (
          <Col key={project.projectId} span={8}>
            <Card
              cover={
                <S.Cover>
                  <S.Cover>
                    <S.CoverText>{project.name.charAt(0).toUpperCase()}</S.CoverText>
                    <S.CoverOverlay className="overlay">
                      <S.ViewButton
                        onClick={() => onProjectClick(project.projectId)}
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
              {(mode == 'personal' || mode == 'shared') && (
                <>
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
                      {`${lastModifiedDate.getDate()} ${lastModifiedDate.toLocaleString('en-GB', {
                        month: 'long',
                      })}, ${lastModifiedDate.getFullYear()}`}
                    </S.SubText>
                  </Row>
                </>
              )}
              {mode == 'all' && (
                <>
                  <Row>
                    <S.Text>{project.name}</S.Text>
                  </Row>
                  <Row style={{ marginTop: '0.5rem' }}>
                    <S.SubText>
                      <span style={{ fontWeight: FONT_WEIGHT.regular }}>By:</span>{' '}
                      {`${project.university} - ${project.faculty}`}
                    </S.SubText>
                  </Row>
                </>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
