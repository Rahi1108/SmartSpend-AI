# Ollama Setup Guide

This guide helps you set up and configure Ollama for SmartSpend AI's local AI processing.

## What is Ollama?

Ollama is a free, open-source tool that lets you run large language models (LLMs) locally on your computer without needing cloud APIs like OpenAI or Anthropic. SmartSpend AI uses Ollama to:

- Parse expenses from voice/text input
- Generate spending insights
- Predict monthly spending
- Create financial summaries

## Installation

### Windows

1. **Download Ollama**
   - Visit https://ollama.ai/download
   - Download the Windows version
   - Run the installer and follow the prompts

2. **Verify Installation**
   ```bash
   ollama --version
   ```

3. **Pull a Model** (required before first use)
   ```bash
   ollama pull mistral
   ```

   Alternative models (faster/different performance):
   ```bash
   ollama pull neural-chat
   ollama pull dolphin-mixtral
   ```

4. **Start Ollama Server**
   ```bash
   ollama serve
   ```
   - Ollama will start running on `http://localhost:11434`
   - Keep this terminal window open while using SmartSpend AI

### macOS

1. **Download Ollama**
   - Visit https://ollama.ai/download
   - Download the macOS version
   - Drag to Applications folder

2. **Verify Installation**
   ```bash
   ollama --version
   ```

3. **Pull a Model**
   ```bash
   ollama pull mistral
   ```

4. **Start Ollama**
   - Ollama runs as a background service
   - Check status: `ollama serve` (or it may auto-start)

### Linux

1. **Install via Curl**
   ```bash
   curl https://ollama.ai/install.sh | sh
   ```

2. **Verify Installation**
   ```bash
   ollama --version
   ```

3. **Pull a Model**
   ```bash
   ollama pull mistral
   ```

4. **Start Ollama**
   ```bash
   ollama serve
   ```

## Configuration

### Model Selection

Edit `.env.local` in your project root:

```env
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral
```

Available models:
- `mistral` (recommended, good balance)
- `neural-chat` (fast, lightweight)
- `dolphin-mixtral` (advanced reasoning)
- `llama2` (classic, reliable)

### Custom Configuration

To customize temperatures, timeouts, and endpoints, edit `src/constants/config.ts`:

```typescript
export const OLLAMA_CONFIG = {
  url: 'http://localhost:11434',
  timeout: {
    parse: 30000,      // 30 seconds for parsing
    insights: 60000,   // 60 seconds for insights
    predictions: 60000, // 60 seconds for predictions
    summary: 45000,    // 45 seconds for summaries
  },
  temperature: {
    parsing: 0.2,      // Low = stricter parsing
    analysis: 0.5,     // Medium = balanced insights
    creative: 0.7,     // Higher = more creative summaries
  },
};
```

## Usage

### Starting SmartSpend AI with Ollama

1. **Terminal 1: Start Ollama**
   ```bash
   ollama serve
   ```
   Keep this running in the background.

2. **Terminal 2: Start SmartSpend AI**
   ```bash
   npm run dev
   ```

3. **Check Ollama Status**
   - Look at the top bar of the app
   - Green indicator = Ollama is running ✅
   - Red indicator = Ollama is offline ❌

### Quick Entry with Voice/Text

1. Click "Quick Entry (AI)" button on the dashboard
2. Speak or type: "Spent $20 on coffee" or "Earned ₹5000 freelance work"
3. Ollama will parse and create a transaction

## Troubleshooting

### Ollama Not Found Error

**Problem:** "Could not connect to Ollama at localhost:11434"

**Solutions:**
1. Ensure Ollama is running: `ollama serve`
2. Check URL in `.env.local`: Should be `http://localhost:11434`
3. Restart Ollama: Kill process and run `ollama serve` again

### Model Not Found Error

**Problem:** "Model mistral not found"

**Solutions:**
1. Pull the model: `ollama pull mistral`
2. Check available models: `ollama list`
3. Ensure at least 4GB free RAM

### Slow Responses

**Problem:** AI operations are taking >30 seconds

**Solutions:**
1. Use faster model: `ollama pull neural-chat`
2. Close other heavy applications
3. Increase timeout in config.ts
4. Check system RAM (minimum 4GB recommended)

### Port Already in Use

**Problem:** "Address already in use :11434"

**Solutions:**
```bash
# Kill existing Ollama process
lsof -i :11434
kill -9 <PID>

# Or use different port
ollama serve --address 127.0.0.1:11435
```

Then update `.env.local`:
```env
VITE_OLLAMA_URL=http://localhost:11435
```

## Model Recommendations

| Model | Speed | Accuracy | Memory | Best For |
|-------|-------|----------|--------|----------|
| neural-chat | ⚡⚡⚡ | ⭐⭐⭐ | 4GB | Fast responses |
| mistral | ⚡⚡ | ⭐⭐⭐⭐ | 7GB | Balanced (default) |
| dolphin-mixtral | ⚡ | ⭐⭐⭐⭐⭐ | 13GB | Best accuracy |

## Performance Tips

1. **More RAM = Faster**: Use 8GB+ for best performance
2. **Use GPU**: If your GPU supports it, Ollama can use it (NVIDIA CUDA, AMD ROCm)
3. **Model Caching**: First run of each model is slower (loads into memory)
4. **Background Tasks**: Run Ollama on lower priority if needed

## Advanced: Running on Different Machine

To run Ollama on a different machine (e.g., server):

1. **Start Ollama with network binding:**
   ```bash
   ollama serve --address 0.0.0.0:11434
   ```

2. **Update `.env.local`:**
   ```env
   VITE_OLLAMA_URL=http://192.168.1.100:11434
   ```

3. **Security Note**: Add firewall rules to restrict access

## Development

### Testing Ollama Integration

```bash
# Check for errors in browser console
chrome DevTools → Console

# Check Ollama health
curl http://localhost:11434/api/health

# Check available models
curl http://localhost:11434/api/tags
```

### Debugging

Enable verbose logging in browser DevTools to see all Ollama requests and responses.

## Resources

- **Ollama Official**: https://ollama.ai
- **Model Library**: https://ollama.ai/library
- **Documentation**: https://github.com/ollama/ollama

## Support

If you encounter issues:

1. Check this guide first
2. Search existing issues: https://github.com/ollama/ollama/issues
3. Check SmartSpend AI repository issues
4. Share error messages from browser console and terminal

---

**Happy spending! 💰**
