# Build System

This page explains the NovelSynth build system architecture and processes.

## 🏗️ Build Pipeline Overview

The NovelSynth build system is designed for cross-browser compatibility and professional distribution:

```mermaid
graph LR
    subgraph "📁 Source Code"
        TS[📝 TypeScript Files<br/>src/]
        RX[⚛️ React Components<br/>popup/]
        CSS[🎨 Stylesheets<br/>styles/]
        JSON[⚙️ Configuration<br/>manifest.json, package.json]
    end

    subgraph "🔄 Build Process"
        SYNC[🔄 Metadata Sync<br/>Manifest ↔ Package]
        WP[📦 Webpack Build<br/>Compilation & Bundling]
        TC[✅ Type Checking<br/>TypeScript Validation]
        OPT[⚡ Optimization<br/>Minification & Tree Shaking]
    end

    subgraph "🌐 Browser Packages"
        subgraph "Chrome"
            CM3[📄 Manifest V3<br/>Service Worker]
            CZ[📦 Chrome ZIP<br/>Store Ready]
        end

        subgraph "Firefox"
            CM2[📄 Manifest V2<br/>Background Scripts]
            FZ[📦 Firefox ZIP<br/>AMO Ready]
        end

        SRC[📦 Source ZIP<br/>Review Package]
    end

    subgraph "📋 Documentation"
        RN[📝 Release Notes<br/>Automated Generation]
        DOCS[📚 Documentation<br/>Updated Automatically]
    end

    TS --> SYNC
    RX --> SYNC
    CSS --> SYNC
    JSON --> SYNC

    SYNC --> WP
    WP --> TC
    TC --> OPT

    OPT --> CM3
    OPT --> CM2
    CM3 --> CZ
    CM2 --> FZ
    OPT --> SRC

    OPT --> RN
    OPT --> DOCS

    style SYNC fill:#e3f2fd,stroke:#0277bd
    style WP fill:#f1f8e9,stroke:#388e3c
    style CM3 fill:#4285f4,color:#fff
    style CM2 fill:#ff6611,color:#fff
    style CZ fill:#4285f4,color:#fff
    style FZ fill:#ff6611,color:#fff
```

## 🔄 Metadata Synchronization

The build system automatically synchronizes metadata between manifest.json and package.json:

```mermaid
sequenceDiagram
    participant 🏗️ as Build Script
    participant 📄 as manifest.json
    participant 📦 as package.json
    participant 💾 as Backup
    participant ✅ as Validation

    🏗️->>📄: Read manifest.json
    🏗️->>📦: Read package.json
    🏗️->>💾: Create backup

    Note over 🏗️: Manifest is source of truth

    🏗️->>📦: Sync version
    🏗️->>📦: Sync author
    🏗️->>📦: Sync description
    🏗️->>📦: Sync license
    🏗️->>📦: Update repository URL
    🏗️->>📦: Set homepage URL

    🏗️->>✅: Validate consistency
    ✅-->>🏗️: Report status

    🏗️->>📦: Write updated package.json

    Note over 📦: extensionInfo added<br/>with metadata
```

## 🎯 CLI Interface Design

The build system features a beautiful command-line interface:

```mermaid
graph TD
    START([🚀 npm run build:full]) --> BANNER[🎨 Display System Banner]
    BANNER --> INFO[📊 Show System Information]
    INFO --> PROGRESS[📈 Initialize Progress Tracking]

    subgraph "📊 System Information Display"
        PI[💻 Platform Info<br/>OS, Architecture, Node.js]
        PM[🧠 Memory Info<br/>Total, Free, Usage]
        PP[📁 Project Info<br/>Name, Version, Author]
        PT[⏰ Timestamp<br/>Build Time, Working Directory]
    end

    subgraph "📈 Progress Tracking"
        P1[🔄 Step 1/6: Metadata Sync]
        P2[🧹 Step 2/6: Clean Build]
        P3[📦 Step 3/6: Webpack Build]
        P4[🌐 Step 4/6: Browser Packages]
        P5[📦 Step 5/6: Source Package]
        P6[📝 Step 6/6: Release Notes]
    end

    PROGRESS --> P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> P6
    P6 --> SUCCESS[🎉 Success Banner]

    INFO --> PI
    INFO --> PM
    INFO --> PP
    INFO --> PT

    style BANNER fill:#e1f5fe,stroke:#0277bd
    style SUCCESS fill:#c8e6c9,stroke:#388e3c
    style PI fill:#f3e5f5,stroke:#7b1fa2
    style PM fill:#fff3e0,stroke:#f57c00
    style PP fill:#e8f5e8,stroke:#2e7d32
    style PT fill:#fce4ec,stroke:#c2185b
```

## 🛠️ Development Workflow

The complete development and build workflow:

```mermaid
flowchart TD
    DEV[👨‍💻 Developer] --> CODE[💻 Write Code]
    CODE --> TEST[🧪 Local Testing]
    TEST --> COMMIT[📝 Git Commit]
    COMMIT --> SYNC[🔄 Run Metadata Sync]

    SYNC --> BUILD{🏗️ Build Type?}
    BUILD -->|Development| DEV_BUILD[📦 npm run build:dev]
    BUILD -->|Production| PROD_BUILD[🚀 npm run build:full]
    BUILD -->|Watch Mode| WATCH[👀 npm run watch]

    DEV_BUILD --> DEV_TEST[🧪 Browser Testing]
    WATCH --> DEV_TEST
    DEV_TEST --> CODE

    PROD_BUILD --> PACKAGES[📦 Generate Packages]
    PACKAGES --> VALIDATE[✅ Package Validation]
    VALIDATE --> RELEASE[🚀 Create Release]

    subgraph "📦 Generated Packages"
        CHR[🌐 Chrome Extension<br/>Manifest V3]
        FF[🦊 Firefox Add-on<br/>Manifest V2]
        SRC[📂 Source Code<br/>Review Package]
    end

    PACKAGES --> CHR
    PACKAGES --> FF
    PACKAGES --> SRC

    RELEASE --> DEPLOY{🚀 Deploy Where?}
    DEPLOY -->|GitHub| GH[📋 GitHub Releases]
    DEPLOY -->|Chrome Store| CWS[🏪 Chrome Web Store]
    DEPLOY -->|Firefox AMO| AMO[🦊 Mozilla Add-ons]

    style CODE fill:#e8f5e8,stroke:#2e7d32
    style PROD_BUILD fill:#e3f2fd,stroke:#0277bd
    style CHR fill:#4285f4,color:#fff
    style FF fill:#ff6611,color:#fff
    style CWS fill:#4285f4,color:#fff
    style AMO fill:#ff6611,color:#fff
```

## ⚙️ Build Configuration

The build system uses multiple configuration files that work together:

```mermaid
graph TB
    subgraph "📁 Configuration Files"
        PJ[📦 package.json<br/>Dependencies, Scripts, Metadata]
        MJ[📄 manifest.json<br/>Extension Configuration]
        WC[⚙️ webpack.config.js<br/>Build Rules]
        TC[📝 tsconfig.json<br/>TypeScript Settings]
        GI[🚫 .gitignore<br/>Version Control]
    end

    subgraph "🏗️ Build Scripts"
        SM[🔄 sync-metadata.js<br/>Metadata Synchronization]
        BM[🏗️ build.js<br/>Main Build Process]
        PM[📦 Package Scripts<br/>NPM Commands]
    end

    subgraph "🎯 Build Targets"
        DIST[📁 dist/<br/>Compiled Extension]
        REL[📁 releases/<br/>Distribution Packages]
        BACK[📁 build/backup/<br/>Configuration Backups]
    end

    PJ --> SM
    MJ --> SM
    SM --> BM
    WC --> BM
    TC --> BM

    BM --> DIST
    BM --> REL
    SM --> BACK

    PM -.-> SM
    PM -.-> BM

    style SM fill:#e3f2fd,stroke:#0277bd
    style BM fill:#f1f8e9,stroke:#388e3c
    style DIST fill:#fff3e0,stroke:#f57c00
    style REL fill:#c8e6c9,stroke:#388e3c
```

## 🔧 Cross-Platform Compatibility

The build system works across different operating systems:

```mermaid
graph TD
    subgraph "💻 Operating Systems"
        WIN[🪟 Windows<br/>PowerShell Commands]
        MAC[🍎 macOS<br/>Unix Commands]
        LIN[🐧 Linux<br/>Unix Commands]
    end

    subgraph "📦 Packaging Methods"
        PS[⚡ PowerShell<br/>Compress-Archive]
        ZIP[🗜️ Native Zip<br/>zip -r command]
        NODE[📦 Node.js<br/>Cross-platform APIs]
    end

    subgraph "✅ Build Validation"
        PATH[📁 Path Resolution<br/>Cross-platform paths]
        PERM[🔐 Permissions<br/>File access rights]
        ENCODE[📝 Encoding<br/>UTF-8 consistency]
    end

    WIN --> PS
    MAC --> ZIP
    LIN --> ZIP

    PS --> NODE
    ZIP --> NODE

    NODE --> PATH
    NODE --> PERM
    NODE --> ENCODE

    style WIN fill:#4285f4,color:#fff
    style MAC fill:#34a853,color:#fff
    style LIN fill:#ea4335,color:#fff
    style NODE fill:#f1f8e9,stroke:#388e3c
```

## 📊 Build Performance Monitoring

The build system tracks performance metrics:

```mermaid
graph LR
    subgraph "⏱️ Time Tracking"
        START[⏰ Build Start Time]
        STEPS[📊 Step Duration]
        TOTAL[🏁 Total Build Time]
    end

    subgraph "💾 Resource Usage"
        MEM[🧠 Memory Usage<br/>Heap & System]
        CPU[⚙️ CPU Usage<br/>Processing Load]
        DISK[💿 Disk I/O<br/>File Operations]
    end

    subgraph "📈 Output Metrics"
        SIZE[📏 Package Sizes<br/>Chrome, Firefox, Source]
        FILES[📁 File Counts<br/>Generated Assets]
        COMP[🗜️ Compression Ratio<br/>ZIP Efficiency]
    end

    subgraph "📋 Reporting"
        CLI[🖥️ CLI Output<br/>Real-time Progress]
        LOG[📝 Build Logs<br/>Detailed Information]
        STATS[📊 Statistics<br/>Performance Summary]
    end

    START --> STEPS
    STEPS --> TOTAL

    MEM --> CLI
    CPU --> CLI
    DISK --> LOG

    SIZE --> STATS
    FILES --> STATS
    COMP --> STATS

    TOTAL --> CLI
    CLI --> LOG
    LOG --> STATS

    style START fill:#c8e6c9,stroke:#388e3c
    style CLI fill:#e1f5fe,stroke:#0277bd
    style STATS fill:#f3e5f5,stroke:#7b1fa2
```

## 🎨 CLI Banner Design

The build system features a beautiful ASCII banner:

```
╔═══════════════════════════════════════════════════════════════╗
║                     NovelSynth Build System                  ║
║                  Browser Extension Builder                   ║
╠═══════════════════════════════════════════════════════════════╣
║ Project:     NovelSynth                                      ║
║ Version:     1.0.0                                           ║
║ Author:      VKrishna04                                      ║
║ License:     Apache-2.0                                      ║
║ Homepage:    https://life-experimentalist.github.io/...      ║
║ Platform:    win32 x64                                       ║
║ Node.js:     v18.17.0                                        ║
║ Memory:      16GB total, 8GB free                            ║
║ CPU:         Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz       ║
║ Working Dir: v:\Code\ProjectCode\NovelSynth                  ║
║ Target:      Chrome v3 + Firefox v2 Extensions              ║
║ Build Time:  12/20/2024, 2:30:45 PM                         ║
╚═══════════════════════════════════════════════════════════════╝
```

## 🚀 Build Commands Reference

| Command                 | Description                                 | Output                    |
| ----------------------- | ------------------------------------------- | ------------------------- |
| `npm run sync-metadata` | Synchronize manifest.json with package.json | Updated package.json      |
| `npm run build:dev`     | Development build with source maps          | dist/ directory           |
| `npm run build`         | Production build optimized                  | dist/ directory           |
| `npm run build:release` | Create browser packages                     | releases/ directory       |
| `npm run build:full`    | Complete build pipeline                     | All packages + docs       |
| `npm run watch`         | Development with file watching              | Continuous building       |
| `npm run clean`         | Clean build artifacts                       | Empty dist/ and releases/ |

---

The NovelSynth build system is designed for professional development with comprehensive tooling, cross-platform support, and beautiful CLI feedback.