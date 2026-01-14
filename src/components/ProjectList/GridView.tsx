import React from 'react';
import { Button, Card, Col, Row, Tag } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { ProjectSummaryInfo } from '@app/api/projects.api';

type GridViewProps = {
  projects: ProjectSummaryInfo[];
  mode: 'dashboard' | 'all';
  onProjectClick: (projectId: string) => void;
};

export const GridView: React.FC<GridViewProps> = ({ projects, mode, onProjectClick }) => {
  return (
    <Row gutter={[24, 24]} className="mt-8">
      {projects.map((project) => {
        const lastModifiedDate = new Date(project.lastModified);

        return (
          <Col key={project.projectId} span={8}>
            <Card
              cover={
                <div className="w-full h-28 flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText rounded-t overflow-hidden">
                  <div className="group w-full h-28 flex items-center justify-center bg-coverBg text-5xl font-bold text-coverText rounded-t overflow-hidden">
                    <div className="leading-1 p-8 text-center">{project.name.charAt(0).toUpperCase()}</div>

                    <div className="group-hover:opacity-100 absolute top-0 left-0 w-full h-[56%] bg-black/50 opacity-0 transition-opacity duration-300 rounded-t flex items-center justify-center z-2">
                      <Button
                        onClick={() => onProjectClick(project.projectId)}
                        icon={<IoChevronForwardOutline />}
                        iconPlacement="end"
                        className="view-project-btn flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo border-none text-white hover:shadow-none"
                      >
                        View project
                      </Button>
                    </div>
                  </div>
                </div>
              }
              variant="borderless"
            >
              {mode === 'dashboard' && (
                <>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div className="text-xs font-normal font-inter">{project.name}</div>
                    </Col>
                    <Col>
                      <Tag className="text-xs font-normal font-inter py-1" variant="filled" color="#000">
                        {project.status
                          .toLowerCase()
                          .split(' ')
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
                </>
              )}

              {mode === 'all' && (
                <>
                  <Row>
                    <div className="text-xs font-normal font-inter text-black">{project.name}</div>
                  </Row>
                  <Row className="mt-2">
                    <div className="text-xs font-light font-inter text-black">
                      <span className="font-normal">By: </span>
                      {`${project.university} - ${project.faculty}`}
                    </div>
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
