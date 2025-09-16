import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { buttonVariant } from '@/utils/variants.ts';

import type { ButtonProps } from './types';
import type { AppTheme, Size } from '@/theme';

const spin = keyframes`from {
                           transform: rotate(0)
                       }
                           to {
                               transform: rotate(360deg)
                           }`;

const sizeCss = (theme: AppTheme, size: Size, isIconOnly?: boolean) => {
  const padding = {
    sm: [theme.spacing.xs, theme.spacing.md],
    md: [theme.spacing.sm, theme.spacing.lg],
    lg: [theme.spacing.md, theme.spacing.lg],
  }[size];
  const shape = {
    sm: '32px',
    md: '36px',
    lg: '44px',
  }[size];
  return isIconOnly
    ? `width:${shape} !important;
    height:${shape};
    display: block;
    padding:0px;
    font-size:${{ sm: '0.9rem', md: '1rem', lg: '1.05rem' }[size]}`
    : `padding:${padding[0]} ${padding[1]};font-size:${
        {
          sm: theme.font.sizes.sm,
          md: theme.font.sizes.md,
          lg: theme.font.sizes.lg,
        }[size]
      }`;
};

export const ButtonStyled = styled.button<
  Required<Pick<ButtonProps, 'color' | 'variant' | 'size' | 'radius'>> &
    Pick<ButtonProps, 'fullWidth' | 'isIconOnly' | 'isLoading'>
>`
  ${({ theme, size, isIconOnly }) => sizeCss(theme as AppTheme, size, isIconOnly)};
  ${({ theme, color, variant }) => buttonVariant(theme as AppTheme, color, variant)};
  border-radius: ${({ theme, radius }) => (theme as AppTheme).radius[radius]};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  .btn-slot {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    opacity: ${({ isLoading }) => (isLoading ? 0.0 : 1)};
  }

  .btn-spinner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    border: 0.18em solid rgba(255, 255, 255, 0.35);
    border-top-color: currentColor;
    animation: ${spin} 0.8s linear infinite;
  }
`;
