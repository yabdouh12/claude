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
document.querySelectorAll('.feature-card, .service-item, .result-card, .testimonial-card').forEach((el, i) => {
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
        const rect = heroLogo.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroLogo.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.08)`;
    });

    heroLogo.addEventListener('mouseleave', () => {
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
