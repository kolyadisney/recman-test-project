import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

export const ColumnWrapper = styled.div<{ $isOverColumn?: boolean }>`
  background-color: ${({ theme }) => (theme as AppTheme).colors.default[500]};
  border-radius: ${({ theme }) => (theme as AppTheme).radius.md};
  box-shadow: ${({ theme }) => (theme as AppTheme).shadow.sm};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: calc(100vh - 120px);
  max-width: 400px;
  width: 100%;
  overflow-y: auto;

  border: 1px dashed
    ${({ theme, $isOverColumn }) =>
      $isOverColumn ? (theme as AppTheme).colors.primary[500] : (theme as AppTheme).colors.border};
  opacity: ${({ $isOverColumn }) => ($isOverColumn ? '0.4' : '1')};
  box-shadow: ${({ theme, $isOverColumn }) =>
    $isOverColumn ? `0 0 0 3px ${(theme as AppTheme).colors.primary[500]}33` : 'none'};
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease;
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  background: ${({ theme }) => (theme as AppTheme).colors.default[500]};
  border-bottom: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  cursor: grab;
  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;

export const ColumnTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
`;

export const ColumnActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px dashed ${({ theme }) => (theme as AppTheme).colors.border};
  background: ${({ theme }) => (theme as AppTheme).colors.default[600]};

  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;

export const ColumnTasksWrapperStyled = styled.div<{ $isOverZone?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px 16px;
  background: ${({ theme, $isOverZone }) =>
    $isOverZone ? (theme as AppTheme).colors.primary[500] + '0F' : 'transparent'};
  transition: background 120ms ease;
`;

export const EmptyState = styled.div<{ $isOverZone: boolean }>`
  display: grid;
  place-items: center;
  min-height: 120px;
  margin: 8px 0 16px;
  border: 1px dashed
    ${({ theme, $isOverZone }) =>
      $isOverZone ? (theme as AppTheme).colors.primary[500] : (theme as AppTheme).colors.border};
  border-radius: ${({ theme }) => (theme as AppTheme).radius.md};
  color: ${({ theme }) => (theme as AppTheme).colors.muted};
  font-size: 0.95rem;
`;

export const ColumnAllTasksActionsButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;

  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;
