---
name: 🔧 Performance Issue
about: Report performance problems, slowdowns, or resource usage issues
title: '[PERFORMANCE] '
labels: ['performance', 'needs-investigation']
assignees: ['Life-Experimentalist']

---

## 🔧 Performance Issue Summary
**Brief description of the performance problem:**

## 📊 Performance Impact
**What kind of performance issue are you experiencing?**

- [ ] **Slow Save Point Creation** - Takes a long time to create save points
- [ ] **Slow Save Point Restoration** - Takes a long time to restore
- [ ] **High Memory Usage** - Extension uses too much RAM
- [ ] **High CPU Usage** - Extension causes high CPU load
- [ ] **VS Code Freezing** - Editor becomes unresponsive
- [ ] **Large File Handling** - Issues with big projects
- [ ] **Startup Slowdown** - Extension slows down VS Code startup
- [ ] **Other**: ________________

## ⏱️ Timing Information
**Please provide timing details:**

### Save Point Creation
- **Small projects** (< 100 files): _____ seconds
- **Medium projects** (100-1000 files): _____ seconds
- **Large projects** (> 1000 files): _____ seconds

### Save Point Restoration
- **Time to restore**: _____ seconds
- **Number of files restored**: _____ files

### When does the slowdown occur?
- [ ] Immediately when starting the operation
- [ ] Gradually during the operation
- [ ] At the end of the operation
- [ ] Continuously while extension is active

## 📁 Project Details
**Information about your project:**

- **Total Files**: ~_____ files
- **Project Size**: ~_____ MB/GB
- **File Types**: [e.g., .js, .ts, .py, .html, etc.]
- **Largest Files**: ~_____ MB each
- **Deep Folder Structure**: Yes / No (max depth: _____)
- **Symbolic Links**: Yes / No
- **Network/Cloud Drive**: Yes / No (OneDrive, Dropbox, etc.)

### Folder Structure
```
project/
├── src/ (~___ files)
├── node_modules/ (~___ files) [excluded?]
├── dist/ (~___ files) [excluded?]
└── other folders...
```

## ⚙️ Extension Configuration
**Your Global Save State settings:**

```json
{
  "globalSaveState.excludePatterns": [
    // Your exclude patterns here
  ],
  "globalSaveState.maxSavePoints": 50
}
```

**Current save points**: _____ save points stored

## 💻 System Information
**Your system specifications:**

- **OS**: [Windows 11, macOS 14.2, Ubuntu 22.04, etc.]
- **CPU**: [e.g., Intel i7-12700K, M1 Pro, AMD Ryzen 5600X]
- **RAM**: [e.g., 16GB, 32GB]
- **Storage Type**: [SSD, HDD, NVMe]
- **Available Storage**: [e.g., 50GB free out of 500GB]
- **VS Code Version**: [e.g., 1.85.2]
- **Extension Version**: [e.g., 1.0.3]

## 🔍 Performance Monitoring
**If you have performance data, please share:**

### Task Manager / Activity Monitor
```
During save point operation:
- CPU Usage: ___%
- Memory Usage: ___MB
- Disk Usage: ___%
```

### VS Code Performance
- **Extension Host CPU**: ___%
- **Extension Host Memory**: ___MB
- **Developer Tools Performance tab**: [any insights]

## 📝 Steps to Reproduce
**How to reproduce this performance issue:**

1. Open project with [describe project characteristics]
2. Execute command: [Create/Restore Save Point]
3. Observe: [what performance issue occurs]
4. Duration: [how long it takes]

## 🔧 Troubleshooting Attempted
**What have you tried to improve performance?**

- [ ] Adjusted exclude patterns
- [ ] Reduced max save points
- [ ] Restarted VS Code
- [ ] Cleared save point history
- [ ] Tested with smaller projects
- [ ] Disabled other extensions
- [ ] Updated VS Code/Extension
- [ ] Other: ________________

## 📈 Expected Performance
**What performance would you consider acceptable?**

- **Save point creation**: _____ seconds
- **Save point restoration**: _____ seconds
- **Memory usage**: _____ MB
- **No freezing/blocking** of VS Code interface

## 📊 Comparison Data
**Performance with other tools (if applicable):**

- **Git operations**: Git add/commit takes _____ seconds
- **File copying**: Manual copy of project takes _____ seconds
- **Other backup tools**: [comparison if you've used any]

---

### 📋 Checklist
**Before submitting, please check:**

- [ ] I have provided timing information
- [ ] I have described my project characteristics
- [ ] I have included system specifications
- [ ] I have tried basic troubleshooting steps
- [ ] I have tested with different project sizes (if possible)
- [ ] I have checked that other extensions aren't causing the issue