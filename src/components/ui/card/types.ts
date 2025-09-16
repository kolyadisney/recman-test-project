import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  radius?: 'sm' | 'md' | 'lg';
}
