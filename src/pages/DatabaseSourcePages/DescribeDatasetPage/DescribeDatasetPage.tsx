import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DescribeDatasetPage.styles';
import { useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseSteps } from '@app/components/common/BaseSteps/BaseSteps';
import 'reactflow/dist/style.css';
import { ExampleModal } from './ExampleModal/ExampleModal';
import { Step1 } from './Steps/Step1/Step1';
import { Step2 } from './Steps/Step2/Step2';
import { Step3 } from './Steps/Step3/Step3';
import { useEdgesState, useNodesState } from 'reactflow';

const initialNodes = [{ id: '1', position: { x: 320, y: 200 }, data: { label: 'Object' }, type: 'object' }];

const DescribeDatasetPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const steps = [
    {
      title: t('databaseSources.describeDataset.step1'),
      description: t('databaseSources.describeDataset.step1Description'),
      content: (
        <Step1
          id={id}
          setStep={setCurrentStep}
          setIsFormModalOpen={setIsFormModalOpen}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      ),
    },
    {
      title: t('databaseSources.describeDataset.step2'),
      description: t('databaseSources.describeDataset.step2Description'),
      content: (
        <Step2
          id={id}
          setStep={setCurrentStep}
          setIsFormModalOpen={setIsFormModalOpen}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      ),
    },
    {
      title: t('databaseSources.describeDataset.step3'),
      description: t('databaseSources.describeDataset.step3Description'),
      content: <Step3 id={id} />,
    },
  ];

  return (
    <>
      <PageTitle>{t('databaseSources.describeDataset.projectTitle', { id: id })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.describeDataset.projectTitle', { id: id })}
          padding="1.25rem 1.25rem 0"
        >
          <BaseRow>
            <BaseSteps current={currentStep} items={steps} style={{ padding: '1rem 2.7rem' }} />
          </BaseRow>
          <div>{steps[currentStep].content}</div>
        </S.Card>
        <ExampleModal isExampleModalOpen={isFormModalOpen} setIsExampleModalOpen={setIsFormModalOpen} />
      </S.CardWrapper>
    </>
  );
};

export default DescribeDatasetPage;
