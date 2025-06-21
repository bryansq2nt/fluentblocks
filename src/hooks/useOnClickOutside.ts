// hooks/useOnClickOutside.ts
import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void
) {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // No hagas nada si el clic es dentro del elemento referenciado o sus descendientes
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      handler(event); // Llama al handler si el clic fue fuera
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]); // Vuelve a vincular si la ref o el handler cambian
}