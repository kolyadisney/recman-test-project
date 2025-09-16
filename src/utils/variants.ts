import { css } from '@emotion/react';

import type { AppTheme, ColorName, Variant } from '@/theme';

export const buttonVariant = (theme: AppTheme, color: ColorName, variant: Variant) => {
  const colorPalette = theme.colors[color];
  const base = css`
    font-weight: ${theme.font.weights.semibold};
    border-radius: ${theme.radius.md};
    line-height: 1;
    transition:
      transform 0.06s ease,
      box-shadow 0.12s ease,
      background 0.12s ease,
      color 0.12s ease,
      border-color 0.12s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.xs};
    border: 1px solid transparent;
  `;

  switch (variant) {
    case 'solid':
      return css`
        ${base};
        background: ${colorPalette[500]};
        color: white;
        &:hover {
          background: ${colorPalette[400]};
          box-shadow: ${theme.shadow.sm};
          border-color: ${theme.colors.primary[900]};
        }
        &:disabled {
          opacity: 0.5;
          box-shadow: none;
          transform: none;
        }
      `;
    case 'shadow':
      return css`
        ${base};
        background: ${colorPalette[500]};
        color: white;
        box-shadow: ${theme.shadow.md};
        &:hover {
          background: ${colorPalette[400]};
          box-shadow: ${theme.shadow.lg};
        }
        &:disabled {
          opacity: 0.5;
          box-shadow: none;
          transform: none;
        }
      `;
    case 'bordered':
      return css`
        ${base};
        background: transparent;
        color: ${theme.colors.foreground};
        border-color: ${theme.colors.border};
        &:hover {
          border-color: ${colorPalette[500]};
          color: ${colorPalette[500]};
        }
      `;
    case 'ghost':
      return css`
        ${base};
        background: transparent;
        color: ${theme.colors.foreground};
        &:hover {
          background: rgba(127, 127, 127, 0.08);
        }
        &:active {
          background: rgba(127, 127, 127, 0.12);
        }
      `;
    case 'light':
      return css`
        ${base};
        background: rgba(127, 127, 127, 0.08);
        color: ${theme.colors.foreground};
        &:hover {
          background: rgba(127, 127, 127, 0.12);
        }
        &:active {
          background: rgba(127, 127, 127, 0.16);
        }
      `;
    case 'flat':
      return css`
        ${base};
        background: ${theme.isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'};
        color: ${color === 'default' ? theme.colors.foreground : colorPalette[500]};
        &:hover {
          background: ${theme.isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'};
        }
      `;
    default:
      return base;
  }
};
