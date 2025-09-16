import styled from '@emotion/styled';

import type { CardProps } from '@/components/ui/card/types.ts';
import type { AppTheme } from '@/theme';

export const CardStyled = styled.div<{
  shadow: NonNullable<CardProps['shadow']>;
  bordered?: boolean;
  radius: NonNullable<CardProps['radius']>;
}>`
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  border-radius: ${({ theme, radius }) => (theme as AppTheme).radius[radius]};
  border: 1px solid
    ${({ theme, bordered }) => (bordered ? (theme as AppTheme).colors.border : 'transparent')};
  box-shadow: ${({ theme, shadow }) =>
    ({
      none: 'none',
      sm: (theme as AppTheme).shadow.sm,
      md: (theme as AppTheme).shadow.md,
      lg: (theme as AppTheme).shadow.lg,
    })[shadow]};
`;
