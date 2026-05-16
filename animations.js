// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis smooth scroll
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, smoothTouch: false });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor (desktop only) ---
const isTouch = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;
if (!isTouch) {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    if (dot && outline) {
        window.addEventListener('mousemove', (e) => {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
            outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 400, fill: 'forwards' });
        });
        document.querySelectorAll('a, button, .fleet-card, .stat-card, .team-card, .investor-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });
    }
}

// --- Navbar scroll state ---
const navbar = document.getElementById('navbar');
ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
        if (self.scroll() > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
});

// --- Mobile Nav ---
function toggleMobileNav() {
    const nav = document.getElementById('mobileNav');
    const hamburger = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
    if (nav.classList.contains('open')) lenis.stop();
    else lenis.start();
}

// --- Preloader ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const tl = gsap.timeline();
    tl.to('.loading-progress', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
      .to('.preloader-text', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.8')
      .to(preloader, { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.3 })
      .add(() => {
          document.body.classList.remove('loading');
          initAnimations();
      });
});

// --- Scroll Animations ---
function initAnimations() {
    gsap.to('.parallax-bg', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.from('.title-line', { yPercent: 100, duration: 1, ease: 'power4.out', stagger: 0.15, delay: 0.1 });
    gsap.from('.anim-reveal', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.4 });

    document.querySelectorAll('.anim-up').forEach(el => {
        gsap.fromTo(el,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        );
    });

    document.querySelectorAll('.stat-number[data-target]').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power1.out',
            scrollTrigger: { trigger: stat, start: 'top 85%', once: true },
            onUpdate: function() {
                stat.innerHTML = Math.floor(parseFloat(stat.innerHTML)).toLocaleString();
            }
        });
    });

    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.fromTo(step,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: step, start: 'top 90%', once: true } }
        );
    });
}

// --- Modal ---
function toggleModal() {
    const modal = document.getElementById('dispatchModal');
    modal.classList.toggle('active');
    if (modal.classList.contains('active')) lenis.stop();
    else lenis.start();
}
