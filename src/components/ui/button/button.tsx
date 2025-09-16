import React from 'react';

import { ButtonStyled } from './button.styled';

import type { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  color = 'primary',
  variant = 'solid',
  size = 'md',
  radius = 'md',
  fullWidth,
  isIconOnly,
  isLoading,
  startContent,
  endContent,
  children,
  ...rest
}) => {
  return (
    <ButtonStyled
      color={color}
      variant={variant}
      size={size}
      radius={radius}
      fullWidth={fullWidth}
      isIconOnly={isIconOnly}
      isLoading={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="btn-spinner">
          <span className="spinner" />
        </span>
      )}
      <span className="btn-slot">
        {startContent}
        {children}
        {endContent}
      </span>
    </ButtonStyled>
  );
};
