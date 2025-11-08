/**
 * Global Date Filter UI Component
 * Provides a consistent UI for date filtering across all pages
 */

// Initialize the global filter UI
function initGlobalFilterUI() {
    // Create the filter button and modal
    createFilterButton();
    createFilterModal();
    updateFilterDisplay();
    
    // Listen for filter changes
    window.addEventListener('globalFilterChanged', () => {
        updateFilterDisplay();
    });
}

// Create the filter button in the header
function createFilterButton() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Find the right side of the header (where user menu is)
    const headerRight = header.querySelector('.flex.items-center.gap-4');
    if (!headerRight) return;
    
    // Create filter button
    const filterButton = document.createElement('button');
    filterButton.id = 'global-filter-btn';
    filterButton.className = 'flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors';
    filterButton.innerHTML = `
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span id="filter-label" class="text-sm font-medium text-gray-700"></span>
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    `;
    
    filterButton.onclick = () => openFilterModal();
    
    // Insert before the user menu
    const userMenu = headerRight.querySelector('[onclick*="toggleUserMenu"]');
    if (userMenu) {
        headerRight.insertBefore(filterButton, userMenu);
    } else {
        headerRight.appendChild(filterButton);
    }
}

// Create the filter modal
function createFilterModal() {
    const modal = document.createElement('div');
    modal.id = 'global-filter-modal';
    modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.onclick = (e) => {
        if (e.target === modal) closeFilterModal();
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 class="text-2xl font-bold text-gray-900">Date Filter</h2>
                <button onclick="closeFilterModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Content -->
            <div class="p-6">
                <!-- Quick Filters -->
                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Quick Filters</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <button onclick="applyGlobalQuickFilter('today')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Today
                        </button>
                        <button onclick="applyGlobalQuickFilter('yesterday')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Yesterday
                        </button>
                        <button onclick="applyGlobalQuickFilter('this-week')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            This Week
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-week')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last Week
                        </button>
                        <button onclick="applyGlobalQuickFilter('this-month')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            This Month
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-month')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last Month
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-30-days')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last 30 Days
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-60-days')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last 60 Days
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-90-days')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last 90 Days
                        </button>
                        <button onclick="applyGlobalQuickFilter('this-quarter')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            This Quarter
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-quarter')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last Quarter
                        </button>
                        <button onclick="applyGlobalQuickFilter('this-year')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            This Year
                        </button>
                        <button onclick="applyGlobalQuickFilter('last-year')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            Last Year
                        </button>
                        <button onclick="applyGlobalQuickFilter('all-time')" class="quick-filter-btn px-4 py-3 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all">
                            All Time
                        </button>
                    </div>
                </div>
                
                <!-- Custom Range -->
                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Custom Date Range</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" id="custom-start-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" id="custom-end-date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        </div>
                    </div>
                    <button onclick="applyCustomDateRange()" class="mt-4 w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Apply Custom Range
                    </button>
                </div>
                
                <!-- Current Filter Info -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-blue-900">Current Filter</p>
                            <p id="current-filter-display" class="text-sm text-blue-700 mt-1"></p>
                            <p class="text-xs text-blue-600 mt-2">This filter applies to all pages: Dashboard, Income, Expenses, and Balance Sheet.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
                <button onclick="clearGlobalFilter()" class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                    Clear Filter
                </button>
                <button onclick="closeFilterModal()" class="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                    Done
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Open filter modal
function openFilterModal() {
    const modal = document.getElementById('global-filter-modal');
    if (modal) {
        modal.classList.remove('hidden');
        updateCurrentFilterDisplay();
        
        // Pre-fill custom date inputs if custom range is active
        const filter = GlobalDateFilter.getFilter();
        if (filter.type === 'custom') {
            document.getElementById('custom-start-date').value = filter.startDate || '';
            document.getElementById('custom-end-date').value = filter.endDate || '';
        }
    }
}

// Close filter modal
function closeFilterModal() {
    const modal = document.getElementById('global-filter-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Apply quick filter
function applyGlobalQuickFilter(type) {
    GlobalDateFilter.setQuickFilter(type);
    closeFilterModal();
    
    // Reload current page data
    reloadPageData();
}

// Apply custom date range
function applyCustomDateRange() {
    const startDate = document.getElementById('custom-start-date').value;
    const endDate = document.getElementById('custom-end-date').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        alert('Start date must be before end date');
        return;
    }
    
    GlobalDateFilter.setCustomRange(startDate, endDate);
    closeFilterModal();
    
    // Reload current page data
    reloadPageData();
}

// Clear global filter
function clearGlobalFilter() {
    GlobalDateFilter.clearFilter();
    closeFilterModal();
    
    // Reload current page data
    reloadPageData();
}

// Update filter display in button
function updateFilterDisplay() {
    const label = document.getElementById('filter-label');
    if (label) {
        label.textContent = GlobalDateFilter.getDisplayLabel();
    }
}

// Update current filter display in modal
function updateCurrentFilterDisplay() {
    const display = document.getElementById('current-filter-display');
    if (display) {
        const filter = GlobalDateFilter.getFilter();
        if (filter.startDate && filter.endDate) {
            const start = new Date(filter.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const end = new Date(filter.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            display.textContent = `${start} to ${end}`;
        } else {
            display.textContent = filter.label;
        }
    }
}

// Reload page data based on current page
function reloadPageData() {
    // Check which page we're on and call the appropriate reload function
    if (typeof loadDashboardData === 'function') {
        loadDashboardData();
    }
    if (typeof loadBalanceSheetData === 'function') {
        loadBalanceSheetData();
    }
    if (typeof loadIncomeData === 'function') {
        loadIncomeData();
    }
    if (typeof loadExpenseData === 'function') {
        loadExpenseData();
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalFilterUI);
} else {
    initGlobalFilterUI();
}

