import { OLLAMA_CONFIG } from '../constants/config';

export interface OllamaStatus {
  isOnline: boolean;
  model: string;
  version?: string;
  error?: string;
  lastChecked: Date;
}

let ollamaStatus: OllamaStatus = {
  isOnline: false,
  model: OLLAMA_CONFIG.models.default,
  lastChecked: new Date(),
};

let statusCheckTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaHealth(): Promise<OllamaStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${OLLAMA_CONFIG.url}${OLLAMA_CONFIG.endpoints.health}`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      ollamaStatus = {
        isOnline: true,
        model: OLLAMA_CONFIG.models.default,
        lastChecked: new Date(),
      };
    } else {
      ollamaStatus = {
        isOnline: false,
        model: OLLAMA_CONFIG.models.default,
        error: `Health check failed: ${response.status}`,
        lastChecked: new Date(),
      };
    }
  } catch (error) {
    ollamaStatus = {
      isOnline: false,
      model: OLLAMA_CONFIG.models.default,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastChecked: new Date(),
    };
  }

  return ollamaStatus;
}

/**
 * Get current Ollama status (without making a new request)
 */
export function getOllamaStatus(): OllamaStatus {
  return ollamaStatus;
}

/**
 * Start periodic health checks
 */
export function startOllamaHealthCheck(intervalMs: number = 30000): void {
  // Initial check
  checkOllamaHealth();

  // Stop existing interval if any
  if (statusCheckTimeout) {
    clearTimeout(statusCheckTimeout);
  }

  // Set up periodic checks
  const performCheck = () => {
    checkOllamaHealth().then(() => {
      statusCheckTimeout = setTimeout(performCheck, intervalMs);
    });
  };

  statusCheckTimeout = setTimeout(performCheck, intervalMs);
}

/**
 * Stop periodic health checks
 */
export function stopOllamaHealthCheck(): void {
  if (statusCheckTimeout) {
    clearTimeout(statusCheckTimeout);
    statusCheckTimeout = null;
  }
}

/**
 * Get list of available models on Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.url}${OLLAMA_CONFIG.endpoints.tags}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name.split(':')[0]) || [];
  } catch (error) {
    console.error('Error fetching available models:', error);
    return [];
  }
}

/**
 * Get human-readable status message
 */
export function getStatusMessage(): string {
  if (!ollamaStatus.isOnline) {
    return ollamaStatus.error || OLLAMA_CONFIG.messages.offline;
  }
  return `✅ Ollama online • Model: ${ollamaStatus.model}`;
}

/**
 * Get status icon for UI
 */
export function getStatusIcon(): string {
  return ollamaStatus.isOnline ? '🟢' : '🔴';
}
