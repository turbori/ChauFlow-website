// ============================================
// ChauFlow - Offline Manager & Retry Logic
// ============================================

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            // Don't retry on certain errors
            if (error.code === '401' || error.code === 'PGRST301') {
                throw error; // Auth errors shouldn't be retried
            }
            
            if (i === maxRetries - 1) {
                throw error; // Last attempt failed
            }
            
            // Calculate delay with exponential backoff
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
            
            // Show retry notification
            if (i > 0) {
                showInfoMessage(`Retrying... (Attempt ${i + 1}/${maxRetries})`);
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

/**
 * Offline Manager
 * Handles offline detection and queuing of operations
 */
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.queue = this.loadQueue();
        this.setupListeners();
        
        // Check online status on init
        if (!this.isOnline) {
            this.showOfflineBanner();
        }
    }
    
    /**
     * Setup event listeners for online/offline
     */
    setupListeners() {
        window.addEventListener('online', () => {
            console.log('Connection restored');
            this.isOnline = true;
            this.hideOfflineBanner();
            showSuccessMessage('Connection restored! Syncing changes...');
            this.processQueue();
        });
        
        window.addEventListener('offline', () => {
            console.log('Connection lost');
            this.isOnline = false;
            this.showOfflineBanner();
        });
        
        // Periodic check (every 30 seconds)
        setInterval(() => {
            this.checkConnection();
        }, 30000);
    }
    
    /**
     * Check connection status
     */
    async checkConnection() {
        try {
            const response = await fetch('https://www.google.com/favicon.ico', {
                mode: 'no-cors',
                cache: 'no-cache'
            });
            if (!this.isOnline) {
                this.isOnline = true;
                this.hideOfflineBanner();
                this.processQueue();
            }
        } catch (error) {
            if (this.isOnline) {
                this.isOnline = false;
                this.showOfflineBanner();
            }
        }
    }
    
    /**
     * Show offline banner
     */
    showOfflineBanner() {
        // Remove existing banner if any
        this.hideOfflineBanner();
        
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-3 text-center z-50 shadow-lg';
        banner.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
                </svg>
                <span class="font-semibold">You're offline</span>
                <span class="hidden sm:inline">- Changes may not be saved until connection is restored</span>
            </div>
        `;
        document.body.prepend(banner);
        
        // Adjust page padding to account for banner
        document.body.style.paddingTop = '48px';
    }
    
    /**
     * Hide offline banner
     */
    hideOfflineBanner() {
        const banner = document.getElementById('offline-banner');
        if (banner) {
            banner.remove();
            document.body.style.paddingTop = '0';
        }
    }
    
    /**
     * Queue an operation for later execution
     * @param {Object} operation - Operation to queue
     */
    queueOperation(operation) {
        const queuedOp = {
            id: `op_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
            ...operation
        };
        
        this.queue.push(queuedOp);
        this.saveQueue();
        
        console.log('Operation queued:', queuedOp);
        showInfoMessage(`Operation saved. Will sync when online. (${this.queue.length} pending)`);
    }
    
    /**
     * Process queued operations
     */
    async processQueue() {
        if (this.queue.length === 0) {
            return;
        }
        
        console.log(`Processing ${this.queue.length} queued operations...`);
        
        const results = {
            success: 0,
            failed: 0
        };
        
        while (this.queue.length > 0 && this.isOnline) {
            const operation = this.queue[0];
            
            try {
                await this.executeOperation(operation);
                this.queue.shift(); // Remove from queue
                results.success++;
                console.log('Operation completed:', operation.id);
            } catch (error) {
                console.error('Operation failed:', operation.id, error);
                results.failed++;
                
                // If auth error, clear queue and stop
                if (error.code === '401' || error.code === 'PGRST301') {
                    console.log('Auth error, clearing queue');
                    this.queue = [];
                    break;
                }
                
                // If still failing after 5 minutes, remove it
                if (Date.now() - operation.timestamp > 300000) {
                    console.log('Operation expired, removing from queue');
                    this.queue.shift();
                }
                
                break; // Stop processing on error
            }
        }
        
        this.saveQueue();
        
        if (results.success > 0) {
            showSuccessMessage(`Synced ${results.success} pending change(s)`);
        }
        
        if (results.failed > 0 && this.queue.length > 0) {
            showErrorMessage(`${this.queue.length} operation(s) still pending. Will retry automatically.`);
        }
    }
    
    /**
     * Execute a queued operation
     * @param {Object} operation - Operation to execute
     */
    async executeOperation(operation) {
        const { type, table, data, id } = operation;
        
        switch (type) {
            case 'insert':
                return await supabase.from(table).insert(data);
                
            case 'update':
                return await supabase.from(table).update(data).eq('id', id);
                
            case 'delete':
                return await supabase.from(table).delete().eq('id', id);
                
            default:
                throw new Error(`Unknown operation type: ${type}`);
        }
    }
    
    /**
     * Load queue from localStorage
     * @returns {Array} Queued operations
     */
    loadQueue() {
        try {
            const saved = localStorage.getItem('chauflow_offline_queue');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading queue:', error);
            return [];
        }
    }
    
    /**
     * Save queue to localStorage
     */
    saveQueue() {
        try {
            localStorage.setItem('chauflow_offline_queue', JSON.stringify(this.queue));
        } catch (error) {
            console.error('Error saving queue:', error);
        }
    }
    
    /**
     * Clear the queue
     */
    clearQueue() {
        this.queue = [];
        this.saveQueue();
        console.log('Queue cleared');
    }
    
    /**
     * Get queue status
     * @returns {Object} Queue status
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            queueLength: this.queue.length,
            queue: this.queue
        };
    }
}

/**
 * Wrap Supabase operations with retry and offline handling
 * @param {Function} operation - Supabase operation
 * @param {Object} offlineData - Data for offline queue
 * @returns {Promise} Result of operation
 */
async function resilientOperation(operation, offlineData = null) {
    // Check if offline
    if (!navigator.onLine && offlineData) {
        offlineManager.queueOperation(offlineData);
        return { data: null, error: null, queued: true };
    }
    
    // Try with retry logic
    try {
        const result = await retryWithBackoff(operation);
        return result;
    } catch (error) {
        // If failed and offline data provided, queue it
        if (offlineData && !navigator.onLine) {
            offlineManager.queueOperation(offlineData);
            return { data: null, error: null, queued: true };
        }
        
        throw error;
    }
}

// Initialize offline manager
const offlineManager = new OfflineManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        retryWithBackoff,
        OfflineManager,
        resilientOperation,
        offlineManager
    };
}

