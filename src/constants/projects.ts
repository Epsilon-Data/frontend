export const PROJECT_API_URL = '/hub/project';

export const DB_TYPE_LABELS: Record<string, string> = {
  postgres: 'dbTypeLabels.relational',
  mysql: 'dbTypeLabels.relational',
  mongodb: 'dbTypeLabels.document',
  neo4j: 'dbTypeLabels.graph',
  csv: 'dbTypeLabels.flatFile',
};

export const SEARCH_FIELDS = [];
