import { DatabaseTableInfo, getDbSummary, getDbTableInfo, OverallDatabaseInfo } from '@app/api/database.api';
import { DefaultOptionType } from 'antd/es/cascader';
import { useCallback, useState } from 'react';

export const useMetadata = (projectId: string) => {
  const [info, setInfo] = useState<OverallDatabaseInfo>({} as OverallDatabaseInfo);
  const [diagramCode, setDiagramCode] = useState('');
  const [selectItems, setSelectItems] = useState<DefaultOptionType[]>([]);
  const [tableInfo, setTableInfo] = useState<DatabaseTableInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMetadata = useCallback(async () => {
    setLoading(true);
    try {
      const dbMetadata = await getDbSummary(projectId);
      const dbTableInfo = await getDbTableInfo(projectId);
      const selectItems = dbTableInfo
        ? dbTableInfo.map((tableInfo) => ({ value: tableInfo.name, label: tableInfo.name }))
        : [];
      setSelectItems(selectItems);
      setTableInfo(dbTableInfo);
      setInfo(dbMetadata.overall);
      setDiagramCode(dbMetadata.diagram);
    } catch (error) {
      console.error('Failed to fetch database metadata for project:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return { info, diagramCode, selectItems, tableInfo, loading, fetchMetadata };
};
