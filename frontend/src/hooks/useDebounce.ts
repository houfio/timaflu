import { useEffect, useState } from 'react';

export function useDebounce<V>(value: V, delay: number): V {
  const [debounced, setDebounced] = useState(value);

  useEffect(
    () => {
      const timeout = setTimeout(() => setDebounced(value), delay);

      return () => clearTimeout(timeout);
    },
    [value, delay]
  );

  return debounced;
}
