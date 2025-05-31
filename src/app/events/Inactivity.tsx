'use client';
import { useRevalidateOnInactivity } from '@/hooks/useRevalidateOnInactivity';

export const Inactivity = () => {
  useRevalidateOnInactivity({
    pathsToWatch: ['/events'],
    interval: 60000,
  });

  return null;
};
