import styled from '@emotion/styled';

import type { SelectRadius, SelectSize } from './types';
import type { AppTheme } from '@/theme';

export const SelectRoot = styled.div<{ $fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

export const SelectButton = styled.button<{
  $size: SelectSize;
  $radius: SelectRadius;
  disabled?: boolean;
  'aria-expanded'?: boolean;
}>`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  border-radius: ${({ theme, $radius }) => (theme as AppTheme).radius[$radius]};
  padding: ${({ $size }) => ({ sm: '6px 10px', md: '10px 12px', lg: '12px 14px' })[$size]};
  font-size: ${({ theme, $size }) => (theme as AppTheme).font.sizes[$size]};
  line-height: 1.3;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  transition:
    border-color 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;

  &:hover {
    border-color: ${({ theme }) => (theme as AppTheme).colors.primary[400]};
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => (theme as AppTheme).colors.primary[500]}33;
    border-color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
  }
  &[aria-expanded='true'] {
    border-color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
  }
  &:disabled {
    opacity: 0.6;
  }
`;

export const Chevron = styled.span<{ $open?: boolean }>`
  display: inline-block;
  transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
  transition: transform 0.12s ease;
`;

export const SelectPopup = styled.div<{ $minWidthPx: number }>`
  position: absolute;
  inset-inline-start: 0;
  margin-top: 6px;
  min-width: ${({ $minWidthPx }) => `${$minWidthPx}px`};
  z-index: 30;
`;

export const OptionsCard = styled.div<{ $radius: SelectRadius }>`
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  border-radius: ${({ theme, $radius }) => (theme as AppTheme).radius[$radius]};
  box-shadow: ${({ theme }) => (theme as AppTheme).shadow.md};
  overflow: hidden;
`;

export const OptionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 280px;
  overflow: auto;
`;

export const OptionItem = styled.li<{
  $active?: boolean;
  $selected?: boolean;
  $disabled?: boolean;
}>`
  padding: 8px 10px;
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  background: ${({ theme, $active }) =>
    $active ? (theme as AppTheme).colors.primary[500] + '1a' : 'transparent'};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  outline: none;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled ? 'transparent' : (theme as AppTheme).colors.primary[500] + '14'};
  }

  &[aria-selected='true']::after {
    content: '✓';
    margin-inline-start: auto;
    color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
    font-weight: 600;
  }
`;
