import { useEffect } from 'react';
import { useInactivity } from '@/hooks/useInactivity';
import { usePathname, useRouter } from 'next/navigation';

export function useRevalidateOnInactivity({
  pathsToWatch,
  interval = 60000,
}: {
  pathsToWatch: string[];
  interval?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isInactive = useInactivity(interval);

  useEffect(() => {
    if (!pathsToWatch.includes(pathname)) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    if (isInactive) {
      timer = setInterval(() => {
        router.refresh();
      }, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInactive, pathname, pathsToWatch, interval, router]);
}
