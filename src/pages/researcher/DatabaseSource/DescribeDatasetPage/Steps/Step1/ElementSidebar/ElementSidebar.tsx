import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './ElementSidebar.styles';

export const ElementSidebar: React.FC = () => {
  const { t } = useTranslation();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <S.Sidebar>
      <div className="description">{t('databaseSources.describeDataset.elementSidebar.description')}</div>
      <S.Object className="dndnode object" onDragStart={(event) => onDragStart(event, 'object')} draggable>
        {t('databaseSources.describeDataset.elementSidebar.object')}
      </S.Object>
      <S.Category className="dndnode category" onDragStart={(event) => onDragStart(event, 'category')} draggable>
        {t('databaseSources.describeDataset.elementSidebar.category')}
      </S.Category>
      <S.SubCategory
        className="dndnode subcategory"
        onDragStart={(event) => onDragStart(event, 'subcategory')}
        draggable
      >
        {t('databaseSources.describeDataset.elementSidebar.subcategory')}
      </S.SubCategory>
    </S.Sidebar>
  );
};
