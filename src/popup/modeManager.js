// Mode Selection and Detection Logic
export class ModeManager {
  constructor() {
    this.modes = ["novels", "news", "learning", "general"];
    this.currentMode = "novels";
    this.isAutoDetected = false;
    this.detectWebsite = this.detectWebsite.bind(this);
    this.setContentMode = this.setContentMode.bind(this);
  }

  // Detect website based on domain
  detectWebsite(url) {
    const websiteCategories = {
      novels: [
        "fanfiction.net",
        "royalroad.com",
        "webnovel.com",
        "ranobes.net",
        "wuxiaworld.com",
        "scribblehub.com",
        "novelupdates.com",
      ],
      news: [
        "theguardian.com",
        "bbc.com",
        "cnn.com",
        "nytimes.com",
        "reuters.com",
        "apnews.com",
        "bloomberg.com",
      ],
      learning: [
        "coursera.org",
        "udemy.com",
        "khanacademy.org",
        "edx.org",
        "medium.com",
        "wikipedia.org",
        "stackexchange.com",
      ],
    };

    if (!url)
      return { mode: "general", website: "Unknown", isAutoDetected: false };

    try {
      const hostname = new URL(url).hostname.replace("www.", "");

      for (const [category, domains] of Object.entries(websiteCategories)) {
        if (domains.some((domain) => hostname.includes(domain))) {
          const website = domains.find((domain) => hostname.includes(domain));
          return {
            mode: category,
            website: website,
            isAutoDetected: true,
          };
        }
      }

      return { mode: "general", website: hostname, isAutoDetected: false };
    } catch (error) {
      console.error("Error parsing URL:", error);
      return { mode: "general", website: "Unknown", isAutoDetected: false };
    }
  }

  // Set content mode in UI
  setContentMode(mode, isAutoDetected = false) {
    this.currentMode = mode;
    this.isAutoDetected = isAutoDetected;

    // Select the corresponding mode card
    const modeCards = document.querySelectorAll(".mode-card");
    const modeNote = document.getElementById("modeNote");

    if (modeNote) {
      modeNote.style.display = isAutoDetected ? "inline" : "none";
    }

    modeCards.forEach((card) => {
      const cardMode = card.getAttribute("data-mode");

      if (cardMode === mode) {
        card.classList.add("active");

        // Add locked class if auto-detected
        if (isAutoDetected) {
          card.classList.add("locked");

          // Add a lock icon if not already present
          if (!card.querySelector(".mode-lock")) {
            const lockIcon = document.createElement("div");
            lockIcon.className = "mode-lock";
            lockIcon.innerHTML = "🔒";
            lockIcon.title = "Auto-detected mode";
            card.appendChild(lockIcon);
          }
        } else {
          card.classList.remove("locked");
          const lockIcon = card.querySelector(".mode-lock");
          if (lockIcon) lockIcon.remove();
        }
      } else {
        card.classList.remove("active");

        // Disable other mode cards if auto-detected
        if (isAutoDetected) {
          card.classList.add("disabled");
        } else {
          card.classList.remove("disabled");
        }
      }
    });

    // Update related UI elements based on mode
    this.updateModeRelatedUI(mode);
  }

  // Update UI elements related to the selected mode
  updateModeRelatedUI(mode) {
    // Update prompt sections
    const promptSections = document.querySelectorAll(".prompt-section");
    promptSections.forEach((section) => {
      const sectionMode = section.getAttribute("data-mode");
      if (sectionMode === mode) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Update mode buttons in prompt selector
    const modeButtons = document.querySelectorAll(".mode-btn");
    modeButtons.forEach((button) => {
      const buttonMode = button.getAttribute("data-prompt-mode");
      if (buttonMode === mode) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Enable mode selection for user
  enableModeSelection() {
    this.isAutoDetected = false;
    const modeCards = document.querySelectorAll(".mode-card");

    modeCards.forEach((card) => {
      card.classList.remove("disabled", "locked");
      const lockIcon = card.querySelector(".mode-lock");
      if (lockIcon) lockIcon.remove();
    });

    const modeNote = document.getElementById("modeNote");
    if (modeNote) {
      modeNote.style.display = "none";
    }
  }
}
