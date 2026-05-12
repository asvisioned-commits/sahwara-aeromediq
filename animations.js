// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scrolling (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Custom Cursor Logic ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Move cursor
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with slight delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Magnetic Buttons & Hover Effects
const magneticElements = document.querySelectorAll('[data-magnetic]');
const magneticContainers = document.querySelectorAll('[data-magnetic-container]');

// Hover states for links
document.querySelectorAll('a, button, .bento-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});

// Magnetic physics
magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
        const position = el.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 1,
            ease: "power3.out"
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// --- Initial Loading Sequence ---
const preloader = document.querySelector('.preloader');
const preloaderTexts = document.querySelectorAll('.preloader-text span');
const progressBar = document.querySelector('.loading-progress');

window.addEventListener('load', () => {
    const tl = gsap.timeline();

    // Progress bar fill
    tl.to(progressBar, {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
    })
    // Text reveal
    .to(preloaderTexts, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out"
    }, "-=1")
    // Hide preloader
    .to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.5
    })
    // Remove body loading state
    .add(() => {
        document.body.classList.remove('loading');
        initScrollAnimations();
    });
});

// --- Scroll Animations ---
function initScrollAnimations() {
    // Hero Parallax
    gsap.to('.parallax-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Hero Text Reveal
    gsap.from('.reveal-text', {
        yPercent: 100,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.2
    });

    gsap.from('.reveal-up', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.5
    });

    // Split Text Animations (Impact & Network Sections)
    const splitHeaders = document.querySelectorAll('.split-text');
    splitHeaders.forEach(header => {
        gsap.from(header, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
            }
        });
    });

    // Bento Box Grid Reveal
    const bentoItems = document.querySelectorAll('.bento-item');
    gsap.from(bentoItems, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".bento-grid",
            start: "top 75%",
        }
    });

    // Animate Numbers
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: "power1.out",
            scrollTrigger: {
                trigger: stat,
                start: "top 80%"
            }
        });
    });

    // Network Tech List Reveal
    const techItems = document.querySelectorAll('.fade-up-item');
    gsap.from(techItems, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".tech-list",
            start: "top 75%"
        }
    });
}

// --- Modal Functionality ---
function toggleModal() {
    const modal = document.getElementById('dispatchModal');
    modal.classList.toggle('active');
    
    // Disable/Enable Lenis scrolling based on modal state
    if(modal.classList.contains('active')) {
        lenis.stop();
        cursorOutline.style.transform = 'scale(0.5)';
        cursorOutline.style.borderColor = 'var(--orange)';
    } else {
        lenis.start();
        cursorOutline.style.transform = 'scale(1)';
        cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
    }
}