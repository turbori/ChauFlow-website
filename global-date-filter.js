/**
 * Global Date Filter System
 * Manages date filtering across all pages (Dashboard, Income, Expenses, Balance Sheet)
 * Uses localStorage to persist filter state across page navigation
 */

// Global Date Filter Manager
const GlobalDateFilter = {
    // Storage key
    STORAGE_KEY: 'chauflow_global_date_filter',
    
    // Default filter (All Time)
    DEFAULT_FILTER: {
        type: 'all-time',
        label: 'All Time',
        startDate: null,
        endDate: null
    },
    
    /**
     * Get current filter from localStorage
     */
    getFilter() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading global filter:', e);
        }
        return this.DEFAULT_FILTER;
    },
    
    /**
     * Save filter to localStorage
     */
    saveFilter(filter) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filter));
            // Trigger custom event for other components to listen
            window.dispatchEvent(new CustomEvent('globalFilterChanged', { detail: filter }));
        } catch (e) {
            console.error('Error saving global filter:', e);
        }
    },
    
    /**
     * Set quick filter (preset date ranges)
     */
    setQuickFilter(type) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate, endDate, label;
        
        switch (type) {
            case 'today':
                startDate = today;
                endDate = today;
                label = 'Today';
                break;
                
            case 'yesterday':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 1);
                endDate = startDate;
                label = 'Yesterday';
                break;
                
            case 'this-week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - today.getDay()); // Sunday
                endDate = today;
                label = 'This Week';
                break;
                
            case 'last-week':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - today.getDay() - 7);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                label = 'Last Week';
                break;
                
            case 'this-month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = today;
                label = 'This Month';
                break;
                
            case 'last-month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                label = 'Last Month';
                break;
                
            case 'last-30-days':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                endDate = today;
                label = 'Last 30 Days';
                break;
                
            case 'last-60-days':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 60);
                endDate = today;
                label = 'Last 60 Days';
                break;
                
            case 'last-90-days':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 90);
                endDate = today;
                label = 'Last 90 Days';
                break;
                
            case 'this-quarter':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                endDate = today;
                label = 'This Quarter';
                break;
                
            case 'last-quarter':
                const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
                const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
                const lastQuarterMonth = lastQuarter < 0 ? 9 : lastQuarter * 3;
                startDate = new Date(lastQuarterYear, lastQuarterMonth, 1);
                endDate = new Date(lastQuarterYear, lastQuarterMonth + 3, 0);
                label = 'Last Quarter';
                break;
                
            case 'this-year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = today;
                label = 'This Year';
                break;
                
            case 'last-year':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                label = 'Last Year';
                break;
                
            case 'all-time':
            default:
                startDate = null;
                endDate = null;
                label = 'All Time';
                break;
        }
        
        const filter = {
            type,
            label,
            startDate: startDate ? startDate.toISOString().split('T')[0] : null,
            endDate: endDate ? endDate.toISOString().split('T')[0] : null
        };
        
        this.saveFilter(filter);
        return filter;
    },
    
    /**
     * Set custom date range
     */
    setCustomRange(startDate, endDate) {
        const filter = {
            type: 'custom',
            label: 'Custom Range',
            startDate,
            endDate
        };
        
        this.saveFilter(filter);
        return filter;
    },
    
    /**
     * Clear filter (reset to All Time)
     */
    clearFilter() {
        this.saveFilter(this.DEFAULT_FILTER);
        return this.DEFAULT_FILTER;
    },
    
    /**
     * Get filter for Supabase query
     * Returns object with gte (greater than or equal) and lte (less than or equal) dates
     */
    getSupabaseFilter() {
        const filter = this.getFilter();
        const result = {};
        
        if (filter.startDate) {
            result.gte = filter.startDate;
        }
        
        if (filter.endDate) {
            // Add one day to include the end date (Supabase uses < not <=)
            const endDate = new Date(filter.endDate);
            endDate.setDate(endDate.getDate() + 1);
            result.lt = endDate.toISOString().split('T')[0];
        }
        
        return result;
    },
    
    /**
     * Apply filter to Supabase query builder
     */
    applyToQuery(query, dateColumn = 'date') {
        const filter = this.getSupabaseFilter();
        
        if (filter.gte) {
            query = query.gte(dateColumn, filter.gte);
        }
        
        if (filter.lt) {
            query = query.lt(dateColumn, filter.lt);
        }
        
        return query;
    },
    
    /**
     * Format filter label for display
     */
    getDisplayLabel() {
        const filter = this.getFilter();
        
        if (filter.type === 'custom' && filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const end = new Date(filter.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return `${start} - ${end}`;
        }
        
        return filter.label;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalDateFilter;
}

