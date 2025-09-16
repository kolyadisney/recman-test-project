import styled from '@emotion/styled';

import { Button } from '@/components';

import type { AppTheme } from '@/theme';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 15px;
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 640px;
  background: ${({ theme }) => (theme as AppTheme).colors.default[500]};
  border-radius: ${({ theme }) => (theme as AppTheme).radius.lg};
  box-shadow: ${({ theme }) => (theme as AppTheme).shadow.lg};
  padding: 12px;
`;

export const Title = styled.div`
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  font-weight: 600;
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes.md};
  padding: 8px 12px;
`;

export const List = styled.div`
  display: grid;
  gap: 6px;
  margin: 8px 0;
`;

export const Item = styled.button<{ $disabled: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  color: ${({ theme, $disabled }) =>
    $disabled ? (theme as AppTheme).colors.muted : (theme as AppTheme).colors.foreground};
  padding: 12px 14px;
  border-radius: ${({ theme }) => (theme as AppTheme).radius.md};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    border-color 0.12s ease,
    transform 0.12s ease;

  &:active {
    transform: ${({ $disabled }) => ($disabled ? 'none' : 'scale(0.99)')};
  }
`;

export const Cancel = styled(Button)``;
