import styled from '@emotion/styled';

import type { AppTheme, Radius, Size } from '@/theme';

export const TextAreaStyled = styled.textarea<{ size: Size; radius: Radius; full?: boolean }>`
  width: ${({ full }) => (full ? '100%' : 'auto')};
  border-radius: ${({ theme, radius }) => (theme as AppTheme).radius[radius]};
  padding: ${({ size }) => ({ sm: '8px 10px', md: '10px 12px', lg: '12px 14px' })[size]};
  font-size: ${({ theme, size }) => (theme as AppTheme).font.sizes[size]};
  background: ${({ theme }) =>
    (theme as AppTheme).isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  outline: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;
  &::placeholder {
    color: ${({ theme }) => (theme as AppTheme).colors.muted};
  }
  &:focus {
    border-color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => (theme as AppTheme).colors.primary[500]}33;
  }
`;
