// Timeline Animation
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    function animateTimeline() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const timelineContainer = document.querySelector('.timeline-container');
        
        if (!timelineContainer) return;
        
        const containerTop = timelineContainer.offsetTop;
        const containerHeight = timelineContainer.offsetHeight;
        
        let activeItems = 0;
        
        timelineItems.forEach((item, index) => {
            const itemTop = item.offsetTop + containerTop;
            const itemHeight = item.offsetHeight;
            
            // Check if item is in viewport
            if (scrollTop + windowHeight > itemTop + itemHeight / 3) {
                item.classList.add('visible');
                
                // Check if item should be active (fully visible)
                if (scrollTop + windowHeight > itemTop + itemHeight / 2) {
                    item.classList.add('active');
                    activeItems = index + 1;
                }
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update progress line
        if (timelineProgress) {
            const progressPercent = Math.min((activeItems / timelineItems.length) * 100, 100);
            timelineProgress.style.height = progressPercent + '%';
        }
    }
    
    // Initial check
    animateTimeline();
    
    // Listen to scroll events
    window.addEventListener('scroll', animateTimeline);
    
    // Smooth scroll for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(animateTimeline);
            ticking = true;
            setTimeout(() => ticking = false, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick);
});