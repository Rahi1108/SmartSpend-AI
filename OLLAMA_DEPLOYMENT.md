# Ollama Deployment Guide

## Local Development vs Production

### Local Development ✅
- Ollama runs on your machine at `http://localhost:11434`
- SmartSpend AI connects locally
- Works offline, free, private

### Production Deployment ⚠️

When you deploy SmartSpend AI to a server (Vercel, Netlify, VPS, etc.), Ollama needs to be accessible from that server.

## Deployment Options

### Option 1: VPS with Ollama (Recommended)

Deploy both SmartSpend AI and Ollama on the same VPS:

```bash
# On your VPS (Ubuntu/Debian)
# 1. Install Ollama
curl https://ollama.ai/install.sh | sh

# 2. Pull models
ollama pull mistral

# 3. Start Ollama (as service)
sudo systemctl enable ollama
sudo systemctl start ollama

# 4. Configure Ollama to listen on all interfaces
# Edit /etc/systemd/system/ollama.service
# Add: Environment="OLLAMA_HOST=0.0.0.0:11434"

# 5. Restart Ollama
sudo systemctl daemon-reload
sudo systemctl restart ollama

# 6. Deploy SmartSpend AI with env var
VITE_OLLAMA_URL=http://localhost:11434
```

### Option 2: Separate Ollama Server

Run Ollama on a dedicated machine/server:

```bash
# On Ollama server
ollama serve --address 0.0.0.0:11434

# In SmartSpend AI deployment
VITE_OLLAMA_URL=http://your-ollama-server.com:11434
```

### Option 3: Docker Deployment

```yaml
# docker-compose.yml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama:/root/.ollama
    restart: unless-stopped

  smartspend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_OLLAMA_URL=http://ollama:11434
    depends_on:
      - ollama
```

## Environment Variables for Deployment

### Vercel/Netlify (Frontend-only)
```env
# These platforms don't support Ollama
# Use Option 1 or 2 above
VITE_OLLAMA_URL=https://your-ollama-api.com
```

### VPS/Cloud Server
```env
VITE_OLLAMA_URL=http://localhost:11434
# or
VITE_OLLAMA_URL=http://ollama-server.com:11434
```

## Security Considerations

### For Production:
1. **Firewall**: Only allow Ollama port (11434) from your app server
2. **HTTPS**: Use reverse proxy (nginx) with SSL
3. **Authentication**: Add API key authentication if exposing publicly

### Example nginx config:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location /api/ollama/ {
        proxy_pass http://localhost:11434/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Cost Comparison

| Option | Cost | Setup | Maintenance |
|--------|------|-------|-------------|
| Local Dev | Free | Easy | None |
| VPS Ollama | $5-20/month | Medium | Low |
| Separate Server | $5-50/month | Hard | Medium |
| Cloud AI APIs | $0.002/1K tokens | Easy | None |

## Quick Start for VPS

```bash
# 1. Get a VPS (DigitalOcean, Linode, etc.)
# 2. SSH into server
ssh root@your-server

# 3. Install Ollama
curl https://ollama.ai/install.sh | sh

# 4. Pull model
ollama pull mistral

# 5. Start Ollama
ollama serve &

# 6. Deploy SmartSpend AI
# Use your preferred deployment method
# Set VITE_OLLAMA_URL=http://localhost:11434
```

## Testing Deployment

```bash
# Test Ollama connectivity
curl http://localhost:11434/api/health

# Test from your app server
curl http://your-ollama-server:11434/api/health
```

## Fallback Strategy

For production reliability, consider:

```typescript
// In src/services/ai.ts
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

// Add fallback to cloud API if Ollama fails
async function callAIWithFallback(prompt: string) {
  try {
    return await callOllama(prompt);
  } catch (error) {
    // Fallback to cloud API (OpenAI, Anthropic, etc.)
    return await callCloudAPI(prompt);
  }
}
```

## Summary

**Yes, Ollama works in production!** You just need to:

1. Run Ollama on a server (VPS recommended)
2. Make it accessible to your deployed app
3. Set the correct `VITE_OLLAMA_URL` environment variable

This keeps your AI processing local, private, and free (except VPS costs).

---

**Need help with a specific deployment platform?** Let me know which one you're using!
