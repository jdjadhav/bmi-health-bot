document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme from LocalStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    }

    // 2. Setup Toggle Listener
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        // Create overlay if not exists
        if (!document.querySelector('.theme-transition-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
        }

        themeBtn.addEventListener('click', () => {
            // Trigger Animation
            const overlay = document.querySelector('.theme-transition-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                void overlay.offsetWidth; // Trigger reflow
                overlay.classList.add('active');

                // Remove class after animation
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 600);
            }

            // Button Icon Animation
            themeBtn.classList.add('rotate-icon');
            setTimeout(() => {
                themeBtn.classList.remove('rotate-icon');
            }, 600);

            // Toggle Logic with slight delay to sync with wipe
            setTimeout(() => {
                let theme = document.body.getAttribute('data-theme');
                if (theme === 'dark') {
                    document.body.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                    updateThemeIcon('light');
                    document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: 'light' } }));
                } else {
                    document.body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    updateThemeIcon('dark');
                    document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: 'dark' } }));
                }
            }, 300); // 300ms delay: change theme when wipe is in middle
        });
    }
});

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerText = theme === 'dark' ? '☀' : '🌙';
    }
}
