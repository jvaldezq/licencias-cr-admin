import { useEffect, useState } from 'react';

export function useInactivity(timeout = 60000) {
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      setIsInactive(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsInactive(true), timeout);
    };

    const events = [
      'mousemove',
      'keydown',
      'mousedown',
      'touchstart',
      'scroll',
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [timeout]);

  return isInactive;
}
