# Local AI Setup - Desktop RTX 4090

This guide explains how to set up your desktop RTX 4090 as a local AI server that your Samsung Fold 7 can access remotely.

## Why Local AI?

- **Free** - No API costs when using your own hardware
- **Fast** - RTX 4090 is extremely powerful for AI inference
- **Private** - Data never leaves your network
- **Offline** - Works when you're home, even without internet

## Setup Options

### Option 1: LM Studio (Easiest)

1. **Download LM Studio** on your desktop:
   - https://lmstudio.ai/
   
2. **Download models:**
   - Llama 3 70B
   - Mistral Large
   - CodeLlama (for coding tasks)

3. **Start local server:**
   - In LM Studio, go to "Local Server"
   - Click "Start Server"
   - Note the URL (usually `http://localhost:1234`)

4. **Enable remote access:**
   - Open Windows Firewall
   - Allow port 1234 (or your chosen port)
   - Get your desktop IP: `ipconfig` in CMD

5. **Update Fold 7 config:**
   ```typescript
   LOCAL_AI_ENDPOINT: 'http://YOUR-DESKTOP-IP:1234/v1/chat/completions'
   ```

### Option 2: Ollama (Advanced)

```bash
# Install Ollama
winget install Ollama.Ollama

# Pull models
ollama pull llama3:70b
ollama pull mistral-large

# Start server with remote access
$env:OLLAMA_HOST="0.0.0.0:11434"
ollama serve
```

Update config:
```typescript
LOCAL_AI_ENDPOINT: 'http://YOUR-DESKTOP-IP:11434/api/generate'
```

### Option 3: Text Generation WebUI

```bash
# Clone repo
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui

# Install
start_windows.bat

# Enable API
python server.py --api --listen
```

## Network Configuration

### Same WiFi (Easiest)
- Desktop and Fold 7 on same WiFi
- Use desktop's local IP (e.g., `192.168.1.100`)

### Remote Access (Advanced)
1. **Port forwarding** on your router
2. **Dynamic DNS** (e.g., DuckDNS)
3. **VPN** (Tailscale recommended)

### Tailscale VPN (Recommended for Remote)

1. **Install Tailscale:**
   - Desktop: https://tailscale.com/download/windows
   - Fold 7: Install Tailscale app from Play Store

2. **Connect both devices** to same Tailscale network

3. **Use Tailscale IP** in config:
   ```typescript
   LOCAL_AI_ENDPOINT: 'http://100.x.x.x:1234/v1/chat/completions'
   ```

## Testing

Test from your Fold 7 browser:
```
http://YOUR-DESKTOP-IP:1234/v1/models
```

Should return list of available models.

## Performance Tips

- **RTX 4090** can run:
  - Llama 3 70B at ~30 tokens/sec
  - Mistral Large at ~50 tokens/sec
  - Multiple models simultaneously

- **Quantization:** Use GGUF Q4 or Q5 for best speed/quality balance

- **VRAM:** 4090 has 24GB - can fit multiple large models

## Security

⚠️ **Important:**
- Only expose on trusted networks
- Use VPN for remote access
- Consider adding API key authentication
- Firewall rules to restrict access

## Fallback Strategy

The PersonalAIService automatically falls back to cloud AI if local is unavailable:

1. Try local AI first (free, fast)
2. If offline/slow, use Gemini (cheap, fast)
3. Complex tasks → Claude (best quality)
4. M365 tasks → Copilot (free with subscription)

## Cost Savings

Running local AI on your 4090:
- **Electricity:** ~$0.50/day (24/7)
- **API costs saved:** $50-200/month
- **ROI:** Pays for itself in 1-2 months of heavy use
