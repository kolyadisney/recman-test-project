import React from 'react';

import {
  Chevron,
  OptionItem,
  OptionList,
  OptionsCard,
  SelectButton,
  SelectPopup,
  SelectRoot,
} from './select.styled';

import type { SelectProps } from './types';

export const Select = <T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  size = 'md',
  radius = 'md',
  fullWidth,
  disabled,
  ariaLabel,
  className,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const buttonReference = React.useRef<HTMLButtonElement>(null);
  const popupReference = React.useRef<HTMLDivElement>(null);
  const [popupMinWidth, setPopupMinWidth] = React.useState<number>(180);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  );

  React.useLayoutEffect(() => {
    if (buttonReference.current) {
      setPopupMinWidth(buttonReference.current.getBoundingClientRect().width);
    }
  }, [fullWidth, size, radius, className, selectedOption?.label, isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!buttonReference.current || !popupReference.current) return;
      if (!buttonReference.current.contains(target) && !popupReference.current.contains(target)) {
        setIsOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const commitValue = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      setIsOpen(false);
      requestAnimationFrame(() => buttonReference.current?.focus());
    },
    [isControlled, onChange],
  );

  const openPopup = React.useCallback(() => {
    setIsOpen(true);
    const idx = options.findIndex((o) => o.value === currentValue && !o.disabled);
    setActiveIndex(idx >= 0 ? idx : options.findIndex((o) => !o.disabled));
  }, [currentValue, options]);

  const togglePopup = React.useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        const idx = options.findIndex((o) => o.value === currentValue && !o.disabled);
        setActiveIndex(idx >= 0 ? idx : options.findIndex((o) => !o.disabled));
      }
      return next;
    });
  }, [currentValue, options]);

  const onButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      if (!isOpen) {
        openPopup();
      } else if (event.key === 'Enter' || event.key === ' ') {
        const option = options[activeIndex];
        if (option && !option.disabled) commitValue(option.value);
      }
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      let next = activeIndex;
      for (let i = 0; i < options.length; i += 1) {
        next = (next + direction + options.length) % options.length;
        if (!options[next].disabled) break;
      }
      setActiveIndex(next);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options[activeIndex];
      if (option && !option.disabled) commitValue(option.value);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      setIsOpen(false);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : options.length - 1;
      setActiveIndex(next);
    }
  };

  const buttonId = React.useId();
  const listboxId = React.useId();

  return (
    <SelectRoot className={className} $fullWidth={fullWidth}>
      <SelectButton
        ref={buttonReference}
        id={buttonId}
        type="button"
        role="combobox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={togglePopup}
        onKeyDown={onButtonKeyDown}
        $size={size}
        $radius={radius}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <Chevron aria-hidden="true" $open={isOpen}>
          ▾
        </Chevron>
      </SelectButton>

      {isOpen && (
        <SelectPopup ref={popupReference} $minWidthPx={popupMinWidth}>
          <OptionsCard $radius={radius}>
            <OptionList
              id={listboxId}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={buttonId}
              onKeyDown={onListKeyDown}
            >
              {options.map((opt, index) => {
                const isSelected = opt.value === currentValue;
                const isActive = index === activeIndex;
                return (
                  <OptionItem
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    $selected={isSelected}
                    $active={isActive}
                    $disabled={opt.disabled}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !opt.disabled && commitValue(opt.value)}
                  >
                    <span>{opt.label}</span>
                  </OptionItem>
                );
              })}
            </OptionList>
          </OptionsCard>
        </SelectPopup>
      )}
    </SelectRoot>
  );
};
