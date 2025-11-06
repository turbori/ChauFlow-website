// ============================================
// ChauFlow - Real-time Sync Across Browser Tabs
// ============================================

/**
 * Real-time sync manager using Supabase Realtime
 * Syncs data changes across multiple browser tabs
 */
class RealtimeSync {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.channels = {};
        this.callbacks = {};
    }
    
    /**
     * Subscribe to income changes
     * @param {string} userId - User ID to filter by
     * @param {Function} callback - Callback function when data changes
     */
    subscribeToIncome(userId, callback) {
        const channelName = `income:${userId}`;
        
        if (this.channels[channelName]) {
            console.log('Already subscribed to income channel');
            return;
        }
        
        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'income',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('Income change detected:', payload);
                    if (callback) callback(payload);
                }
            )
            .subscribe();
        
        this.channels[channelName] = channel;
        this.callbacks[channelName] = callback;
        
        console.log('Subscribed to income changes');
    }
    
    /**
     * Subscribe to expense changes
     * @param {string} userId - User ID to filter by
     * @param {Function} callback - Callback function when data changes
     */
    subscribeToExpenses(userId, callback) {
        const channelName = `expenses:${userId}`;
        
        if (this.channels[channelName]) {
            console.log('Already subscribed to expenses channel');
            return;
        }
        
        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'expenses',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('Expense change detected:', payload);
                    if (callback) callback(payload);
                }
            )
            .subscribe();
        
        this.channels[channelName] = channel;
        this.callbacks[channelName] = callback;
        
        console.log('Subscribed to expense changes');
    }
    
    /**
     * Subscribe to asset changes
     * @param {string} userId - User ID to filter by
     * @param {Function} callback - Callback function when data changes
     */
    subscribeToAssets(userId, callback) {
        const channelName = `assets:${userId}`;
        
        if (this.channels[channelName]) {
            console.log('Already subscribed to assets channel');
            return;
        }
        
        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'assets',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('Asset change detected:', payload);
                    if (callback) callback(payload);
                }
            )
            .subscribe();
        
        this.channels[channelName] = channel;
        this.callbacks[channelName] = callback;
        
        console.log('Subscribed to asset changes');
    }
    
    /**
     * Subscribe to liability changes
     * @param {string} userId - User ID to filter by
     * @param {Function} callback - Callback function when data changes
     */
    subscribeToLiabilities(userId, callback) {
        const channelName = `liabilities:${userId}`;
        
        if (this.channels[channelName]) {
            console.log('Already subscribed to liabilities channel');
            return;
        }
        
        const channel = this.supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'liabilities',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('Liability change detected:', payload);
                    if (callback) callback(payload);
                }
            )
            .subscribe();
        
        this.channels[channelName] = channel;
        this.callbacks[channelName] = callback;
        
        console.log('Subscribed to liability changes');
    }
    
    /**
     * Unsubscribe from a channel
     * @param {string} channelName - Channel name to unsubscribe from
     */
    unsubscribe(channelName) {
        if (this.channels[channelName]) {
            this.supabase.removeChannel(this.channels[channelName]);
            delete this.channels[channelName];
            delete this.callbacks[channelName];
            console.log(`Unsubscribed from ${channelName}`);
        }
    }
    
    /**
     * Unsubscribe from all channels
     */
    unsubscribeAll() {
        Object.keys(this.channels).forEach(channelName => {
            this.unsubscribe(channelName);
        });
        console.log('Unsubscribed from all channels');
    }
}

/**
 * Cross-tab sync using localStorage events
 * Fallback for browsers that don't support Supabase Realtime
 */
class CrossTabSync {
    constructor() {
        this.listeners = {};
        this.setupStorageListener();
    }
    
    /**
     * Setup storage event listener
     */
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('chauflow_sync_')) {
                const eventType = e.key.replace('chauflow_sync_', '');
                if (this.listeners[eventType]) {
                    try {
                        const data = JSON.parse(e.newValue);
                        this.listeners[eventType].forEach(callback => callback(data));
                    } catch (error) {
                        console.error('Error parsing sync data:', error);
                    }
                }
            }
        });
    }
    
    /**
     * Broadcast change to other tabs
     * @param {string} eventType - Type of event (income_changed, expense_changed, etc.)
     * @param {Object} data - Data to broadcast
     */
    broadcast(eventType, data) {
        const key = `chauflow_sync_${eventType}`;
        const value = JSON.stringify({
            ...data,
            timestamp: Date.now(),
            tabId: this.getTabId()
        });
        
        localStorage.setItem(key, value);
        
        // Clean up after broadcast
        setTimeout(() => {
            localStorage.removeItem(key);
        }, 1000);
    }
    
    /**
     * Listen for changes from other tabs
     * @param {string} eventType - Type of event to listen for
     * @param {Function} callback - Callback function
     */
    on(eventType, callback) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }
    
    /**
     * Remove listener
     * @param {string} eventType - Type of event
     * @param {Function} callback - Callback to remove
     */
    off(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
        }
    }
    
    /**
     * Get unique tab ID
     * @returns {string} Tab ID
     */
    getTabId() {
        if (!sessionStorage.getItem('chauflow_tab_id')) {
            sessionStorage.setItem('chauflow_tab_id', `tab_${Date.now()}_${Math.random()}`);
        }
        return sessionStorage.getItem('chauflow_tab_id');
    }
}

/**
 * Initialize real-time sync for a page
 * @param {Object} supabaseClient - Supabase client instance
 * @param {Object} currentUser - Current user object
 * @param {Object} options - Configuration options
 */
function initializeRealtimeSync(supabaseClient, currentUser, options = {}) {
    if (!currentUser || !currentUser.id) {
        console.warn('Cannot initialize realtime sync: No user');
        return null;
    }
    
    const realtimeSync = new RealtimeSync(supabaseClient);
    const crossTabSync = new CrossTabSync();
    
    // Subscribe to income changes
    if (options.syncIncome !== false) {
        realtimeSync.subscribeToIncome(currentUser.id, (payload) => {
            // Broadcast to other tabs
            crossTabSync.broadcast('income_changed', {
                event: payload.eventType,
                data: payload.new || payload.old
            });
            
            // Call page-specific callback
            if (options.onIncomeChange) {
                options.onIncomeChange(payload);
            }
        });
        
        // Listen for changes from other tabs
        crossTabSync.on('income_changed', (data) => {
            if (data.tabId !== crossTabSync.getTabId() && options.onIncomeChange) {
                options.onIncomeChange({
                    eventType: data.event,
                    new: data.data
                });
            }
        });
    }
    
    // Subscribe to expense changes
    if (options.syncExpenses !== false) {
        realtimeSync.subscribeToExpenses(currentUser.id, (payload) => {
            // Broadcast to other tabs
            crossTabSync.broadcast('expense_changed', {
                event: payload.eventType,
                data: payload.new || payload.old
            });
            
            // Call page-specific callback
            if (options.onExpenseChange) {
                options.onExpenseChange(payload);
            }
        });
        
        // Listen for changes from other tabs
        crossTabSync.on('expense_changed', (data) => {
            if (data.tabId !== crossTabSync.getTabId() && options.onExpenseChange) {
                options.onExpenseChange({
                    eventType: data.event,
                    new: data.data
                });
            }
        });
    }
    
    // Subscribe to asset changes
    if (options.syncAssets) {
        realtimeSync.subscribeToAssets(currentUser.id, (payload) => {
            crossTabSync.broadcast('asset_changed', {
                event: payload.eventType,
                data: payload.new || payload.old
            });
            
            if (options.onAssetChange) {
                options.onAssetChange(payload);
            }
        });
        
        crossTabSync.on('asset_changed', (data) => {
            if (data.tabId !== crossTabSync.getTabId() && options.onAssetChange) {
                options.onAssetChange({
                    eventType: data.event,
                    new: data.data
                });
            }
        });
    }
    
    // Subscribe to liability changes
    if (options.syncLiabilities) {
        realtimeSync.subscribeToLiabilities(currentUser.id, (payload) => {
            crossTabSync.broadcast('liability_changed', {
                event: payload.eventType,
                data: payload.new || payload.old
            });
            
            if (options.onLiabilityChange) {
                options.onLiabilityChange(payload);
            }
        });
        
        crossTabSync.on('liability_changed', (data) => {
            if (data.tabId !== crossTabSync.getTabId() && options.onLiabilityChange) {
                options.onLiabilityChange({
                    eventType: data.event,
                    new: data.data
                });
            }
        });
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        realtimeSync.unsubscribeAll();
    });
    
    return {
        realtimeSync,
        crossTabSync,
        cleanup: () => realtimeSync.unsubscribeAll()
    };
}

/**
 * Show sync notification
 * @param {string} message - Notification message
 */
function showSyncNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in';
    notification.innerHTML = `
        <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        <span class="text-sm">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-slide-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

