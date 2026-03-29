import React from 'react';
import { Button, Card, Tag } from 'antd';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { ProjectSummaryInfo } from '@app/api/projects.api';

type ListViewProps = {
  projects: ProjectSummaryInfo[];
  mode: 'dashboard' | 'all';
  onProjectClick: (projectId: string) => void;
  onRetryCrawl?: (projectId: string) => void;
};

export const ListView: React.FC<ListViewProps> = ({ projects, mode, onProjectClick, onRetryCrawl }) => {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {projects.map((project) => {
        const lastModifiedDate = new Date(project.lastModified);

        return (
          <Card key={project.projectId} className="rounded-lg" variant="borderless">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 flex items-center justify-center bg-coverBg text-2xl font-bold text-coverText rounded-lg shrink-0">
                  {project.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-sm font-normal font-inter truncate">{project.name}</div>

                    {mode === 'dashboard' && (
                      <>
                        <Tag
                          className="text-xs font-normal font-inter py-1"
                          variant="filled"
                          color={project.status === 'ERROR' ? 'red' : '#000'}
                        >
                          {project.status
                            .toLowerCase()
                            .split(' ')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </Tag>
                        {project.status === 'ERROR' && onRetryCrawl && (
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetryCrawl(project.projectId);
                            }}
                            className="text-xs font-inter"
                          >
                            Retry
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  {mode === 'dashboard' ? (
                    <div className="text-xs font-light font-inter text-grey-1 mt-1">
                      Last modified:{' '}
                      {`${lastModifiedDate.getDate()} ${lastModifiedDate.toLocaleString('en-GB', {
                        month: 'long',
                      })}, ${lastModifiedDate.getFullYear()}`}
                    </div>
                  ) : (
                    <div className="text-xs font-light font-inter text-black mt-1">
                      <span className="font-normal">By: </span>
                      {`${project.university} - ${project.faculty}`}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => onProjectClick(project.projectId)}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                className="view-project-btn flex items-center h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo border-none text-white hover:shadow-none"
              >
                View project
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
