# Troubleshooting Guide

## 🔧 Quick Fixes for Common Issues

This guide helps you solve the most common NovelSynth problems quickly and efficiently.

## 🚨 Emergency Fixes

### Extension Not Loading
**Symptoms**: NovelSynth icon not visible, features not working

**Quick Fixes:**
1. **Refresh Page**: Press F5 or Ctrl+R
2. **Restart Browser**: Close and reopen your browser
3. **Check Extension**: Go to browser extensions page, ensure NovelSynth is enabled
4. **Reload Extension**: Disable and re-enable NovelSynth

**Detailed Solutions:**
```
Chrome: chrome://extensions/ → Find NovelSynth → Toggle off/on
Firefox: about:addons → Extensions → NovelSynth → Disable/Enable
Edge: edge://extensions/ → Find NovelSynth → Toggle off/on
```

### API Key Not Working
**Symptoms**: "Invalid API key" or "Authentication failed" errors

**Quick Fixes:**
1. **Copy Key Again**: Get fresh API key from provider
2. **Remove Spaces**: Ensure no extra spaces in key
3. **Test Connection**: Use "Test Connection" button in settings
4. **Check Permissions**: Verify API key has required permissions

**Provider-Specific:**
```
Google Gemini:
- Key format: AIza...
- Check: makersuite.google.com
- Quota: 1M tokens/day free

OpenAI:
- Key format: sk-...
- Check: platform.openai.com
- Billing: Ensure payment method added
```

### No Response from AI
**Symptoms**: Processing hangs, no results returned

**Quick Fixes:**
1. **Check Internet**: Verify stable connection
2. **Wait Longer**: Some requests take 30+ seconds
3. **Try Again**: Cancel and retry with shorter text
4. **Switch Provider**: Try different AI service

## 🎯 Feature-Specific Issues

### Text Selection Problems

#### Can't Select Text
**Causes & Solutions:**
- **Protected Content**: Some sites prevent text selection
  - *Solution*: Try right-click → "Copy" instead
- **Dynamic Content**: Content loaded via JavaScript
  - *Solution*: Wait for page to fully load
- **Overlapping Elements**: UI elements blocking selection
  - *Solution*: Zoom out or try different browser

#### Selection Includes UI Elements
**Problem**: Selected text includes buttons, menus, etc.
**Solution**:
1. Be more precise with selection
2. Start selection from middle of text
3. Use Ctrl+A cautiously in content areas only

#### Enhanced Text Too Short/Long
**Problem**: AI response doesn't match selected length
**Solutions:**
- **Too Short**: Select more context, use "Detailed" mode
- **Too Long**: Use "Concise" mode, select smaller sections
- **Just Right**: Adjust length preferences in settings

### Enhancement Quality Issues

#### Poor Grammar Corrections
**Symptoms**: Mistakes introduced, incorrect fixes

**Diagnostic Steps:**
1. **Check Content Type**: Ensure correct type is detected
2. **Language Setting**: Verify language is set correctly
3. **Provider Comparison**: Try different AI provider
4. **Report Issues**: Submit examples of poor corrections

**Optimization:**
```
Better Results:
✓ Select complete sentences
✓ Include context paragraphs
✓ Use appropriate content type
✓ Review and edit results

Avoid:
✗ Partial sentences
✗ Mixed language content
✗ Technical jargon without context
✗ Accepting all changes blindly
```

#### Lost Original Voice/Style
**Problem**: Enhanced text doesn't sound like original author

**Solutions:**
1. **Lighter Enhancement**: Use "Light" mode instead of "Deep"
2. **Custom Prompts**: Create prompts that preserve voice
3. **Style Settings**: Adjust creativity and formality sliders
4. **Selective Acceptance**: Accept only grammar fixes, reject style changes

#### Inconsistent Results
**Problem**: Same text produces different results

**Causes:**
- **AI Randomness**: Normal behavior, AI includes creativity
- **Context Changes**: Different surrounding text affects results
- **Provider Differences**: Different AI services have different styles

**Solutions:**
- **Temperature Settings**: Lower creativity for consistency
- **Cache Results**: Reuse previous good enhancements
- **Standard Prompts**: Use same prompts for related content

### Performance Issues

#### Slow Response Times
**Diagnosis:**
1. **Check Internet Speed**: Run speed test
2. **Provider Status**: Check AI provider status pages
3. **Request Size**: Try smaller text selections
4. **Peak Times**: Avoid busy hours if possible

**Optimization:**
```
Faster Processing:
- Shorter selections (200-800 words)
- Use Gemini Flash instead of Pro
- Avoid peak hours (9 AM - 5 PM UTC)
- Clear browser cache periodically

Provider Speed Comparison:
Gemini Flash: ~3-8 seconds
Gemini Pro: ~5-15 seconds
GPT-3.5 Turbo: ~5-12 seconds
GPT-4: ~10-30 seconds
```

#### Rate Limit Exceeded
**Symptoms**: "Rate limit exceeded" or "Quota exceeded" errors

**Immediate Fixes:**
1. **Wait**: Rate limits reset after time period
2. **Check Usage**: Review provider dashboard
3. **Reduce Frequency**: Space out requests
4. **Upgrade Plan**: Consider paid tier if needed

**Rate Limit Details:**
```
Google Gemini (Free):
- 15 requests/minute
- 1 million tokens/day

OpenAI (Free):
- 3 requests/minute
- $5 monthly limit

Solutions:
- Batch multiple selections
- Use shorter text selections
- Process during off-peak hours
```

## 🌐 Browser-Specific Issues

### Chrome Issues

#### Extension Permissions
**Problem**: NovelSynth doesn't work on certain sites
**Solution:**
1. Go to `chrome://extensions/`
2. Find NovelSynth → "Details"
3. Enable "Allow on all sites"
4. Or add specific sites manually

#### Memory Issues
**Problem**: Browser slows down with NovelSynth
**Solution:**
1. Close unnecessary tabs
2. Restart Chrome periodically
3. Check Chrome Task Manager (Shift+Esc)
4. Disable other extensions temporarily

### Firefox Issues

#### Content Security Policy
**Problem**: Extension blocked by site security
**Solution:**
1. Check for security warnings in console
2. Try different site or page
3. Report site compatibility issue

#### Private Browsing
**Problem**: Extension not available in private mode
**Solution:**
1. Go to `about:addons`
2. Find NovelSynth → Options
3. Enable "Run in Private Windows"

### Edge Issues

#### Sync Problems
**Problem**: Settings don't sync across devices
**Solution:**
1. Check Edge sync settings
2. Manually export/import settings
3. Use NovelSynth account sync (when available)

## 📱 Mobile Browser Issues

### Limited Functionality
**Problem**: Some features don't work on mobile

**Current Limitations:**
- Floating panel may be hidden
- Text selection can be difficult
- Popup sizing issues

**Workarounds:**
1. Use landscape orientation
2. Zoom out for better text selection
3. Use browser's "Desktop site" mode
4. Access via extension icon rather than floating panel

### Touch Selection Issues
**Problem**: Difficult to select text precisely

**Tips:**
1. **Start in Middle**: Begin selection from center of text
2. **Use Handles**: Drag selection handles carefully
3. **Zoom In**: Zoom page for precise selection
4. **Copy/Paste**: Use browser's copy function as alternative

## 🔐 Security and Privacy Issues

### API Key Security
**Concerns**: Protecting your API keys

**Best Practices:**
1. **Never Share**: Don't share keys publicly
2. **Rotate Regularly**: Generate new keys periodically
3. **Monitor Usage**: Check for unexpected usage
4. **Secure Storage**: Keys are encrypted in browser

### Content Privacy
**Concerns**: Where does my text go?

**Privacy Assurance:**
- **Direct to AI**: Content goes directly to AI provider
- **No NovelSynth Servers**: We don't store or process content
- **Local Storage**: All settings stored locally
- **Provider Policies**: Review AI provider privacy policies

### Extension Permissions
**Concerns**: Why does NovelSynth need permissions?

**Required Permissions:**
- **Active Tab**: To read and enhance page content
- **Storage**: To save your settings and API keys
- **Host Permissions**: To work on websites you visit

## 🛠️ Advanced Troubleshooting

### Console Debugging
**For Technical Users:**

1. **Open Developer Tools**: F12 or right-click → Inspect
2. **Check Console**: Look for NovelSynth errors
3. **Network Tab**: Check API request status
4. **Extension Background**: Check extension console

**Common Error Patterns:**
```
CORS Error: Cross-origin request blocked
→ Try different browser or disable strict security

Network Error: fetch failed
→ Check internet connection and firewall

JSON Parse Error: Invalid response
→ API provider issue, try again later
```

### Clean Reinstall
**When All Else Fails:**

1. **Export Settings**: Backup your configuration
2. **Remove Extension**: Uninstall completely
3. **Clear Data**: Clear browser data for extension
4. **Reinstall**: Install fresh from store
5. **Restore Settings**: Import your backup

### System Requirements Check
**Verify Compatibility:**

```
Minimum Requirements:
- Chrome 88+ / Firefox 85+ / Edge 88+
- 4GB RAM (8GB recommended)
- Stable internet (1 Mbps minimum)
- JavaScript enabled
- Third-party cookies allowed (for API calls)

Optimal Environment:
- Latest browser version
- 8GB+ RAM
- Fast internet (10+ Mbps)
- AdBlock disabled for AI provider domains
- Hardware acceleration enabled
```

## 📊 Diagnostic Tools

### Built-in Diagnostics
**Extension Health Check:**
1. Open NovelSynth popup
2. Go to Settings → Diagnostics
3. Run "System Check"
4. Review results and recommendations

### Manual Testing
**Step-by-Step Verification:**

1. **Basic Function**: Can you open the popup?
2. **Text Selection**: Can you select text on a simple page?
3. **API Connection**: Does "Test Connection" work?
4. **Simple Enhancement**: Try enhancing one sentence
5. **Feature Access**: Can you access all features?

### Log Collection
**For Bug Reports:**

1. **Enable Debug Mode**: Settings → Advanced → Debug Logging
2. **Reproduce Issue**: Repeat the problem
3. **Download Logs**: Settings → Advanced → Download Logs
4. **Submit Report**: Include logs with bug report

## 🔗 Getting More Help

### Self-Service Resources
- **FAQ**: Check [Frequently Asked Questions](FAQ)
- **User Guide**: Review [Basic Usage](Basic-Usage)
- **API Help**: See [API Setup Guide](API-Setup)

### Community Support
- **Forums**: Post in [Community Forum](Community-Forum)
- **Discord**: Join real-time chat support
- **Reddit**: r/NovelSynth community

### Direct Support
- **Bug Reports**: [Submit Issue](Bug-Reports)
- **Feature Requests**: [Request Feature](Feature-Requests)
- **Email Support**: For premium users

### Emergency Contacts
**Critical Issues Only:**
- Security vulnerabilities
- Data loss concerns
- Legal compliance issues

---

## 🔄 Prevention Tips

### Regular Maintenance
- **Update Browser**: Keep browser current
- **Clear Cache**: Monthly browser cache clearing
- **Check API Usage**: Monitor monthly consumption
- **Backup Settings**: Export settings regularly

### Best Practices
- **Stable Internet**: Use reliable connection
- **Reasonable Selections**: 100-1000 word selections work best
- **Review Results**: Always check AI output
- **Report Issues**: Help improve the extension

**Remember**: Most issues have simple solutions. Try the quick fixes first, then work through the detailed troubleshooting steps.
