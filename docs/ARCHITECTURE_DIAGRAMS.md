# NovelSynth System Architecture Diagrams

This document contains comprehensive Mermaid diagrams that visualize the NovelSynth extension architecture, data flows, and component interactions.

## 🏗️ System Overview

```mermaid
graph TB
    subgraph "Browser Environment"
        subgraph "Extension Components"
            BG[Background Script<br/>Service Worker]
            CS[Content Scripts<br/>Per Website]
            PP[Popup Interface<br/>React UI]
        end

        subgraph "Browser APIs"
            SA[Storage API]
            TA[Tabs API]
            MA[Messaging API]
        end

        subgraph "Website"
            WP[Web Page DOM]
            WC[Website Content]
        end
    end

    subgraph "External Services"
        AI1[Google Gemini]
        AI2[OpenAI GPT]
        AI3[Anthropic Claude]
        AI4[HuggingFace]
        AI5[OpenRouter]
    end

    PP -.-> BG
    CS -.-> BG
    BG --> SA
    BG --> TA
    BG --> MA
    CS --> WP
    CS --> WC
    BG --> AI1
    BG --> AI2
    BG --> AI3
    BG --> AI4
    BG --> AI5

    style BG fill:#e1f5fe
    style CS fill:#f3e5f5
    style PP fill:#e8f5e8
    style AI1 fill:#fff3e0
    style AI2 fill:#fff3e0
    style AI3 fill:#fff3e0
    style AI4 fill:#fff3e0
    style AI5 fill:#fff3e0
```

## 🔄 Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant P as Popup UI
    participant C as Content Script
    participant B as Background Script
    participant AI as AI Service
    participant S as Storage

    U->>P: Configure Settings
    P->>B: Save API Keys
    B->>S: Store Encrypted Keys

    U->>C: Click Enhancement Button
    C->>B: Send Enhancement Request
    B->>S: Get User Settings
    B->>AI: Process Content
    AI-->>B: Return Enhanced Content
    B->>C: Send Enhanced Result
    C->>U: Display Enhanced Content

    Note over C,B: Rate limiting and<br/>retry logic applied
    Note over B,AI: Content segmentation<br/>for large texts
```

## 🧩 Component Architecture

```mermaid
graph TD
    subgraph "Background Services"
        ASM[AI Service Manager]
        SHM[Site Handler Manager]
        SM[Storage Manager]
        RL[Rate Limiter]
        PM[Prompt Manager]
    end

    subgraph "AI Services"
        GS[Gemini Service]
        OS[OpenAI Service]
        AS[Anthropic Service]
        HS[HuggingFace Service]
        RS[OpenRouter Service]
        BASE[Base AI Service]
    end

    subgraph "Content Processing"
        CD[Content Detector]
        CS[Content Segmenter]
        PB[Prompt Builder]
        WC[Word Counter]
        PBN[Processing Banner]
    end

    subgraph "Site Handlers"
        FFH[FanFiction.Net Handler]
        AOH[Archive of Our Own Handler]
        RRH[Royal Road Handler]
        WNH[WebNovel Handler]
        GGH[GeeksforGeeks Handler]
        MH[Medium Handler]
        GNH[Generic News Handler]
    end

    ASM --> GS
    ASM --> OS
    ASM --> AS
    ASM --> HS
    ASM --> RS
    GS --> BASE
    OS --> BASE
    AS --> BASE
    HS --> BASE
    RS --> BASE

    SHM --> FFH
    SHM --> AOH
    SHM --> RRH
    SHM --> WNH
    SHM --> GGH
    SHM --> MH
    SHM --> GNH

    ASM --> RL
    ASM --> PM
    PM --> PB

    style ASM fill:#e3f2fd
    style BASE fill:#f1f8e9
    style SHM fill:#fce4ec
```

## 🚀 Processing Pipeline

```mermaid
flowchart TD
    START([User Interaction]) --> CD{Content Detected?}
    CD -->|No| END1([Show Error])
    CD -->|Yes| ET[Extract Text]
    ET --> CT[Determine Content Type]
    CT --> SC{Large Content?}
    SC -->|No| PP[Prepare Prompt]
    SC -->|Yes| SEG[Segment Content]
    SEG --> PP
    PP --> RL{Rate Limited?}
    RL -->|Yes| WAIT[Wait & Retry]
    WAIT --> RL
    RL -->|No| AI[Call AI Service]
    AI --> SUCCESS{Success?}
    SUCCESS -->|No| RETRY{Retries Left?}
    RETRY -->|Yes| WAIT
    RETRY -->|No| ERROR[Show Error]
    SUCCESS -->|Yes| ASSEMBLE[Assemble Results]
    ASSEMBLE --> DISPLAY[Display Enhanced Content]
    DISPLAY --> STATS[Show Statistics]
    STATS --> END2([Complete])

    style START fill:#c8e6c9
    style END1 fill:#ffcdd2
    style END2 fill:#c8e6c9
    style ERROR fill:#ffcdd2
    style AI fill:#e1f5fe
    style DISPLAY fill:#f3e5f5
```

## 🔐 Security & Privacy Model

```mermaid
graph TB
    subgraph "User Data Protection"
        UK[User API Keys]
        UP[User Preferences]
        UC[User Content]
    end

    subgraph "Extension Storage"
        BS[Browser Secure Storage]
        LS[Local Settings]
        TS[Temporary Cache]
    end

    subgraph "External Communication"
        AI[AI Providers]
        WS[Websites]
        NS[NovelSynth Servers]
    end

    UK -->|Encrypted| BS
    UP --> LS
    UC -->|Never Stored| TS
    TS -->|Direct Only| AI
    UC -->|No Transmission| NS
    UK -->|Direct Auth| AI

    classDef secure fill:#c8e6c9,stroke:#4caf50
    classDef private fill:#e1f5fe,stroke:#2196f3
    classDef external fill:#fff3e0,stroke:#ff9800
    classDef nosend fill:#ffcdd2,stroke:#f44336

    class UK,BS secure
    class UP,LS,TS private
    class AI,WS external
    class NS nosend
```

## 📱 Browser Extension Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Installing
    Installing --> Configuring: Extension Loaded
    Configuring --> Ready: API Keys Set
    Ready --> Detecting: Page Load
    Detecting --> Processing: Content Found
    Processing --> Enhancing: AI Request
    Enhancing --> Displaying: Content Enhanced
    Displaying --> Ready: Task Complete
    Ready --> Updating: Settings Changed
    Updating --> Ready: Config Saved
    Processing --> Error: API Error
    Error --> Ready: User Retry
    Ready --> [*]: Extension Disabled

    note right of Configuring
        User sets up AI provider
        API keys and preferences
    end note

    note right of Processing
        Rate limiting applied
        Content segmentation
        Prompt generation
    end note
```

## 🌐 Website Handler System

```mermaid
graph LR
    subgraph "Website Detection"
        URL[Page URL] --> RX[Regex Matching]
        DOM[DOM Analysis] --> CS[Content Selectors]
        RX --> SH[Select Handler]
        CS --> SH
    end

    subgraph "Content Extraction"
        SH --> TE[Title Extraction]
        SH --> CE[Content Extraction]
        SH --> ME[Metadata Extraction]
        SH --> UI[UI Injection Points]
    end

    subgraph "Site-Specific Handlers"
        FFN[FanFiction.Net<br/>Story Pages]
        AO3[Archive of Our Own<br/>Work Pages]
        RR[Royal Road<br/>Chapter Pages]
        WN[WebNovel<br/>Chapter Pages]
        GG[GeeksforGeeks<br/>Articles]
        MD[Medium<br/>Articles]
        GN[Generic News<br/>Articles]
    end

    SH --> FFN
    SH --> AO3
    SH --> RR
    SH --> WN
    SH --> GG
    SH --> MD
    SH --> GN

    style FFN fill:#e8f5e8
    style AO3 fill:#e8f5e8
    style RR fill:#e8f5e8
    style WN fill:#e8f5e8
    style GG fill:#f3e5f5
    style MD fill:#f3e5f5
    style GN fill:#f3e5f5
```

## 🤖 AI Service Integration

```mermaid
graph TD
    subgraph "AI Service Manager"
        PSM[Provider Selection<br/>Manager]
        MSM[Model Selection<br/>Manager]
        RLM[Rate Limiting<br/>Manager]
        FOM[Failover<br/>Manager]
    end

    subgraph "Service Implementations"
        subgraph "Google Gemini"
            GM[Gemini Models]
            GA[Gemini API]
        end

        subgraph "OpenAI"
            OM[GPT Models]
            OA[OpenAI API]
        end

        subgraph "Anthropic"
            AM[Claude Models]
            AA[Anthropic API]
        end

        subgraph "HuggingFace"
            HM[HF Models]
            HA[HuggingFace API]
        end

        subgraph "OpenRouter"
            RM[Multi Models]
            RA[OpenRouter API]
        end
    end

    PSM --> GM
    PSM --> OM
    PSM --> AM
    PSM --> HM
    PSM --> RM

    MSM --> GA
    MSM --> OA
    MSM --> AA
    MSM --> HA
    MSM --> RA

    RLM -.-> GA
    RLM -.-> OA
    RLM -.-> AA
    RLM -.-> HA
    RLM -.-> RA

    FOM -.-> PSM

    style GM fill:#4285f4,color:#fff
    style OM fill:#00a67e,color:#fff
    style AM fill:#cc785c,color:#fff
    style HM fill:#ff6f00,color:#fff
    style RM fill:#7c4dff,color:#fff
```

## 📊 Performance & Monitoring

```mermaid
graph TB
    subgraph "Performance Metrics"
        PT[Processing Time]
        RT[Response Time]
        MU[Memory Usage]
        RR[Request Rate]
    end

    subgraph "Quality Metrics"
        ES[Enhancement Success Rate]
        QS[Quality Score]
        US[User Satisfaction]
        ER[Error Rate]
    end

    subgraph "Monitoring Components"
        PM[Performance Monitor]
        QM[Quality Monitor]
        EM[Error Monitor]
        UM[Usage Monitor]
    end

    subgraph "Analytics Storage"
        LS[Local Statistics]
        CS[Cache Statistics]
        AS[Anonymous Analytics]
    end

    PT --> PM
    RT --> PM
    MU --> PM
    RR --> PM

    ES --> QM
    QS --> QM
    US --> QM
    ER --> EM

    PM --> LS
    QM --> LS
    EM --> LS
    UM --> CS

    LS --> AS

    style PM fill:#e3f2fd
    style QM fill:#f3e5f5
    style EM fill:#ffebee
    style UM fill:#e8f5e8
```

## 🔧 Build & Development Pipeline

```mermaid
graph LR
    subgraph "Development"
        SC[Source Code]
        TS[TypeScript]
        RX[React/JSX]
        CSS[Stylesheets]
    end

    subgraph "Build Process"
        WP[Webpack]
        BP[Babel Processing]
        TC[Type Checking]
        OPT[Optimization]
    end

    subgraph "Packaging"
        CM[Chrome Manifest v3]
        FM[Firefox Manifest v2]
        CZ[Chrome ZIP]
        FZ[Firefox ZIP]
        SZ[Source ZIP]
    end

    subgraph "Distribution"
        CWS[Chrome Web Store]
        AMO[Firefox Add-ons]
        GH[GitHub Releases]
    end

    SC --> WP
    TS --> TC
    RX --> BP
    CSS --> WP

    WP --> OPT
    TC --> OPT
    BP --> OPT

    OPT --> CM
    OPT --> FM
    CM --> CZ
    FM --> FZ
    OPT --> SZ

    CZ --> CWS
    FZ --> AMO
    SZ --> GH

    style WP fill:#8dd3c7
    style CM fill:#4285f4,color:#fff
    style FM fill:#ff6611,color:#fff
    style CWS fill:#4285f4,color:#fff
    style AMO fill:#ff6611,color:#fff
```

---

These diagrams provide a comprehensive visual representation of the NovelSynth extension architecture, making it easier for developers to understand the system structure and for users to understand the data flow and security model.