import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

export const TaskContainerStyled = styled.div<{
  $dragging?: boolean;
  $completed?: boolean;
  $isOverTarget?: boolean;
}>`
  position: relative;
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  border-radius: ${({ theme }) => (theme as AppTheme).radius.md};
  padding: 20px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: ${({ $dragging }) => ($dragging ? 0.6 : 1)};
  cursor: ${({ $dragging }) => ($dragging ? 'grabbing' : 'grab')};
  width: 100%;

  border-color: ${({ theme, $isOverTarget, $completed }) => {
    const t = theme as AppTheme;
    if ($isOverTarget) return t.colors.primary[400];
    if ($completed) return t.colors.success[500];
    return t.colors.border;
  }};
  box-shadow: ${({ theme, $isOverTarget }) =>
    $isOverTarget ? (theme as AppTheme).shadow.sm : 'none'};
  transform: ${({ $dragging, $isOverTarget }) =>
    $dragging ? 'rotate(1deg) scale(1.02)' : $isOverTarget ? 'translateY(-1px)' : 'none'};
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    transform 120ms ease;

  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;

export const TaskTitle = styled.div<{ $completed: boolean }>`
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes.md};
  word-break: break-word;
  display: flex;
  align-items: center;
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  opacity: ${({ $completed }) => ($completed ? '0.6' : '1')};

  mark {
    background: ${({ theme }) => (theme as AppTheme).colors.primary[400]};
    color: #fff;
    border-radius: 4px;
    padding: 0 2px;
  }
`;

export const TaskActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  text-align: right;
  flex: 1 0 auto;
`;
