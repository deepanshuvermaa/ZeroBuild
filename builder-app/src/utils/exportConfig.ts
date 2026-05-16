import type { PageConfig } from '@/types/config.types';

/**
 * Downloads a PageConfig as a JSON file
 */
export function downloadJSON(config: PageConfig, filename: string): void {
  try {
    // Create a clean copy with updated timestamp
    const exportConfig: PageConfig = {
      ...config,
      metadata: {
        ...config.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    // Convert to JSON with pretty formatting
    const jsonString = JSON.stringify(exportConfig, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(filename)}.json`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export configuration:', error);
    throw new Error('Failed to export configuration');
  }
}

/**
 * Sanitizes a filename to remove invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Exports the configuration as a formatted JSON string
 */
export function configToJSON(config: PageConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Saves configuration to the server API
 */
export async function saveToAPI(config: PageConfig, projectId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ config }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Save failed' }));
    throw new Error(err.error || 'Failed to save configuration');
  }
}
