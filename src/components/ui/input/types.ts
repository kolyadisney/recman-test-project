import React from 'react';

import type { ColorName, Radius, Size } from '@/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  $size?: Size;
  radius?: Radius;
  color?: ColorName;
  variant?: 'bordered' | 'flat' | 'faded';
  fullWidth?: boolean;
  label?: string;
}
