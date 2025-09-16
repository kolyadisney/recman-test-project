import React from 'react';

import { TextAreaStyled } from '@/components/ui/textarea/textarea.styled';

import type { TextareaProps } from '@/components/ui/textarea/types';

export const TextArea: React.FC<TextareaProps> = ({
  size = 'md',
  radius = 'md',
  fullWidth,
  ...rest
}) => {
  return <TextAreaStyled size={size} radius={radius} full={fullWidth} {...rest} />;
};
