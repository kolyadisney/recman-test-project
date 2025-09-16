import * as React from 'react';

interface UseLongPressOptions {
  delayMs?: number;
  onCancel?: () => void;
}

export function useLongPress(onLongPress: () => void, options?: UseLongPressOptions) {
  const { delayMs = 400, onCancel } = options ?? {};
  const timeoutRef = React.useRef<number | null>(null);
  const longPressTriggeredRef = React.useRef(false);

  const clear = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    clear();
    longPressTriggeredRef.current = false;
    timeoutRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      onLongPress();
    }, delayMs);
  }, [clear, delayMs, onLongPress]);

  const cancel = React.useCallback(() => {
    clear();
    if (!longPressTriggeredRef.current) onCancel?.();
  }, [clear, onCancel]);

  const eventHandlers = {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  } as const;

  return eventHandlers;
}
