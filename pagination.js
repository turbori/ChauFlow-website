// ============================================
// ChauFlow - Pagination Utility
// ============================================

/**
 * Pagination class for handling large datasets
 */
class Pagination {
    constructor(items = [], itemsPerPage = 25) {
        this.allItems = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
    }
    
    /**
     * Update items and recalculate pagination
     * @param {Array} items - New items array
     */
    setItems(items) {
        this.allItems = items;
        this.totalPages = Math.ceil(items.length / this.itemsPerPage);
        
        // Reset to page 1 if current page is now out of bounds
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }
    
    /**
     * Get items for current page
     * @returns {Array} Items for current page
     */
    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.allItems.slice(start, end);
    }
    
    /**
     * Go to specific page
     * @param {number} page - Page number
     * @returns {Array|null} Items for the page or null if invalid
     */
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return this.getCurrentPageItems();
        }
        return null;
    }
    
    /**
     * Go to next page
     * @returns {Array|null} Items for next page or null if on last page
     */
    nextPage() {
        return this.goToPage(this.currentPage + 1);
    }
    
    /**
     * Go to previous page
     * @returns {Array|null} Items for previous page or null if on first page
     */
    previousPage() {
        return this.goToPage(this.currentPage - 1);
    }
    
    /**
     * Go to first page
     * @returns {Array} Items for first page
     */
    firstPage() {
        return this.goToPage(1);
    }
    
    /**
     * Go to last page
     * @returns {Array} Items for last page
     */
    lastPage() {
        return this.goToPage(this.totalPages);
    }
    
    /**
     * Check if on first page
     * @returns {boolean}
     */
    isFirstPage() {
        return this.currentPage === 1;
    }
    
    /**
     * Check if on last page
     * @returns {boolean}
     */
    isLastPage() {
        return this.currentPage === this.totalPages;
    }
    
    /**
     * Get pagination info
     * @returns {Object} Pagination information
     */
    getInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.allItems.length);
        
        return {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            itemsPerPage: this.itemsPerPage,
            totalItems: this.allItems.length,
            startItem: start,
            endItem: end,
            hasNextPage: !this.isLastPage(),
            hasPreviousPage: !this.isFirstPage()
        };
    }
    
    /**
     * Render pagination controls
     * @param {string} containerId - Container element ID
     * @param {Function} onPageChange - Callback when page changes
     */
    renderControls(containerId, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const info = this.getInfo();
        
        if (info.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        const html = `
            <div class="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-4">
                <div class="text-sm text-gray-700">
                    Showing <span class="font-semibold">${info.startItem}</span>
                    to <span class="font-semibold">${info.endItem}</span>
                    of <span class="font-semibold">${info.totalItems}</span> results
                </div>
                
                <div class="flex items-center gap-2">
                    <button 
                        onclick="pagination.firstPage(); ${onPageChange ? onPageChange + '()' : ''}"
                        ${info.hasPreviousPage ? '' : 'disabled'}
                        class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="First page">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
                        </svg>
                    </button>
                    
                    <button 
                        onclick="pagination.previousPage(); ${onPageChange ? onPageChange + '()' : ''}"
                        ${info.hasPreviousPage ? '' : 'disabled'}
                        class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Previous
                    </button>
                    
                    <span class="px-4 py-2 text-sm text-gray-700">
                        Page <span class="font-semibold">${info.currentPage}</span> of <span class="font-semibold">${info.totalPages}</span>
                    </span>
                    
                    <button 
                        onclick="pagination.nextPage(); ${onPageChange ? onPageChange + '()' : ''}"
                        ${info.hasNextPage ? '' : 'disabled'}
                        class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next
                    </button>
                    
                    <button 
                        onclick="pagination.lastPage(); ${onPageChange ? onPageChange + '()' : ''}"
                        ${info.hasNextPage ? '' : 'disabled'}
                        class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Last page">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="flex items-center gap-2">
                    <label for="items-per-page" class="text-sm text-gray-700">Items per page:</label>
                    <select 
                        id="items-per-page"
                        onchange="pagination.setItemsPerPage(parseInt(this.value)); ${onPageChange ? onPageChange + '()' : ''}"
                        class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="10" ${info.itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="25" ${info.itemsPerPage === 25 ? 'selected' : ''}>25</option>
                        <option value="50" ${info.itemsPerPage === 50 ? 'selected' : ''}>50</option>
                        <option value="100" ${info.itemsPerPage === 100 ? 'selected' : ''}>100</option>
                    </select>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    /**
     * Set items per page
     * @param {number} count - Items per page
     */
    setItemsPerPage(count) {
        this.itemsPerPage = count;
        this.totalPages = Math.ceil(this.allItems.length / count);
        this.currentPage = 1; // Reset to first page
    }
}

