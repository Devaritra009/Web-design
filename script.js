// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const rippleButtons = document.querySelectorAll('[data-ripple]');
const serviceCards = document.querySelectorAll('[data-tilt]');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const carouselDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const statNumbers = document.querySelectorAll('.stat-number');
const workItems = document.querySelectorAll('.work-item');

// State
let currentTestimonial = 0;
let testimonialInterval;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeRippleEffect();
    initializeTiltEffect();
    initializeTestimonialsCarousel();
    initializeCounters();
    initializeParallax();
    initializeScrollAnimations();
});

// Navbar Functions
function initializeNavbar() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for navigation links
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
}

// Ripple Effect
function initializeRippleEffect() {
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Tilt Effect for Service Cards
function initializeTiltEffect() {
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Testimonials Carousel
function initializeTestimonialsCarousel() {
    // Auto-play carousel
    function startCarousel() {
        testimonialInterval = setInterval(() => {
            nextTestimonial();
        }, 5000);
    }

    function stopCarousel() {
        clearInterval(testimonialInterval);
    }

    function showTestimonial(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        carouselDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopCarousel();
        nextTestimonial();
        startCarousel();
    });

    prevBtn.addEventListener('click', () => {
        stopCarousel();
        prevTestimonial();
        startCarousel();
    });

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            startCarousel();
        });
    });

    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Start the carousel
    startCarousel();
}

// Animated Counters
function initializeCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Parallax Effect
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Hero parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroOffset = hero.offsetTop;
            const heroHeight = hero.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrolled + windowHeight > heroOffset && scrolled < heroOffset + heroHeight) {
                const rate = (scrolled - heroOffset) * 0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        }

        // Orb animations
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const rate = scrolled * (0.2 + index * 0.1);
            orb.style.transform = `translateY(${rate}px) rotate(${rate * 0.5}deg)`;
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate service cards
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(card);
    });

    // Animate work items
    workItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(item);
    });

    // Animate customer logos
    const customerLogos = document.querySelectorAll('.customer-logo');
    customerLogos.forEach((logo, index) => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(30px)';
        logo.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(logo);
    });

    // Animate stats
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(item);
    });
}

// Smooth Page Loading
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add entrance animations
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
});

// Handle resize
window.addEventListener('resize', () => {
    // Recalculate parallax on resize
    if (window.innerWidth <= 768) {
        // Disable parallax on mobile
        document.querySelectorAll('.parallax-item').forEach(item => {
            item.style.backgroundAttachment = 'scroll';
        });
    } else {
        document.querySelectorAll('.parallax-item').forEach(item => {
            item.style.backgroundAttachment = 'fixed';
        });
    }
});

// Customer logo hover effects
document.querySelectorAll('.customer-logo').forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add floating animation to gradient orbs
function animateOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const amplitude = 20 + index * 10;
        const speed = 0.001 + index * 0.0005;
        
        function float() {
            const time = Date.now() * speed;
            const y = Math.sin(time) * amplitude;
            const x = Math.cos(time * 0.7) * (amplitude * 0.5);
            
            orb.style.transform = `translate(${x}px, ${y}px) rotate(${time * 20}deg)`;
            requestAnimationFrame(float);
        }
        
        setTimeout(float, index * 1000);
    });
}

// Start orb animations
animateOrbs();

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    initializeParallax();
}, 16);

window.addEventListener('scroll', throttledScroll);