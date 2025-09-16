import React from 'react';

import { InputStyled, InputStyledContainer, InputStyledLabel, Wrapper } from './input.styled';

import type { InputProps } from './types';

export const Input: React.FC<InputProps> = ({
  $size = 'md',
  radius = 'md',
  variant = 'bordered',
  label = null,
  fullWidth,
  ...rest
}) => {
  return (
    <Wrapper fullWidth={fullWidth}>
      <InputStyledContainer>
        <InputStyledLabel>{label}</InputStyledLabel>
        <InputStyled $size={$size} $radius={radius} $variant={variant} {...rest} />
      </InputStyledContainer>
    </Wrapper>
  );
};
