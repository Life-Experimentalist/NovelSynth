// https://marketplace.visualstudio.com/items/VKrishna04.global-save-state/changelog

// Platform detection and keyboard shortcuts
function detectPlatformAndSetShortcuts() {
    // Detect if user is on macOS
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
                  navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

    // Define shortcuts for different platforms
    const shortcuts = {
        save: isMac ? 'Cmd+Shift+S' : 'Ctrl+Shift+S',
        restore: isMac ? 'Cmd+Alt+R' : 'Ctrl+Alt+R'
    };

    const platformName = isMac ? 'macOS' : 'Windows/Linux';

    // Update all shortcut elements
    document.querySelectorAll('.shortcut[data-shortcut]').forEach(element => {
        const shortcutType = element.getAttribute('data-shortcut');
        if (shortcuts[shortcutType]) {
            // Add animation class for smooth transition
            element.classList.add('updating');

            // Add platform note for tooltip
            element.setAttribute('data-platform-note', `${platformName} shortcut`);

            // Update the text content
            setTimeout(() => {
                element.textContent = shortcuts[shortcutType];
                element.classList.remove('updating');
            }, 150);
        }
    });

    // Add platform class to body for potential CSS targeting
    document.body.classList.add(isMac ? 'platform-mac' : 'platform-windows');

    // Log detected platform for debugging
    console.log(`Platform detected: ${platformName}`);
    console.log('Keyboard shortcuts updated:', shortcuts);

    // Add a subtle platform indicator to the page (optional)
    addPlatformIndicator(platformName, isMac);
}

// Add a small platform indicator (optional enhancement)
function addPlatformIndicator(platformName, isMac) {
    // Create a small indicator that shows for a few seconds
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    indicator.innerHTML = `${isMac ? '🍎' : '🪟'} ${platformName} shortcuts loaded`;

    document.body.appendChild(indicator);

    // Animate in
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 300);
    }, 3000);
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Detect platform and set appropriate keyboard shortcuts
    detectPlatformAndSetShortcuts();

    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    // Update toggle state based on saved theme
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
    }

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });
});
