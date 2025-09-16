import React from 'react';

import { CardStyled } from './card.styled';

import type { CardProps } from '@/components/ui/card/types';

export const Card: React.FC<CardProps> = ({
  shadow = 'sm',
  bordered = false,
  radius = 'lg',
  ...rest
}) => {
  return <CardStyled shadow={shadow} bordered={bordered} radius={radius} {...rest} />;
};
