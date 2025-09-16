import { CheckIcon } from '@heroicons/react/24/solid';
import React from 'react';

import {
  CheckboxContainer,
  HiddenCheckbox,
  StyledCheckbox,
  CheckboxLabel,
} from './checkbox.styled';

import type { CheckboxProps } from './types';

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled,
  className,
}) => {
  return (
    <CheckboxContainer className={className} aria-label={ariaLabel}>
      <HiddenCheckbox
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <StyledCheckbox checked={checked} disabled={disabled} aria-hidden="true">
        {checked ? <CheckIcon width={10} height={10} /> : null}
      </StyledCheckbox>
      {label ? <CheckboxLabel>{label}</CheckboxLabel> : null}
    </CheckboxContainer>
  );
};
