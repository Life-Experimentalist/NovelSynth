# API Setup Guide

## 🔧 Comprehensive API Configuration

This guide covers detailed setup for all supported AI providers in NovelSynth.

## 🤖 Supported AI Providers

### 🥇 Google Gemini (Recommended)
- **Free Tier**: Generous free usage limits
- **Models**: Gemini 1.5 Flash, Gemini 1.5 Pro
- **Best For**: General content enhancement, summarization
- **Response Speed**: Fast

### 🧠 OpenAI
- **Models**: GPT-4, GPT-3.5 Turbo
- **Best For**: High-quality text generation, complex analysis
- **Pricing**: Pay-per-use
- **Response Speed**: Moderate

### 🎭 Anthropic Claude (Coming Soon)
- **Models**: Claude 3 Sonnet, Claude 3 Opus
- **Best For**: Long-form content, detailed analysis
- **Status**: Integration in development

## 🔑 API Key Setup

### Google Gemini Setup

#### Step 1: Get Your API Key
1. **Visit Google AI Studio**: [makersuite.google.com](https://makersuite.google.com/)
2. **Sign In**: Use your Google account
3. **Create Project** (if needed): Click "Create new project"
4. **Generate Key**: Click "Get API Key" → "Create API Key in new project"
5. **Copy Key**: Save the key securely (starts with `AIza`)

#### Step 2: Configure in NovelSynth
1. Open NovelSynth extension popup
2. Click "Settings" tab
3. Select "Google Gemini" as provider
4. Paste your API key in the field
5. Choose your preferred model:
   - **Gemini 1.5 Flash**: Faster, good for most tasks
   - **Gemini 1.5 Pro**: More capable, better for complex tasks
6. Click "Test Connection"
7. Save settings

#### Step 3: Usage Limits (Free Tier)
- **Requests**: 15 requests per minute
- **Tokens**: 1 million tokens per day
- **Rate Limiting**: Built-in retry logic

### OpenAI Setup

#### Step 1: Get Your API Key
1. **Visit OpenAI Platform**: [platform.openai.com](https://platform.openai.com/)
2. **Create Account**: Sign up or log in
3. **Add Payment Method**: Go to Billing → Payment methods
4. **Add Credits**: Purchase credits for API usage
5. **Generate Key**: API Keys → Create new secret key
6. **Copy Key**: Save the key securely (starts with `sk-`)

#### Step 2: Configure in NovelSynth
1. Open NovelSynth extension popup
2. Click "Settings" tab
3. Select "OpenAI" as provider
4. Paste your API key in the field
5. Choose your preferred model:
   - **GPT-3.5 Turbo**: Faster, more economical
   - **GPT-4**: Highest quality, more expensive
6. Click "Test Connection"
7. Save settings

#### Step 3: Usage and Pricing
- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens
- **Rate Limits**: 3 requests per minute (free tier)
- **Monitoring**: Check usage at platform.openai.com

## ⚙️ Advanced Configuration

### Model Selection Strategy

#### For Different Content Types
```
Novel/Fiction Content:
- Primary: Gemini 1.5 Pro (creative, context-aware)
- Alternative: GPT-4 (high quality)

Technical Documentation:
- Primary: GPT-4 (precise, factual)
- Alternative: Gemini 1.5 Flash (fast)

News Articles:
- Primary: Gemini 1.5 Flash (quick summaries)
- Alternative: GPT-3.5 Turbo (economical)

Academic Papers:
- Primary: GPT-4 (detailed analysis)
- Alternative: Gemini 1.5 Pro (comprehensive)
```

### Rate Limiting Configuration

#### Automatic Rate Limiting
NovelSynth includes built-in rate limiting:
- **Request Queuing**: Automatically queues requests
- **Exponential Backoff**: Gradually increases wait time
- **Error Recovery**: Retries failed requests

#### Custom Rate Limits
You can configure custom limits in Settings:
```json
{
  "requestsPerMinute": 10,
  "requestsPerHour": 100,
  "requestsPerDay": 1000,
  "retryAfter": 60,
  "backoffMultiplier": 2
}
```

### API Endpoint Configuration

#### Custom Base URLs
For enterprise or alternative endpoints:

**OpenAI Compatible APIs:**
```
Azure OpenAI: https://your-resource.openai.azure.com/
OpenRouter: https://openrouter.ai/api/v1
Local LLaMA: http://localhost:8080/v1
```

**Gemini Alternatives:**
```
Vertex AI: https://us-central1-aiplatform.googleapis.com/
```

## 🔒 Security Best Practices

### API Key Security
- **Never Share**: Don't share API keys publicly
- **Rotation**: Rotate keys periodically
- **Scope Limiting**: Use minimum required permissions
- **Monitoring**: Monitor usage for unusual activity

### Local Storage
- **Encryption**: API keys are encrypted locally
- **No Cloud Storage**: Keys never leave your browser
- **Clear on Uninstall**: Keys are removed when extension is uninstalled

### Network Security
- **HTTPS Only**: All API calls use encrypted connections
- **No Logging**: Content is not logged by NovelSynth
- **Direct Calls**: No intermediate servers

## 🧪 Testing Your Setup

### Connection Test
1. **Basic Test**: Use "Test Connection" button
2. **Feature Test**: Try enhancing sample text
3. **Error Handling**: Verify error messages appear correctly

### Sample Test Content
Use this text to test your setup:
```
The quick brown fox jumps over the lazy dog. This sentence contains
every letter of the alphabet and is commonly used for testing. It
demonstrates how well the AI can enhance or analyze simple content.
```

### Expected Results
- **Enhancement**: Improved grammar and style
- **Summarization**: Brief summary of the content
- **Analysis**: Insights about the text structure

## ❗ Troubleshooting

### Common API Errors

#### Invalid API Key
```
Error: Invalid API key
Solution: Double-check key format and regenerate if needed
```

#### Rate Limit Exceeded
```
Error: Rate limit exceeded
Solution: Wait and retry, or upgrade your plan
```

#### Network Errors
```
Error: Network request failed
Solution: Check internet connection and firewall settings
```

### Provider-Specific Issues

#### Google Gemini
- **Geographic Restrictions**: Not available in all countries
- **Model Availability**: Some models may be temporarily unavailable
- **Quota Limits**: Free tier has daily limits

#### OpenAI
- **Billing Issues**: Ensure valid payment method
- **Model Access**: Some models require special access
- **Usage Monitoring**: Track costs in dashboard

## 📊 Usage Monitoring

### Built-in Monitoring
NovelSynth tracks:
- **Request Count**: Daily/weekly/monthly usage
- **Token Usage**: Input/output token consumption
- **Error Rates**: Failed request tracking
- **Response Times**: Performance monitoring

### External Monitoring
Check your provider dashboards:
- **Gemini**: Google AI Studio usage page
- **OpenAI**: Platform usage dashboard

## 🔄 Switching Providers

### Migration Guide
1. **Setup New Provider**: Configure new API key
2. **Test Functionality**: Verify new provider works
3. **Update Defaults**: Change default provider in settings
4. **Remove Old Keys**: Delete unused API keys for security

### Provider Comparison
| Feature   | Gemini     | OpenAI     | Notes                             |
| --------- | ---------- | ---------- | --------------------------------- |
| Free Tier | ✅ Yes      | ❌ No       | Gemini offers generous free usage |
| Quality   | ⭐⭐⭐⭐       | ⭐⭐⭐⭐⭐      | OpenAI slightly higher quality    |
| Speed     | ⚡ Fast     | ⚡ Moderate | Gemini generally faster           |
| Cost      | 💰 Free/Low | 💰 Moderate | Significant cost difference       |

---

## 🔗 Next Steps

- [Basic Usage](Basic-Usage) - Learn to use features effectively
- [Content Enhancement](Content-Enhancement) - Detailed feature guide
- [Custom Prompts](Custom-Prompts) - Customize AI behavior
- [Troubleshooting](Troubleshooting) - Solve common problems

**Need Help?** Join our [Community Forum](Community-Forum) for API setup assistance.
