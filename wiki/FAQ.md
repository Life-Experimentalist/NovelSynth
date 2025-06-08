# FAQ - Frequently Asked Questions

## 🔍 General Questions

### What is NovelSynth?
NovelSynth is an AI-powered browser extension that enhances your reading experience by improving text quality, creating summaries, and providing content analysis. It works on fiction sites, news articles, technical documentation, and more.

### Which browsers are supported?
NovelSynth works on:
- **Chrome** (88+)
- **Firefox** (85+)
- **Edge** (88+)
- **Brave** (Chromium-based)
- **Opera** (Chromium-based)

### Is NovelSynth free?
The extension itself is free, but you need an API key from an AI provider:
- **Google Gemini**: Generous free tier, paid plans available
- **OpenAI**: Pay-per-use pricing
- **Future providers**: More options coming soon

### How does NovelSynth protect my privacy?
- **Local Processing**: Your API keys are stored locally in your browser
- **No Cloud Storage**: We don't store your content or API keys
- **Direct API Calls**: Content goes directly to AI providers, not through our servers
- **Encrypted Storage**: API keys are encrypted in browser storage

## 🚀 Getting Started

### How do I get an API key?
**For Google Gemini (Recommended):**
1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy and paste into NovelSynth settings

**For OpenAI:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Generate a new API key
4. Copy and paste into NovelSynth settings

### Why isn't NovelSynth working on a website?
Common causes:
- **Permissions**: Extension may not have permission for that site
- **Content Protection**: Some sites block content selection
- **Page Structure**: Complex page layouts may interfere
- **JavaScript Conflicts**: Other extensions may conflict

**Solutions:**
1. Refresh the page
2. Check extension permissions
3. Try selecting different content
4. Disable other extensions temporarily

### How do I select text properly?
**Best Practices:**
- Select complete sentences or paragraphs
- Avoid selecting UI elements (buttons, menus)
- Include enough context (100+ words work best)
- Select clean text without formatting artifacts

## 🎨 Features and Usage

### What's the difference between enhancement types?
- **Grammar Enhancement**: Fixes errors, improves clarity
- **Creative Enhancement**: Adds descriptive language, improves style
- **Professional Enhancement**: Business-appropriate tone and structure
- **Academic Enhancement**: Formal, scholarly writing improvements

### Can I undo enhancements?
Yes! NovelSynth always preserves the original text:
- **Version History**: See all previous versions
- **One-Click Undo**: Restore original instantly
- **Selective Undo**: Revert specific changes
- **Compare View**: Side-by-side original and enhanced

### How long should selected text be?
**Optimal Length**: 100-2000 words
- **Too Short** (<50 words): Limited context for quality enhancement
- **Too Long** (>3000 words): May hit API limits or processing timeouts
- **Sweet Spot**: 200-800 words for best results

### Can I enhance multiple selections at once?
Yes! Use batch processing:
1. Hold Ctrl/Cmd while selecting multiple text blocks
2. Choose your enhancement type
3. Process all selections simultaneously
4. Review each enhancement individually

## 🔧 Technical Issues

### Why are my API requests failing?
**Common Causes:**
- **Invalid API Key**: Check if key is correctly entered
- **Rate Limits**: Too many requests too quickly
- **Quota Exceeded**: Monthly/daily limits reached
- **Network Issues**: Internet connection problems

**Solutions:**
1. Verify API key in provider dashboard
2. Wait a few minutes and try again
3. Check usage limits in provider account
4. Test internet connection

### The extension popup won't open
**Troubleshooting Steps:**
1. **Refresh Page**: Reload the current page
2. **Restart Browser**: Close and reopen browser
3. **Check Permissions**: Ensure extension has required permissions
4. **Reinstall Extension**: Remove and reinstall if needed

### Enhancement quality is poor
**Improvement Tips:**
- **Select More Context**: Include surrounding paragraphs
- **Check Content Type**: Ensure correct content type is detected
- **Try Different AI Provider**: Switch between Gemini and OpenAI
- **Adjust Enhancement Level**: Try deeper enhancement settings
- **Custom Prompts**: Create specialized prompts for your content

### Floating panel is not visible
**Solutions:**
- **Check if Minimized**: Click the corner tab to expand
- **Browser Zoom**: Reset zoom to 100%
- **Screen Resolution**: Panel adapts to screen size
- **Extension Permissions**: Verify site permissions

## 💰 Pricing and Limits

### How much does it cost to use?
**Google Gemini (Free Tier):**
- 15 requests per minute
- 1 million tokens per day
- Sufficient for casual use

**OpenAI Pricing:**
- GPT-3.5 Turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Typical enhancement: 1000-3000 tokens

### What happens if I exceed rate limits?
- **Automatic Retry**: NovelSynth waits and retries
- **Queue System**: Requests are queued automatically
- **Clear Messages**: You'll see status updates
- **No Data Loss**: Your requests won't be lost

### Can I monitor my usage?
Yes, in multiple ways:
- **Extension Stats**: Built-in usage tracking
- **Provider Dashboard**: Check your AI provider's usage page
- **Monthly Reports**: Track costs and usage patterns

## 🌐 Website Compatibility

### Which fiction sites work best?
**Fully Supported:**
- Archive of Our Own (AO3)
- FanFiction.Net
- Wattpad
- Royal Road
- Most WordPress-based fiction sites

**Partially Supported:**
- Sites with complex layouts may require manual text selection
- Mobile-optimized sites work with some limitations

### Does it work with PDF files?
Currently, NovelSynth works with web content only. PDF support is planned for future releases. Workarounds:
- **Copy and Paste**: Copy PDF text to a text editor
- **Online PDF Viewers**: Use web-based PDF viewers
- **Browser PDF Reader**: Works with browser's built-in PDF viewer

### Can I use it on subscription sites?
Yes, if you have legitimate access to the content:
- **Subscription Sites**: Works with sites you have access to
- **Paywalls**: Doesn't bypass payment requirements
- **DRM Content**: Respects content protection measures

## 🛠️ Customization

### How do I create custom prompts?
1. **Settings Tab**: Open NovelSynth settings
2. **Custom Prompts**: Navigate to prompt editor
3. **Choose Feature**: Select feature to customize
4. **Edit Template**: Modify the prompt template
5. **Test**: Use sample content to test
6. **Save**: Apply your custom prompt

### Can I save different configurations?
Yes! NovelSynth supports:
- **Profile Settings**: Different configs for different use cases
- **Site-Specific**: Save preferences per website
- **Content-Type Specific**: Different settings for fiction vs. technical content
- **Export/Import**: Share configurations with others

### How do I adjust enhancement strength?
**Enhancement Levels:**
- **Light**: Minimal changes, preserves original style
- **Standard**: Balanced improvements (recommended)
- **Deep**: Comprehensive enhancement with more changes

**Fine-Tuning:**
- **Style Sliders**: Adjust creativity, formality, conciseness
- **Custom Prompts**: Specify exact enhancement requirements
- **Provider Selection**: Different AI providers have different styles

## 🤝 Community and Support

### Where can I get help?
- **Documentation**: Check our comprehensive wiki
- **Community Forum**: Ask questions and share tips
- **GitHub Issues**: Report bugs and request features
- **Discord Server**: Real-time community support

### How do I report bugs?
1. **Check Known Issues**: Review existing bug reports
2. **Gather Information**: Note browser, extension version, steps to reproduce
3. **GitHub Issues**: Submit detailed bug report
4. **Include Logs**: Share any error messages or console logs

### Can I contribute to development?
Absolutely! We welcome:
- **Bug Reports**: Help us find and fix issues
- **Feature Requests**: Suggest new functionality
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve guides and tutorials
- **Testing**: Help test new features

### How do I request new features?
1. **Check Roadmap**: See if feature is already planned
2. **Community Discussion**: Discuss with other users
3. **GitHub Feature Request**: Submit formal request
4. **Upvote Existing**: Support existing feature requests

## 🔮 Future Development

### What features are coming next?
**Upcoming Features:**
- **More AI Providers**: Anthropic Claude, local LLMs
- **PDF Support**: Direct PDF enhancement
- **Mobile Apps**: Native mobile applications
- **Collaboration**: Shared enhancement workflows
- **Advanced Analytics**: Detailed quality metrics

### Will there be a mobile version?
Yes! Mobile support is in development:
- **Mobile Web**: Browser extension for mobile browsers
- **Native Apps**: Dedicated mobile applications
- **Cross-Platform**: Sync settings across devices

### How often is NovelSynth updated?
- **Major Releases**: Every 2-3 months
- **Bug Fixes**: As needed, usually within days
- **Security Updates**: Immediate for critical issues
- **Feature Updates**: Monthly for new capabilities

---

## 🔗 Still Need Help?

- **Documentation**: Browse our comprehensive [wiki](Home)
- **Support**: Check [Troubleshooting Guide](Troubleshooting)
- **Contact**: Submit a [Bug Report](Bug-Reports) or [Feature Request](Feature-Requests)

**Quick Links:**
- [First Setup](First-Setup) - Get started quickly
- [API Setup](API-Setup) - Configure AI providers
- [Basic Usage](Basic-Usage) - Learn core features
- [Content Enhancement](Content-Enhancement) - Master enhancement techniques
