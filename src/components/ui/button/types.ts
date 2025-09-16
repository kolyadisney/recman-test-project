import React from 'react';

import type { ColorName, Radius, Size, Variant } from '@/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ColorName;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  isLoading?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}
