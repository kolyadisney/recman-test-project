export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> {
  options: Array<SelectOption<T>>;
  value?: T;
  defaultValue?: T;
  onChange?: (next: T) => void;

  placeholder?: string;
  size?: SelectSize;
  radius?: SelectRadius;
  fullWidth?: boolean;
  disabled?: boolean;

  ariaLabel?: string;
  className?: string;
}
