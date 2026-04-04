// Ollama Configuration
export const OLLAMA_CONFIG = {
  // Ollama server URL - runs locally
  url: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
  
  // API endpoints
  endpoints: {
    generate: '/api/generate',
    tags: '/api/tags',
    health: '/api/health',
  },

  // Model selection - can be customized
  models: {
    default: import.meta.env.VITE_OLLAMA_MODEL || 'mistral',
    alternatives: ['neural-chat', 'dolphin-mixtral', 'llama2', 'openchat'],
  },

  // Temperature settings for different use cases
  temperature: {
    parsing: 0.2, // Very low for consistent parsing
    analysis: 0.5, // Moderate for insights
    creative: 0.7, // Higher for summaries and recommendations
  },

  // Timeout settings (ms)
  timeout: {
    parse: 30000,
    insights: 60000,
    predictions: 60000,
    summary: 45000,
  },

  // Error messages
  messages: {
    offline: '🔴 Ollama is not running. Ensure Ollama is started at http://localhost:11434',
    timeout: '⏱️ Ollama request timed out. Your internet may be slow.',
    error: '❌ Ollama encountered an error. Please try again.',
    noModel: '📦 Required model not found. Pull model using: ollama pull mistral',
  },
};

// API endpoints and features
export const API_CONFIG = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-key',
};

// App configuration
export const APP_CONFIG = {
  appName: 'SmartSpend AI',
  version: '1.0.0-beta',
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

// UI Configuration
export const UI_CONFIG = {
  sidebarWidth: '16rem',
  transitionDuration: 300,
  animationEnabled: true,
};
