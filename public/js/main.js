// Modern JavaScript for Mobile Doctor Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('d-none');
                backToTopBtn.classList.add('d-block');
            } else {
                backToTopBtn.classList.add('d-none');
                backToTopBtn.classList.remove('d-block');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.classList.add('shadow-lg');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.classList.remove('shadow-lg');
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // Smooth scrolling for anchor links
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

    // Form validation and enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Remove invalid class after user starts typing
                    field.addEventListener('input', function() {
                        this.classList.remove('is-invalid');
                    });
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                showNotification('Please fill in all required fields.', 'warning');
            }
        });
    });

    // Enhanced contact form
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual AJAX call)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-success');
                
                // Reset form
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-primary');
                    submitBtn.disabled = false;
                }, 2000);
                
                showNotification('Thank you! Your message has been sent successfully.', 'success');
            }, 1500);
        });
    }

    // WhatsApp button enhancement
    const whatsappButtons = document.querySelectorAll('.btn-success');
    whatsappButtons.forEach(btn => {
        if (btn.textContent.includes('WhatsApp')) {
            btn.classList.add('pulse-animation');
        }
    });

    // Gallery image lightbox functionality
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Blog post cards enhancement
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-value') || target.textContent);
                animateCounter(target, 0, finalValue, 2000);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });

    // Mobile menu enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                navbarCollapse.classList.add('show');
            }, 100);
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }

    // Search functionality (if implemented)
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.searchable-item');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Theme toggle logic for Samsung One UI style
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            // Update icon and text
            const icon = theme === 'dark' ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
            const text = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
            themeToggleBtn.innerHTML = `${icon}<span class="d-none d-md-inline">${text}</span><span class="toggle-slider"></span><span class="toggle-knob"></span>`;
        }
    }

    // Detect saved or system theme
    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Apply theme on load
    setTheme(getPreferredTheme());

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
            localStorage.setItem('theme', next);
        });
    }
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function openLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox position-fixed w-100 h-100 d-flex align-items-center justify-content-center';
    lightbox.style.cssText = 'top: 0; left: 0; background: rgba(0,0,0,0.9); z-index: 9999;';
    lightbox.innerHTML = `
        <div class="position-relative">
            <img src="${src}" alt="${alt}" class="img-fluid" style="max-height: 90vh; max-width: 90vw;">
            <button class="btn btn-light position-absolute top-0 end-0 m-3" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    document.body.appendChild(lightbox);
}

// Performance optimization
function debounce(func, wait) {
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

// Enhanced scroll handling
const handleScroll = debounce(() => {
    // Add any scroll-based functionality here
}, 16);

window.addEventListener('scroll', handleScroll);

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 