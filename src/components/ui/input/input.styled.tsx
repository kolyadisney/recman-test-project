import styled from '@emotion/styled';

import type { InputProps } from '@/components/ui/input/types.ts';
import type { AppTheme, Radius, Size } from '@/theme';

export const Wrapper = styled.label<{ fullWidth?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

export const InputStyled = styled.input<{
  $size: Size;
  $radius: Radius;
  $variant: NonNullable<InputProps['variant']>;
}>`
  width: 100%;
  border-radius: ${({ theme, $radius }) => (theme as AppTheme).radius[$radius]};
  padding: ${({ $size }) => ({ sm: '8px 10px', md: '10px 12px', lg: '12px 14px' })[$size]};
  font-size: ${({ theme, $size }) => (theme as AppTheme).font.sizes[$size]};
  background: ${({ theme, $variant }) => {
    const t = theme as AppTheme;
    return $variant === 'flat'
      ? t.isDark
        ? 'rgba(255,255,255,.06)'
        : 'rgba(0,0,0,.04)'
      : $variant === 'faded'
        ? t.isDark
          ? 'rgba(255,255,255,.04)'
          : 'rgba(0,0,0,.02)'
        : t.colors.background;
  }};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  outline: none;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;

  &::placeholder {
    color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  }
  &:focus {
    border-color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => (theme as AppTheme).colors.primary[500]}33;
  }
`;

export const InputStyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const InputStyledLabel = styled.span`
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes['md']};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  width: 100%;
`;
