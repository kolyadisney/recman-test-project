import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

export const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

export const StyledCheckbox = styled.span<{ checked: boolean; disabled?: boolean }>`
  width: 20px;
  height: 20px;
  display: inline-grid;
  place-items: center;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  background: ${({ theme, checked }) =>
    checked ? (theme as AppTheme).colors.primary[500] : (theme as AppTheme).colors.default[500]};
  color: #fff;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  box-shadow: ${({ theme, checked }) =>
    checked ? `0 0 0 3px ${(theme as AppTheme).colors.primary[500]}33` : 'none'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const CheckboxLabel = styled.span`
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes.sm};
`;
