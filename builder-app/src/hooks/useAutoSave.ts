import { useEffect, useRef } from 'react';
import type { PageConfig } from '@/types/config.types';

export function useAutoSave(
  config: PageConfig,
  projectId: string | null,
  onSave: (config: PageConfig) => Promise<void>,
  debounceMs: number = 3000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastSavedRef.current = JSON.stringify(config);
      return;
    }

    if (!projectId) return;

    const configStr = JSON.stringify(config);
    if (configStr === lastSavedRef.current) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(config);
        lastSavedRef.current = configStr;
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [config, projectId, onSave, debounceMs]);
}
