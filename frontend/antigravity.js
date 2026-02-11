document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.anti-gravity');
    const CONFIG = {
        radius: 300,        // Interaction radius
        strength: 50,       // Repulsion strength (pixels)
        scale: 1.05,        // Scale on hover
        ease: 0.1           // Smoothing factor (0.1 = slow, 1 = instant)
    };

    let mouse = { x: -1000, y: -1000 };

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    elements.forEach(el => {
        let current = { x: 0, y: 0 };
        let target = { x: 0, y: 0 };

        function animate() {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = mouse.x - centerX;
            const dy = mouse.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.radius) {
                // Calculate repulsion
                const force = (CONFIG.radius - distance) / CONFIG.radius;
                const angle = Math.atan2(dy, dx);

                // Move AWAY from mouse
                const moveX = -Math.cos(angle) * force * CONFIG.strength;
                const moveY = -Math.sin(angle) * force * CONFIG.strength;

                target.x = moveX;
                target.y = moveY;

                // Add returning class for smooth exit, remove it for instant interaction
                el.style.transition = 'transform 0.1s ease-out';
                el.style.transform = `translate(${current.x}px, ${current.y}px) scale(${CONFIG.scale})`;
            } else {
                target.x = 0;
                target.y = 0;
                el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'; // Smooth return
                el.style.transform = `translate(${target.x}px, ${target.y}px) scale(1)`;
            }

            // Smooth interpolation (Lerp)
            current.x += (target.x - current.x) * CONFIG.ease;
            current.y += (target.y - current.y) * CONFIG.ease;

            // Apply transform if logic suggests significant movement, otherwise handled by CSS transition
            if (distance < CONFIG.radius) {
                el.style.transform = `translate(${current.x}px, ${current.y}px) scale(${1 + (CONFIG.scale - 1) * (force || 0)})`;
            }

            requestAnimationFrame(animate);
        }

        // Start animation loop for each element
        animate();
    });
});
