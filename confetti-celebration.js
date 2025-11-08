/**
 * Confetti Celebration System
 * Adds visual celebration effects when users complete transactions
 * Uses canvas-confetti library for engaging user experience
 */

// Confetti celebration function
function celebrateSuccess() {
    // Check if confetti library is loaded
    if (typeof confetti === 'undefined') {
        console.warn('Confetti library not loaded');
        return;
    }
    
    // Fire confetti from multiple angles for a more exciting effect
    const duration = 2000; // 2 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Fire from left side
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Fire from right side
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Quick burst confetti (for smaller actions)
function celebrateQuick() {
    if (typeof confetti === 'undefined') {
        console.warn('Confetti library not loaded');
        return;
    }
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 9999
    });
}

// Fireworks style confetti (for major milestones)
function celebrateFireworks() {
    if (typeof confetti === 'undefined') {
        console.warn('Confetti library not loaded');
        return;
    }
    
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }
        
        confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 9999,
            particleCount: 50,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });
    }, 400);
}

// Money rain effect (for financial transactions)
function celebrateMoneyRain() {
    if (typeof confetti === 'undefined') {
        console.warn('Confetti library not loaded');
        return;
    }
    
    const scalar = 2;
    const dollar = confetti.shapeFromText({ text: '💵', scalar });
    const coin = confetti.shapeFromText({ text: '💰', scalar });
    
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0.8,
        decay: 0.94,
        startVelocity: 20,
        shapes: [dollar, coin],
        scalar,
        zIndex: 9999
    };
    
    function shoot() {
        confetti({
            ...defaults,
            particleCount: 30
        });
        
        confetti({
            ...defaults,
            particleCount: 20,
            scalar: scalar / 2,
            shapes: ['circle']
        });
    }
    
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

// Success celebration with sound (optional)
function celebrateWithSound() {
    celebrateSuccess();
    
    // Optional: Play a success sound
    // const audio = new Audio('/sounds/success.mp3');
    // audio.play().catch(e => console.log('Audio play failed:', e));
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        celebrateSuccess,
        celebrateQuick,
        celebrateFireworks,
        celebrateMoneyRain,
        celebrateWithSound
    };
}

