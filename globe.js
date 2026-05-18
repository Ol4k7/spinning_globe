document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('dom-globe-container');
    const visualArea = document.querySelector('.hero-visual');
    if (!container || !visualArea) return;

    const techStack = [
        // Pattern: 1 Tech (White) -> 1 Social (Color)
        // You can change inactive icons to any colour of your preference
        // I had to use inline svg for linkedIn bacause simpleicon is not rendering it well on my computer 
        { name: "PHP", src: "https://cdn.simpleicons.org/php/white" },
        { name: "GitHub", src: "https://cdn.simpleicons.org/github/181717", url: "https://github.com/" },

        { name: "React", src: "https://cdn.simpleicons.org/react/white" },
        { 
            name: "LinkedIn", 
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230A66C2'%3E%3Cpath d='M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z'/%3E%3C/svg%3E",
            url: "https://www.linkedin.com/" 
        },

        { name: "Node.js", src: "https://cdn.simpleicons.org/nodedotjs/white" },
        { name: "TikTok", src: "https://cdn.simpleicons.org/tiktok/000000", url: "https://www.tiktok.com/" },

        { name: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql/white" },
        { name: "WhatsApp", src: "https://cdn.simpleicons.org/whatsapp/25D366", url: "https://wa.me/" },

        { name: "Docker", src: "https://cdn.simpleicons.org/docker/white" },
        { name: "Facebook", src: "https://cdn.simpleicons.org/facebook/1877F2", url: "https://www.facebook.com/" },

        { name: "JavaScript", src: "https://cdn.simpleicons.org/javascript/white" },
        { name: "Snapchat", src: "https://cdn.simpleicons.org/snapchat/FFFC00", url: "https://snapchat.com/" },

        { name: "Python", src: "https://cdn.simpleicons.org/python/white" },
        { name: "X", src: "https://cdn.simpleicons.org/x/000000", url: "https://x.com/" },

        { name: "Figma", src: "https://cdn.simpleicons.org/figma/white" },
        { name: "Instagram", src: "https://cdn.simpleicons.org/instagram/E4405F", url: "https://www.instagram.com/" },

        { name: "Tailwind", src: "https://cdn.simpleicons.org/tailwindcss/white" },
        { name: "Threads", src: "https://cdn.simpleicons.org/threads/000000", url: "https://www.threads.com/" },

        { name: "Cloud", src: "https://cdn.simpleicons.org/googlecloud/white" },
        { name: "Telegram", src: "https://cdn.simpleicons.org/telegram/24A1DE", url: "https://t.me/" }
    ];

    const denseStack = [...techStack, ...techStack]; 
    const icons = [];
    
    let radiusX, radiusY, radiusZ;
    let rotationY = 0, rotationX = 0;
    let velocityY = 0.02, velocityX = 0;
    let isDragging = false, lastMouseX, lastMouseY;

    function calculateRadii() {
        const width = window.innerWidth;
        const isMobile = width <= 768;
        const mobileRadius = Math.max(width * 0.35, 140); 
        
        radiusX = isMobile ? mobileRadius : 160;
        radiusY = isMobile ? 180 : 220; 
        radiusZ = isMobile ? mobileRadius : 160;
    }

    calculateRadii();

    denseStack.forEach((tech, index) => {
        const phi = Math.acos(1 - 2 * (index + 0.5) / denseStack.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

        const img = document.createElement('img');
        img.crossOrigin = "anonymous";
        img.src = tech.src;
        img.alt = tech.name;
        img.className = tech.url ? 'floating-icon live-link' : 'floating-icon';
        img.ondragstart = () => false;
        img.oncontextmenu = () => false;

        // --- ENHANCED TOUCH LOGIC ---
        if (tech.url) {
            let startX, startY;

            img.addEventListener('touchstart', (e) => {
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
            }, { passive: true });

            img.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].pageX;
                const endY = e.changedTouches[0].pageY;
                
                // Calculate if user actually 'clicked' or was 'dragging'
                const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                
                // If moved less than 10px and is in front, it's a valid tap
                if (distance < 10 && img.classList.contains('is-front')) {
                    window.open(tech.url, '_blank');
                }
            });

            // Standard click for desktop
            img.onclick = (e) => {
                if (!img.classList.contains('is-front')) e.preventDefault();
                else window.open(tech.url, '_blank');
            };
        }

        container.appendChild(img);
        icons.push({ 
            img, phi, theta, isSocial: !!tech.url,
            scale: 1, targetScale: 1 
        });
    });

    const handleStart = (e) => {
        isDragging = true;
        const pos = e.touches ? e.touches[0] : e;
        lastMouseX = pos.pageX;
        lastMouseY = pos.pageY;
    };

    const handleMove = (e) => {
        if (!isDragging) return;
        if (e.touches) e.preventDefault(); 

        const pos = e.touches ? e.touches[0] : e;
        velocityY = (pos.pageX - lastMouseX) * 0.005;
        velocityX = (pos.pageY - lastMouseY) * 0.005;
        lastMouseX = pos.pageX;
        lastMouseY = pos.pageY;
    };

    visualArea.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', () => isDragging = false);
    visualArea.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', () => isDragging = false);

    function animate() {
        if (!isDragging) {
            velocityY *= 0.95;
            velocityX *= 0.95;
            if (Math.abs(velocityY) < 0.005) velocityY = 0.01 * Math.sign(velocityY || 1);
        }

        rotationY += velocityY;
        rotationX += velocityX;

        icons.forEach(item => {
            const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
            const cosY = Math.cos(rotationY + item.theta), sinY = Math.sin(rotationY + item.theta);

            const x = radiusX * sinY * Math.sin(item.phi);
            const y = radiusY * (Math.cos(item.phi) * cosX - cosY * Math.sin(item.phi) * sinX);
            const z = radiusZ * (Math.cos(item.phi) * sinX + cosY * Math.sin(item.phi) * cosX);

            item.scale += (item.targetScale - item.scale) * 0.1;
            const depth = (z + radiusZ) / (2 * radiusZ);
            const finalScale = item.scale * (depth * 0.6 + 0.5);

            item.img.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${finalScale})`;
            
            // --- STABLE Z-INDEX LOGIC ---
            // Boost socials and front-facing icons to ensure they are always clickable
            const baseZ = Math.round(z + radiusZ);
            let finalZ = baseZ;
            if (z > 0) {
                item.img.classList.add('is-front');
                finalZ += 100; // Major boost for front icons
            } else {
                item.img.classList.remove('is-front');
            }
            if (item.isSocial) finalZ += 50; 

            item.img.style.zIndex = finalZ;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', calculateRadii);
    animate();
});