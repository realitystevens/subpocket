// Policy Page JavaScript Functionality

class PolicyPageController {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.navItems = document.querySelectorAll('.nav-item');
        this.sections = document.querySelectorAll('.policy-section[id]');
        this.navContainer = document.querySelector('.policy-nav');
        
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupBackToTop();
        this.setupScrollSpy();
        this.setupIntersectionObserver();
        this.setupNavSticky();
    }

    // Smooth scrolling for navigation links
    setupSmoothScrolling() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 140; // Account for sticky nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav item
                    this.updateActiveNavItem(targetId);
                }
            });
        });
    }

    // Back to top button functionality
    setupBackToTop() {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                this.backToTopBtn.style.display = 'block';
                this.backToTopBtn.style.opacity = '1';
            } else {
                this.backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        this.backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Smooth scroll to top when clicked
        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Update active navigation item based on scroll position
    setupScrollSpy() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollSpy();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateScrollSpy() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200; // Offset for better UX

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });

        if (current) {
            this.updateActiveNavItem(current);
        }
    }

    updateActiveNavItem(activeId) {
        // Remove active class from all nav items
        this.navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const activeNavItem = document.querySelector(`.nav-item[href="${activeId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    // Intersection Observer for fade-in animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all major elements
        const elementsToAnimate = document.querySelectorAll(`
            .policy-section,
            .info-card,
            .security-card,
            .right-card,
            .contact-card,
            .usage-item
        `);

        elementsToAnimate.forEach(element => {
            element.classList.add('animate-element');
            observer.observe(element);
        });
    }

    // Sticky navigation behavior
    setupNavSticky() {
        let lastScrollTop = 0;
        const nav = this.navContainer;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down - hide nav
                nav.style.transform = 'translateY(-100%)';
                nav.style.opacity = '0';
            } else {
                // Scrolling up - show nav
                nav.style.transform = 'translateY(0)';
                nav.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Reading Progress Indicator
class ReadingProgress {
    constructor() {
        this.createProgressBar();
        this.updateProgress();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);
    }

    updateProgress() {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            const progressBar = document.querySelector('.reading-progress-bar');
            if (progressBar) {
                progressBar.style.width = scrolled + '%';
            }
        });
    }
}

// Copy to Clipboard functionality for email addresses
class ClipboardManager {
    constructor() {
        this.setupEmailCopy();
    }

    setupEmailCopy() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        emailLinks.forEach(link => {
            // Add copy icon
            const copyIcon = document.createElement('span');
            copyIcon.className = 'material-symbols-outlined copy-icon';
            copyIcon.textContent = 'content_copy';
            copyIcon.style.fontSize = '16px';
            copyIcon.style.marginLeft = '8px';
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.opacity = '0.6';
            copyIcon.style.transition = 'opacity 0.2s ease';
            
            link.appendChild(copyIcon);
            
            // Copy functionality
            copyIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const email = link.getAttribute('href').replace('mailto:', '');
                this.copyToClipboard(email, copyIcon);
            });
            
            copyIcon.addEventListener('mouseenter', () => {
                copyIcon.style.opacity = '1';
            });
            
            copyIcon.addEventListener('mouseleave', () => {
                copyIcon.style.opacity = '0.6';
            });
        });
    }

    async copyToClipboard(text, iconElement) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback(iconElement, 'Copied!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showCopyFeedback(iconElement, 'Copied!');
            } catch (fallbackErr) {
                this.showCopyFeedback(iconElement, 'Failed to copy');
            }
            
            document.body.removeChild(textArea);
        }
    }

    showCopyFeedback(iconElement, message) {
        const originalText = iconElement.textContent;
        iconElement.textContent = 'check';
        iconElement.style.color = '#28a745';
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            transform: translateX(-50%);
            white-space: nowrap;
        `;
        
        const rect = iconElement.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 30 + 'px';
        
        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            iconElement.textContent = originalText;
            iconElement.style.color = '';
            document.body.removeChild(tooltip);
        }, 2000);
    }
}

// Print functionality
class PrintManager {
    constructor() {
        this.addPrintButton();
    }

    addPrintButton() {
        // Determine if we're on terms or privacy page
        const isTermsPage = document.title.toLowerCase().includes('terms') || 
                          window.location.pathname.includes('terms');
        
        const buttonText = isTermsPage ? 'Print Terms' : 'Print Policy';
        
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.innerHTML = `
            <span class="material-symbols-outlined">print</span>
            <span>${buttonText}</span>
        `;
        printBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            font-family: var(--typography);
        `;
        
        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.background = 'var(--primary-color)';
            printBtn.style.color = 'white';
            printBtn.style.transform = 'translateY(-2px)';
        });
        
        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.background = 'white';
            printBtn.style.color = 'var(--primary-color)';
            printBtn.style.transform = 'translateY(0)';
        });
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        document.body.appendChild(printBtn);
        
        // Hide on mobile
        if (window.innerWidth <= 768) {
            printBtn.style.display = 'none';
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                printBtn.style.display = 'none';
            } else {
                printBtn.style.display = 'flex';
            }
        });
    }
}

// Add CSS for animations and additional styles
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animation styles */
        .animate-element {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Active navigation item */
        .nav-item.active {
            background: var(--primary-color) !important;
            color: white !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 98, 234, 0.2);
        }
        
        /* Reading progress bar */
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }
        
        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color) 0%, #0052c7 100%);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        /* Print styles */
        @media print {
            .header, .footer, .policy-nav, .back-to-top, .print-btn {
                display: none !important;
            }
            
            .policy-hero {
                background: none !important;
                box-shadow: none !important;
            }
            
            .info-card, .security-card, .right-card, .contact-card {
                break-inside: avoid;
                margin-bottom: 20px;
            }
            
            .policy-section {
                break-inside: avoid;
            }
            
            body {
                background: white !important;
            }
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
            .print-btn {
                display: none !important;
            }
        }
        
        /* Smooth navigation transition */
        .policy-nav {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize all functionality
    new PolicyPageController();
    new ReadingProgress();
    new ClipboardManager();
    new PrintManager();
    
    // Add smooth fade-in for the page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        const section = document.querySelector(hash);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
