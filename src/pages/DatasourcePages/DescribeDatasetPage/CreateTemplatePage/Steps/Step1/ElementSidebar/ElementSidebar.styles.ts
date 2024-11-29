import { FONT_SIZE } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const Sidebar = styled.aside`
  padding: 15px 0;
  font-size: ${FONT_SIZE.xl};

  .description {
    font-size: ${FONT_SIZE.md};
    margin-bottom: 2rem;
  }
`;

export const Object = styled.div`
  background: var(--element-object-bg);
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  padding: 1rem 0;
`;

export const Category = styled.div`
  background: var(--element-category-bg);
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  padding: 1rem 0;
`;

export const SubCategory = styled.div`
  background: var(--element-subcategory-bg);
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  padding: 1rem 0;
`;
