// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation for grid items
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// Add fade-in to elements with staggered delays
document.querySelectorAll('.feature-card, .service-item, .result-card, .testimonial-card, .team-card').forEach((el, i) => {
    el.classList.add('fade-in');
    el.dataset.delay = (i % 4) * 100;
    observer.observe(el);
});

document.querySelectorAll('.section-header, .contact-info, .contact-form, .cta-card, .about-content').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    
    btn.innerHTML = 'Message Sent! ✓';
    btn.style.background = '#22c55e';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
    }, 3000);
});

// ===== PARALLAX GLOW EFFECT =====
const heroGlow = document.querySelector('.hero-glow');

window.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768 && heroGlow) {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        heroGlow.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
    }
});

// ===== INTERACTIVE LOGO TILT =====
const heroLogo = document.getElementById('heroLogo');

if (heroLogo) {
    heroLogo.addEventListener('mousemove', (e) => {
        if (heroLogo.classList.contains('erupting')) return;
        const rect = heroLogo.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroLogo.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.08)`;
    });

    heroLogo.addEventListener('mouseleave', () => {
        if (heroLogo.classList.contains('erupting')) return;
        heroLogo.style.transform = '';
    });
}

// ===== PORTFOLIO VIDEO LIGHTBOX =====
(function () {
    const thumb = document.getElementById('videoThumb');
    const modal = document.getElementById('videoModal');
    const embed = document.getElementById('videoEmbed');
    const closeBtn = document.getElementById('videoClose');
    const backdrop = document.getElementById('videoBackdrop');

    if (!thumb || !modal || !embed) return;

    const raw = (thumb.dataset.video || '').trim();

    // Detect a channel/playlist link (can't be embedded as a single video)
    const isChannel = /@|\/channel\/|\/c\/|\/user\/|list=/.test(raw);

    // Accepts a raw ID, a watch URL, a youtu.be link, or a shorts link
    function extractId(value) {
        if (!value) return '';
        value = value.trim();
        if (!/[\/?=&.]/.test(value)) return value; // already a bare ID
        const patterns = [
            /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
            /(?:youtu\.be\/)([\w-]{11})/,
            /(?:youtube\.com\/(?:embed|shorts)\/)([\w-]{11})/
        ];
        for (const re of patterns) {
            const m = value.match(re);
            if (m) return m[1];
        }
        return value;
    }

    // ----- Channel link: open YouTube in a new tab -----
    if (isChannel) {
        thumb.addEventListener('click', () => {
            window.open(raw, '_blank', 'noopener');
        });
        return;
    }

    // ----- Single video: open in lightbox -----
    const videoId = extractId(raw);

    // Use the YouTube thumbnail as the preview image
    if (videoId) {
        thumb.style.backgroundImage =
            `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
    }

    function openModal() {
        embed.innerHTML =
            `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"` +
            ` title="Volcano Prod showreel" allow="accelerometer; autoplay; clipboard-write;` +
            ` encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Clear the iframe so the video stops playing
        setTimeout(() => { embed.innerHTML = ''; }, 300);
    }

    thumb.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
})();

// ===== 🌋 VOLCANO ERUPTION EFFECT =====
(function () {
    if (!heroLogo) return;

    // Full-screen canvas for particles
    const canvas = document.createElement('canvas');
    canvas.id = 'eruption-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let particles = [];
    let animating = false;

    const lavaColors = ['#fff3b0', '#ffd60a', '#ff8c00', '#ff6b00', '#ff4500', '#e02f00', '#c1121f'];
    const smokeColors = ['rgba(40,40,40,', 'rgba(60,55,50,', 'rgba(30,30,30,'];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function spawnParticle(cx, cy, type) {
        if (type === 'smoke') {
            return {
                type: 'smoke',
                x: cx + rand(-15, 15), y: cy,
                vx: rand(-0.8, 0.8), vy: rand(-3.5, -1.5),
                size: rand(18, 38), grow: rand(0.15, 0.4),
                life: 1, decay: rand(0.006, 0.012),
                color: smokeColors[Math.floor(Math.random() * smokeColors.length)],
                gravity: -0.02
            };
        }
        // lava / ember
        const angle = rand(-Math.PI / 2 - 0.9, -Math.PI / 2 + 0.9); // upward cone
        const speed = rand(6, 20);
        return {
            type: 'lava',
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: rand(2.5, 8),
            life: 1, decay: rand(0.008, 0.02),
            color: lavaColors[Math.floor(Math.random() * lavaColors.length)],
            gravity: rand(0.25, 0.42),
            trail: Math.random() < 0.4
        };
    }

    function erupt() {
        const rect = heroLogo.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Particles
        for (let i = 0; i < 160; i++) particles.push(spawnParticle(cx, cy, 'lava'));
        for (let i = 0; i < 14; i++) particles.push(spawnParticle(cx, cy, 'smoke'));
        if (particles.length > 900) particles = particles.slice(-900);

        // Shockwave ring
        const ring = document.createElement('div');
        ring.className = 'shockwave';
        ring.style.left = cx + 'px';
        ring.style.top = cy + 'px';
        document.body.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());

        // Fiery flash
        const flash = document.createElement('div');
        flash.className = 'erupt-flash';
        flash.style.setProperty('--fx', cx + 'px');
        flash.style.setProperty('--fy', cy + 'px');
        document.body.appendChild(flash);
        flash.addEventListener('animationend', () => flash.remove());

        // Logo recoil + screen shake
        heroLogo.classList.add('erupting');
        document.body.classList.add('shake');
        setTimeout(() => heroLogo.classList.remove('erupting'), 600);
        setTimeout(() => document.body.classList.remove('shake'), 600);

        if (!animating) { animating = true; requestAnimationFrame(loop); }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.type === 'smoke') {
                p.size += p.grow;
                ctx.beginPath();
                ctx.fillStyle = p.color + Math.max(0, p.life * 0.35) + ')';
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                if (p.trail) {
                    ctx.lineWidth = p.size;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = p.color;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 0.6, p.y - p.vy * 0.6);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
            }

            if (p.life <= 0 || p.y - p.size > window.innerHeight) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animating = false;
        }
    }

    heroLogo.addEventListener('click', erupt);
    heroLogo.addEventListener('touchstart', (e) => { e.preventDefault(); erupt(); }, { passive: false });
})();
