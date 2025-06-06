// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    themeToggle.checked = true;
  }

  // Theme toggle handler
  themeToggle.addEventListener("change", function () {
    const theme = this.checked ? "dark" : "light";
    body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    setTimeout(() => {
      body.style.transition = "";
    }, 300);
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add scroll effect to navbar
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScrollTop = scrollTop;
  });

  // Add animation to feature cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);
  document.querySelectorAll(".feature-card, .step, .scenario").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add particle effect to hero section
  createParticleEffect();

  // Chapter content switching logic
  const chapters = {
    46: {
      title: "Chapter 46: The Calm Before",
      content: `The village was quiet, the air thick with anticipation. Elena walked the empty streets, her mind racing with thoughts of the coming storm. The elders whispered of omens, and the children clung to their mothers.`,
      end: `Tonight, peace felt like a fragile illusion, ready to shatter at any moment.`,
      ai: {
        themes: "Tension, anticipation, foreshadowing",
        arc: "Elena's growing anxiety and sense of responsibility",
        suggestion: "Notice the subtle hints about the dragon's awakening.",
      },
    },
    47: {
      title: "Chapter 47: The Dragon's Awakening",
      content: `The ancient dragon stirred from its centuries-long slumber, scales shimmering like molten gold in the moonlight. Elena felt the ground tremble beneath her feet as the massive creature opened eyes that held the wisdom of ages...`,
      end: `The prophecy was finally coming to pass, and she was at the center of it all.`,
      ai: {
        themes: "Awakening, destiny, ancient power",
        arc: "Elena's pivotal moment of realization",
        suggestion:
          "This scene marks the transition to Act III - expect major plot developments",
      },
    },
    48: {
      title: "Chapter 48: The Aftermath",
      content: `Ash and embers drifted through the dawn sky. The dragon was gone, but its presence lingered. Elena surveyed the ruins, her heart heavy with loss and hope.`,
      end: `A new journey was beginning, forged from the ashes of the old.`,
      ai: {
        themes: "Loss, renewal, hope",
        arc: "Elena's resolve to rebuild and move forward",
        suggestion: "Watch for new alliances and the seeds of future conflict.",
      },
    },
  };

  const chapterSelect = document.getElementById("chapter-select");
  const chapterTitle = document.querySelector(".chapter-content h3");
  const chapterText = document.querySelector(
    ".chapter-content p:not(.chapter-end)"
  );
  const chapterEnd = document.querySelector(".chapter-end");
  const aiInsight = document.querySelector(".ai-insight-content");

  if (chapterSelect) {
    chapterSelect.addEventListener("change", function () {
      let val = chapterSelect.value;
      // fallback for browsers that don't support value on <option>
      if (!val || val.indexOf("46") !== -1) val = "46";
      else if (val.indexOf("47") !== -1) val = "47";
      else if (val.indexOf("48") !== -1) val = "48";
      const data = chapters[val];
      if (data) {
        chapterTitle.textContent = data.title;
        chapterText.textContent = data.content;
        chapterEnd.textContent = data.end;
        aiInsight.innerHTML = `<strong>Key Themes:</strong> ${data.ai.themes}<br><strong>Character Arc:</strong> ${data.ai.arc}<br><strong>Suggestion:</strong> ${data.ai.suggestion}`;
      }
    });
  }

  // --- Chapter Action Buttons Logic ---
  const allActions = [
    {
      value: "enhance",
      label: "Enhance",
      icon: "fa-magic",
      btnClass: "btn-primary",
    },
    {
      value: "summarize",
      label: "Summarize",
      icon: "fa-align-left",
      btnClass: "btn-secondary",
    },
    {
      value: "analyze",
      label: "Analyze",
      icon: "fa-chart-bar",
      btnClass: "btn-secondary",
    },
    {
      value: "translate",
      label: "Translate",
      icon: "fa-language",
      btnClass: "btn-secondary",
    },
    // Add more actions here as needed
  ];
  let lastTwo = ["enhance", "summarize"];

  const actionsDropdown = document.getElementById("chapter-action-dropdown");
  const actionsBar = document.querySelector(".chapter-actions");

  function renderActionButtons() {
    actionsBar.innerHTML = "";
    lastTwo.forEach((actionValue) => {
      const action = allActions.find((a) => a.value === actionValue);
      if (action) {
        const btn = document.createElement("button");
        btn.className = `btn ${action.btnClass} chapter-action-btn`;
        btn.setAttribute("data-action", action.value);
        btn.innerHTML = `<i class='fas ${action.icon}'></i> ${action.label}`;
        actionsBar.appendChild(btn);
      }
    });
  }

  // Initial render
  if (actionsBar) renderActionButtons();

  // Handle dropdown change
  if (actionsDropdown) {
    actionsDropdown.addEventListener("change", function () {
      const val = actionsDropdown.value;
      if (!lastTwo.includes(val)) {
        lastTwo = [val, lastTwo[0]];
        renderActionButtons();
      }
      triggerChapterAction(val);
    });
  }

  // Handle button clicks
  if (actionsBar) {
    actionsBar.addEventListener("click", function (e) {
      const btn = e.target.closest(".chapter-action-btn");
      if (btn) {
        const val = btn.getAttribute("data-action");
        if (!lastTwo.includes(val)) {
          lastTwo = [val, lastTwo[0]];
          renderActionButtons();
        } else if (lastTwo[0] !== val) {
          lastTwo = [val, lastTwo[0]];
          renderActionButtons();
        }
        triggerChapterAction(val);
      }
    });
  }

  // Dummy handler for actions
  function triggerChapterAction(action) {
    // You can replace this with actual logic for each action
    alert(`Action: ${action.charAt(0).toUpperCase() + action.slice(1)}`);
  }
});

// Particle effect for hero section
function createParticleEffect() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = "0.3";
  hero.appendChild(canvas);
  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const particles = [];
  const particleCount = 50;
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
