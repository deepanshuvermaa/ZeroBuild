import type { PageConfig } from '@/types/config.types';
import { validateConfig } from './validation';

/**
 * Imports and validates a PageConfig from a JSON file
 */
export async function importConfig(file: File): Promise<PageConfig> {
  try {
    // Read file contents
    const contents = await readFileAsText(file);

    // Parse JSON
    let config: any;
    try {
      config = JSON.parse(contents);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }

    // Validate configuration
    const validatedConfig = validateConfig(config);

    // Update timestamps
    validatedConfig.metadata.updatedAt = new Date().toISOString();

    return validatedConfig;
  } catch (error) {
    console.error('Failed to import configuration:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to import configuration');
  }
}

/**
 * Reads a file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Imports configuration from a JSON string
 */
export function importConfigFromString(jsonString: string): PageConfig {
  try {
    const config = JSON.parse(jsonString);
    return validateConfig(config);
  } catch (error) {
    console.error('Failed to parse configuration:', error);
    throw new Error('Invalid configuration format');
  }
}

/**
 * Imports configuration from a URL
 */
export async function importConfigFromURL(url: string): Promise<PageConfig> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }
    const config = await response.json();
    return validateConfig(config);
  } catch (error) {
    console.error('Failed to import from URL:', error);
    throw new Error('Failed to import configuration from URL');
  }
}

/**
 * Loads configuration from the server API
 */
export async function loadFromAPI(projectId: string): Promise<PageConfig> {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to load project');
    }
    const { project } = await response.json();
    return validateConfig(project.config);
  } catch (error) {
    console.error('Failed to load from API:', error);
    throw new Error('Failed to load project from server');
  }
}
