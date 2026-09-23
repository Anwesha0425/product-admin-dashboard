import { useEffect, useState } from 'react';

// Delays updating a value until the user stops changing it for `delay` ms.
// Used for the search input to avoid firing an API call on every keystroke.
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
