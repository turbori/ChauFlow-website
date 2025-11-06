// ============================================
// ChauFlow - Form Utilities
// ============================================

/**
 * Form submission state manager
 * Prevents duplicate submissions
 */
class FormSubmissionManager {
    constructor() {
        this.submitting = new Set();
    }
    
    /**
     * Check if form is currently submitting
     * @param {string} formId - Form identifier
     * @returns {boolean}
     */
    isSubmitting(formId) {
        return this.submitting.has(formId);
    }
    
    /**
     * Mark form as submitting
     * @param {string} formId - Form identifier
     * @param {HTMLElement} submitBtn - Submit button element
     * @returns {boolean} True if successfully marked, false if already submitting
     */
    startSubmission(formId, submitBtn) {
        if (this.isSubmitting(formId)) {
            console.warn(`Form ${formId} is already submitting`);
            return false;
        }
        
        this.submitting.add(formId);
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <svg class="w-5 h-5 animate-spin inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Submitting...
            `;
        }
        
        return true;
    }
    
    /**
     * Mark form as finished submitting
     * @param {string} formId - Form identifier
     * @param {HTMLElement} submitBtn - Submit button element
     */
    endSubmission(formId, submitBtn) {
        this.submitting.delete(formId);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            if (submitBtn.dataset.originalHtml) {
                submitBtn.innerHTML = submitBtn.dataset.originalHtml;
                delete submitBtn.dataset.originalHtml;
            }
        }
    }
    
    /**
     * Reset all submissions (useful for error recovery)
     */
    resetAll() {
        this.submitting.clear();
    }
}

// Global instance
const formManager = new FormSubmissionManager();

/**
 * Debounce function
 * Delays execution until after wait milliseconds have elapsed since the last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
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

/**
 * Throttle function
 * Ensures function is called at most once per specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between calls
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 1000) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Prevent rapid button clicks
 * @param {HTMLElement} button - Button element
 * @param {number} cooldown - Cooldown in milliseconds
 */
function preventRapidClicks(button, cooldown = 2000) {
    if (!button) return;
    
    button.addEventListener('click', function(e) {
        if (this.classList.contains('cooling-down')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        this.classList.add('cooling-down');
        setTimeout(() => {
            this.classList.remove('cooling-down');
        }, cooldown);
    });
}

/**
 * Auto-save form data to localStorage
 * @param {string} formId - Form ID
 * @param {string} storageKey - LocalStorage key
 */
function enableAutoSave(formId, storageKey) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
    
    // Save on input
    const debouncedSave = debounce(() => {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        localStorage.setItem(storageKey, JSON.stringify(data));
    }, 500);
    
    form.addEventListener('input', debouncedSave);
    
    // Clear on successful submit
    form.addEventListener('submit', () => {
        localStorage.removeItem(storageKey);
    });
}

/**
 * Clear form auto-save data
 * @param {string} storageKey - LocalStorage key
 */
function clearAutoSave(storageKey) {
    localStorage.removeItem(storageKey);
}

/**
 * Add loading state to button
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Text to show while loading
 */
function setButtonLoading(button, loadingText = 'Loading...') {
    if (!button) return;
    
    button.disabled = true;
    button.dataset.originalHtml = button.innerHTML;
    button.innerHTML = `
        <svg class="w-5 h-5 animate-spin inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        ${loadingText}
    `;
}

/**
 * Remove loading state from button
 * @param {HTMLElement} button - Button element
 */
function removeButtonLoading(button) {
    if (!button) return;
    
    button.disabled = false;
    if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
        delete button.dataset.originalHtml;
    }
}

/**
 * Show success message
 * @param {string} message - Success message
 * @param {number} duration - Duration in milliseconds
 */
function showSuccessMessage(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in';
    toast.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {number} duration - Duration in milliseconds
 */
function showErrorMessage(message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in';
    toast.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show info message
 * @param {string} message - Info message
 * @param {number} duration - Duration in milliseconds
 */
function showInfoMessage(message, duration = 4000) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in';
    toast.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('animate-slide-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Confirm action with user
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Callback if confirmed
 * @param {Function} onCancel - Callback if cancelled
 */
function confirmAction(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div class="flex items-start gap-4 mb-6">
                <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Confirm Action</h3>
                    <p class="text-gray-600">${message}</p>
                </div>
            </div>
            <div class="flex gap-3 justify-end">
                <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button id="confirm-btn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Confirm
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#confirm-btn').addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    modal.querySelector('#cancel-btn').addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            if (onCancel) onCancel();
        }
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
    
    .animate-slide-out {
        animation: slide-out 0.3s ease-in;
    }
    
    .cooling-down {
        opacity: 0.6;
        cursor: not-allowed !important;
    }
`;
document.head.appendChild(style);

