import React from 'react';
import { useSearchParams } from 'react-router-dom';

const MetadataPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';

  return <div className="py-3 px-4 md:py-5 md:px-9">{projectId}</div>;
};

export default MetadataPage;
