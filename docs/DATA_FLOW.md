# NovelSynth Data Flow Documentation

This document provides comprehensive diagrams showing how data flows through the NovelSynth extension system.

## 🔄 Complete Data Flow Overview

```mermaid
graph TB
    subgraph "👤 User Interaction Layer"
        USER[👤 User]
        BROWSER[🌐 Web Browser]
        WEBSITE[📄 Website Content]
    end

    subgraph "🔧 Extension Components"
        POPUP[⚙️ Popup Interface]
        CONTENT[📄 Content Script]
        BACKGROUND[🎯 Background Service]
    end

    subgraph "💾 Data Storage"
        SETTINGS[⚙️ User Settings]
        APIKEYS[🔑 API Keys]
        CACHE[⚡ Temporary Cache]
    end

    subgraph "🤖 AI Processing"
        AIMANAGER[🎯 AI Service Manager]
        GEMINI[🟦 Gemini API]
        OPENAI[🟢 OpenAI API]
        CLAUDE[🟤 Claude API]
        HUGGINGFACE[🟡 HuggingFace API]
        OPENROUTER[🟣 OpenRouter API]
    end

    subgraph "📊 Processing Pipeline"
        DETECTOR[🔍 Content Detector]
        SEGMENTER[✂️ Content Segmenter]
        PROMPTER[📝 Prompt Builder]
        ENHANCER[✨ Content Enhancer]
        ASSEMBLER[🔧 Result Assembler]
    end

    USER --> BROWSER
    BROWSER --> WEBSITE
    WEBSITE --> CONTENT
    USER --> POPUP

    POPUP <--> BACKGROUND
    CONTENT <--> BACKGROUND

    BACKGROUND <--> SETTINGS
    BACKGROUND <--> APIKEYS
    BACKGROUND <--> CACHE

    BACKGROUND --> AIMANAGER
    AIMANAGER --> GEMINI
    AIMANAGER --> OPENAI
    AIMANAGER --> CLAUDE
    AIMANAGER --> HUGGINGFACE
    AIMANAGER --> OPENROUTER

    CONTENT --> DETECTOR
    DETECTOR --> SEGMENTER
    SEGMENTER --> PROMPTER
    PROMPTER --> ENHANCER
    ENHANCER --> ASSEMBLER
    ASSEMBLER --> CONTENT

    ENHANCER <--> AIMANAGER

    style USER fill:#c8e6c9,stroke:#388e3c
    style BACKGROUND fill:#e1f5fe,stroke:#0277bd
    style AIMANAGER fill:#f3e5f5,stroke:#7b1fa2
    style ENHANCER fill:#fff3e0,stroke:#f57c00
```

## 📱 User Interaction Flow

```mermaid
sequenceDiagram
    participant 👤 as User
    participant 🖥️ as Browser Tab
    participant ⚙️ as Popup UI
    participant 📄 as Content Script
    participant 🎯 as Background
    participant 💾 as Storage
    participant 🤖 as AI Service

    Note over 👤,🤖: Initial Setup Phase
    👤->>⚙️: Open Extension Popup
    ⚙️->>🎯: Request Current Settings
    🎯->>💾: Load User Preferences
    💾-->>🎯: Return Settings Data
    🎯-->>⚙️: Send Settings to UI
    ⚙️-->>👤: Display Configuration

    👤->>⚙️: Configure API Keys
    ⚙️->>🎯: Save API Configuration
    🎯->>💾: Store Encrypted Keys
    💾-->>🎯: Confirm Storage
    🎯-->>⚙️: Confirm Save Success
    ⚙️-->>👤: Show Success Message

    Note over 👤,🤖: Content Enhancement Phase
    👤->>🖥️: Navigate to Website
    🖥️->>📄: Load Content Script
    📄->>📄: Analyze Page Content
    📄->>📄: Inject Enhancement UI

    👤->>📄: Click Enhancement Button
    📄->>🎯: Send Enhancement Request
    🎯->>💾: Retrieve API Keys & Settings
    💾-->>🎯: Return Configuration

    🎯->>🎯: Validate Rate Limits
    🎯->>🎯: Prepare Content for AI
    🎯->>🤖: Request Content Enhancement
    🤖-->>🎯: Return Enhanced Content

    🎯->>📄: Send Enhanced Result
    📄->>📄: Process & Display Result
    📄-->>👤: Show Enhanced Content

    Note over 👤,🤖: Error Handling
    alt API Error
        🤖-->>🎯: Return Error Response
        🎯->>🎯: Apply Retry Logic
        🎯->>📄: Send Error Message
        📄-->>👤: Display User-Friendly Error
    end
```

## 🔍 Content Detection & Processing Flow

```mermaid
flowchart TD
    START([📄 Page Load]) --> INJECT[💉 Inject Content Script]
    INJECT --> ANALYZE[🔍 Analyze Page Structure]
    ANALYZE --> DETECT{🎯 Content Type?}

    DETECT -->|📚 Fiction| FICTION[📖 Fiction Content Handler]
    DETECT -->|💻 Technical| TECH[⚙️ Technical Content Handler]
    DETECT -->|📰 News| NEWS[📰 News Content Handler]
    DETECT -->|❓ Unknown| GENERIC[🔧 Generic Content Handler]

    FICTION --> EXTRACT_F[📝 Extract Story Content]
    TECH --> EXTRACT_T[📝 Extract Article Content]
    NEWS --> EXTRACT_N[📝 Extract News Content]
    GENERIC --> EXTRACT_G[📝 Extract Text Content]

    EXTRACT_F --> VALIDATE
    EXTRACT_T --> VALIDATE
    EXTRACT_N --> VALIDATE
    EXTRACT_G --> VALIDATE

    VALIDATE{✅ Valid Content?} -->|❌ No| ERROR[⚠️ Show Error Message]
    VALIDATE -->|✅ Yes| UI_INJECT[🎨 Inject Enhancement UI]

    UI_INJECT --> WAIT[⏳ Wait for User Action]
    WAIT --> USER_CLICK{👆 User Clicks Enhance?}
    USER_CLICK -->|❌ No| WAIT
    USER_CLICK -->|✅ Yes| PROCESS[🚀 Start Processing Pipeline]

    ERROR --> END([🏁 End])
    PROCESS --> PIPELINE[📊 Enter Processing Pipeline]
    PIPELINE --> END

    style START fill:#c8e6c9,stroke:#388e3c
    style ERROR fill:#ffcdd2,stroke:#d32f2f
    style PROCESS fill:#e1f5fe,stroke:#0277bd
    style FICTION fill:#e8f5e8,stroke:#2e7d32
    style TECH fill:#f3e5f5,stroke:#7b1fa2
    style NEWS fill:#fff3e0,stroke:#f57c00
```

## 🤖 AI Service Processing Flow

```mermaid
graph TD
    subgraph "📝 Content Preparation"
        INPUT[📄 Raw Content Input]
        CLEAN[🧹 Clean & Sanitize]
        SEGMENT{📏 Content Length?}
        CHUNK[✂️ Split into Chunks]
        SINGLE[📄 Single Chunk]
    end

    subgraph "🎯 AI Service Selection"
        SELECT[🎯 Select AI Provider]
        GEMINI_CHECK{🟦 Gemini Available?}
        OPENAI_CHECK{🟢 OpenAI Available?}
        CLAUDE_CHECK{🟤 Claude Available?}
        FALLBACK[🔄 Use Fallback Provider]
    end

    subgraph "📝 Prompt Engineering"
        TEMPLATE[📋 Load Prompt Template]
        CONTEXT[🔧 Add Context Information]
        CUSTOM[⚙️ Apply Custom Prompts]
        FINALIZE[✅ Finalize Prompt]
    end

    subgraph "🚀 API Communication"
        RATE_CHECK{⏱️ Rate Limit OK?}
        WAIT[⏳ Wait for Rate Limit]
        API_CALL[📡 Make API Request]
        RESPONSE{📥 Valid Response?}
        RETRY[🔄 Retry Request]
        SUCCESS[✅ Process Response]
    end

    INPUT --> CLEAN
    CLEAN --> SEGMENT
    SEGMENT -->|Large| CHUNK
    SEGMENT -->|Small| SINGLE
    CHUNK --> SELECT
    SINGLE --> SELECT

    SELECT --> GEMINI_CHECK
    GEMINI_CHECK -->|✅ Yes| TEMPLATE
    GEMINI_CHECK -->|❌ No| OPENAI_CHECK
    OPENAI_CHECK -->|✅ Yes| TEMPLATE
    OPENAI_CHECK -->|❌ No| CLAUDE_CHECK
    CLAUDE_CHECK -->|✅ Yes| TEMPLATE
    CLAUDE_CHECK -->|❌ No| FALLBACK
    FALLBACK --> TEMPLATE

    TEMPLATE --> CONTEXT
    CONTEXT --> CUSTOM
    CUSTOM --> FINALIZE

    FINALIZE --> RATE_CHECK
    RATE_CHECK -->|❌ No| WAIT
    WAIT --> RATE_CHECK
    RATE_CHECK -->|✅ Yes| API_CALL

    API_CALL --> RESPONSE
    RESPONSE -->|❌ No| RETRY
    RETRY --> API_CALL
    RESPONSE -->|✅ Yes| SUCCESS

    style INPUT fill:#e8f5e8,stroke:#2e7d32
    style SUCCESS fill:#c8e6c9,stroke:#388e3c
    style WAIT fill:#fff3e0,stroke:#f57c00
    style RETRY fill:#ffecb3,stroke:#ff8f00
    style FALLBACK fill:#f3e5f5,stroke:#7b1fa2
```

## 💾 Data Storage & Security Flow

```mermaid
graph TB
    subgraph "👤 User Data Input"
        API_INPUT[🔑 API Key Input]
        SETTINGS_INPUT[⚙️ Settings Input]
        CONTENT_INPUT[📝 Content Input]
    end

    subgraph "🔒 Security Processing"
        ENCRYPT[🔐 Encrypt Sensitive Data]
        VALIDATE[✅ Validate Input]
        SANITIZE[🧹 Sanitize Content]
    end

    subgraph "💾 Storage Layers"
        SECURE_STORAGE[🔒 Secure Browser Storage<br/>API Keys]
        LOCAL_STORAGE[💾 Local Storage<br/>Settings & Preferences]
        TEMP_MEMORY[⚡ Temporary Memory<br/>Processing Data]
        NO_STORAGE[🚫 Never Stored<br/>User Content]
    end

    subgraph "🌐 External Communication"
        AI_DIRECT[🤖 Direct AI API Calls<br/>Encrypted HTTPS]
        WEBSITE_ACCESS[🌍 Website Content Access<br/>Read-only DOM]
        NO_SERVERS[🚫 No NovelSynth Servers<br/>No Data Collection]
    end

    API_INPUT --> ENCRYPT
    SETTINGS_INPUT --> VALIDATE
    CONTENT_INPUT --> SANITIZE

    ENCRYPT --> SECURE_STORAGE
    VALIDATE --> LOCAL_STORAGE
    SANITIZE --> TEMP_MEMORY
    CONTENT_INPUT --> NO_STORAGE

    SECURE_STORAGE --> AI_DIRECT
    TEMP_MEMORY --> AI_DIRECT
    TEMP_MEMORY --> WEBSITE_ACCESS

    classDef secure fill:#c8e6c9,stroke:#4caf50,stroke-width:3px
    classDef private fill:#e1f5fe,stroke:#2196f3,stroke-width:2px
    classDef temp fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef nosend fill:#ffcdd2,stroke:#f44336,stroke-width:3px

    class API_INPUT,ENCRYPT,SECURE_STORAGE,AI_DIRECT secure
    class SETTINGS_INPUT,VALIDATE,LOCAL_STORAGE private
    class CONTENT_INPUT,SANITIZE,TEMP_MEMORY,WEBSITE_ACCESS temp
    class NO_STORAGE,NO_SERVERS nosend
```

## 🔄 Error Handling & Recovery Flow

```mermaid
stateDiagram-v2
    [*] --> Processing
    Processing --> Success: API Call Successful
    Processing --> APIError: API Call Failed
    Processing --> NetworkError: Network Issue
    Processing --> RateLimit: Rate Limited
    Processing --> InvalidKey: Invalid API Key

    Success --> [*]: Display Results

    APIError --> RetryLogic: Check Retry Count
    NetworkError --> RetryLogic
    RateLimit --> WaitAndRetry: Apply Backoff
    InvalidKey --> ShowKeyError: Prompt User

    RetryLogic --> Processing: Retry < Max
    RetryLogic --> Fallback: Retry >= Max

    WaitAndRetry --> Processing: After Wait Period

    Fallback --> TryNextProvider: Other Providers Available
    Fallback --> ShowError: No Providers Available

    TryNextProvider --> Processing: Switch Provider

    ShowKeyError --> [*]: User Fixes Key
    ShowError --> [*]: Display Error Message

    note right of RetryLogic
        Exponential backoff
        Max 3 retries per provider
    end note

    note right of WaitAndRetry
        Respect rate limits
        Progressive delay
    end note
```

## 📊 Performance Monitoring Flow

```mermaid
graph LR
    subgraph "📈 Metrics Collection"
        TIMING[⏱️ Timing Metrics<br/>Start/End Times]
        MEMORY[🧠 Memory Usage<br/>Heap & System]
        API_PERF[📡 API Performance<br/>Response Times]
        ERROR_RATE[❌ Error Rates<br/>Failure Tracking]
    end

    subgraph "📊 Data Processing"
        AGGREGATE[📊 Aggregate Statistics]
        ANALYZE[🔍 Performance Analysis]
        TRENDS[📈 Trend Detection]
        ALERTS[⚠️ Performance Alerts]
    end

    subgraph "📋 Reporting"
        DASHBOARD[📊 Performance Dashboard]
        LOGS[📝 Detailed Logs]
        METRICS[📈 Metrics Export]
        USER_FEEDBACK[👤 User Notifications]
    end

    TIMING --> AGGREGATE
    MEMORY --> AGGREGATE
    API_PERF --> AGGREGATE
    ERROR_RATE --> AGGREGATE

    AGGREGATE --> ANALYZE
    ANALYZE --> TRENDS
    TRENDS --> ALERTS

    ANALYZE --> DASHBOARD
    AGGREGATE --> LOGS
    TRENDS --> METRICS
    ALERTS --> USER_FEEDBACK

    style TIMING fill:#e1f5fe,stroke:#0277bd
    style AGGREGATE fill:#f1f8e9,stroke:#388e3c
    style DASHBOARD fill:#f3e5f5,stroke:#7b1fa2
    style ALERTS fill:#ffecb3,stroke:#ff8f00
```

---

These data flow diagrams provide a comprehensive view of how information moves through the NovelSynth extension, from user interaction to AI processing and result delivery. Each diagram focuses on different aspects of the system to help developers and users understand the complete data journey.