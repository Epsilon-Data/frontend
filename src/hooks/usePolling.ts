import { useEffect, useRef, useState } from 'react';

/**
 * A simple hook to poll an async function at a specific interval.
 */
export function usePolling<T>(
  asyncFn: () => Promise<T>,
  {
    interval = 3000,
    enabled = false,
    onSuccess,
    onError,
  }: {
    interval?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
  },
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // to avoid closure staleness
  const fnRef = useRef(asyncFn);
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);

  useEffect(() => {
    fnRef.current = asyncFn;
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [asyncFn, onSuccess, onError]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;

      // just in case if theres still a timer running when unmounted, kill it
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      // clear existing timer to stop the loop
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const poll = async () => {
      try {
        const result = await fnRef.current();

        if (mountedRef.current) {
          setData(result);
          setError(null);
          successRef.current?.(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err);
          errorRef.current?.(err);
        }
      } finally {
        if (mountedRef.current && enabled) {
          timeoutRef.current = setTimeout(poll, interval);
        }
      }
    };

    poll();

    // clean up
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, interval]);

  return { data, error };
}
