import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

export const BoardStyled = styled.div`
  height: 100%;
  padding: 20px;
  margin: 20px;
  box-sizing: border-box;
  background: ${({ theme }) =>
    (theme as AppTheme).isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'};
  border-radius: ${({ theme }) => (theme as AppTheme).radius['md']};
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;

  @media screen and (max-width: 560px) {
    flex-direction: column;
    padding-bottom: 30px;
  }
`;
