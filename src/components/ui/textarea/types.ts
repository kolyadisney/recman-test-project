import React from 'react';

import type { Size, Radius } from '@/theme';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  radius?: Radius;
  fullWidth?: boolean;
}
