/**
 * SMART MODAL ENHANCEMENTS FOR CHAUFLOW
 * 
 * Features:
 * - Autocomplete with fuzzy search
 * - Tooltips for each category
 * - Recently used items
 * - Smart vendor suggestions
 * - Dynamic placeholders
 * - Context-aware help text
 * - Mobile-optimized
 */

// ============================================
// DATA DEFINITIONS
// ============================================

// Income sources with descriptions and recently used tracking
const INCOME_SOURCES = [
    // PRIMARY DRIVING INCOME
    {
        value: 'Rideshare App Income',
        label: 'Rideshare App Income',
        description: 'Paid by platforms like Uber, Lyft, Via, Revel, etc. (1099 income)',
        keywords: ['uber', 'lyft', 'via', 'revel', 'rideshare', 'ride', 'trip', 'ridehailing', 'platform'],
        placeholder: 'e.g., Evening shift on Uber, 12 rides',
        autoSuggestTriggers: ['uber', 'lyft', 'via', 'revel', 'rideshare']
    },
    {
        value: 'Black Car Jobs',
        label: 'Black Car Jobs',
        description: 'Chauffeur jobs contracted by dispatch services, limo companies, or agencies',
        keywords: ['black', 'car', 'chauffeur', 'luxury', 'limo', 'dispatch', 'moovs', 'agency'],
        placeholder: 'e.g., Limo dispatch job to corporate event',
        autoSuggestTriggers: ['chauffeur', 'limo', 'dispatcher', 'black car', 'dispatch', 'moovs']
    },
    {
        value: 'Direct Client Income',
        label: 'Direct Client Income',
        description: 'Trips arranged directly via phone/text or personal referral (cash/Zelle)',
        keywords: ['direct', 'client', 'personal', 'zelle', 'cash', 'venmo', 'phone', 'text', 'referral'],
        placeholder: 'e.g., Regular client paid via Zelle',
        autoSuggestTriggers: ['zelle', 'cash', 'direct', 'venmo', 'personal client']
    },
    {
        value: 'Airport Transfers',
        label: 'Airport Transfers',
        description: 'Premium pricing for JFK, LGA, EWR, and other airport runs',
        keywords: ['airport', 'jfk', 'lga', 'ewr', 'transfer', 'pickup', 'dropoff'],
        placeholder: 'e.g., JFK pickup for business client',
        autoSuggestTriggers: ['airport', 'jfk', 'lga', 'ewr', 'airport run']
    },
    {
        value: 'Hourly Charters',
        label: 'Hourly Charters',
        description: 'Hourly hires for weddings, concerts, corporate clients',
        keywords: ['hourly', 'charter', 'wedding', 'concert', 'corporate', 'event', 'hire'],
        placeholder: 'e.g., 4-hour wedding charter',
        autoSuggestTriggers: ['hourly', 'charter', 'wedding', 'concert']
    },
    {
        value: 'Long-Distance Trips',
        label: 'Long-Distance Trips',
        description: 'Out-of-state trips (NYC → Boston, Philly, DC) with premium pricing',
        keywords: ['long', 'distance', 'out of state', 'boston', 'philly', 'dc', 'interstate'],
        placeholder: 'e.g., NYC to Boston trip',
        autoSuggestTriggers: ['boston', 'philadelphia', 'philly', 'dc', 'long distance', 'out of state']
    },
    
    // TIPS & BONUSES
    {
        value: 'Cash Tips',
        label: 'Cash Tips',
        description: 'Cash tips not automatically recorded by platforms',
        keywords: ['cash', 'tip', 'tips', 'gratuity', 'cash tip'],
        placeholder: 'e.g., Cash tips from 5 rides today',
        autoSuggestTriggers: ['cash tip', 'tipped cash', 'gratuity']
    },
    {
        value: 'Digital Tips',
        label: 'Digital Tips',
        description: 'Tips sent through apps like Uber or Lyft',
        keywords: ['digital', 'tip', 'app tip', 'in-app', 'platform tip'],
        placeholder: 'e.g., In-app tips from Uber rides',
        autoSuggestTriggers: ['in-app tip', 'digital tip', 'app tip']
    },
    {
        value: 'Referral Bonuses',
        label: 'Referral Bonuses',
        description: 'Paid by platforms for referring new drivers or completing challenges',
        keywords: ['referral', 'bonus', 'refer', 'challenge', 'driver referral'],
        placeholder: 'e.g., Driver referral bonus from Uber',
        autoSuggestTriggers: ['referral', 'refer bonus', 'driver referral']
    },
    {
        value: 'Platform Bonuses',
        label: 'Platform Bonuses',
        description: 'Weekly streaks, surge bonuses, or boost zones',
        keywords: ['bonus', 'streak', 'surge', 'boost', 'quest', 'incentive', 'promo'],
        placeholder: 'e.g., Weekend streak bonus completed',
        autoSuggestTriggers: ['streak', 'surge', 'boost', 'quest']
    },
    
    // MISCELLANEOUS INCOME
    {
        value: 'Wait Time Charges',
        label: 'Wait Time Charges',
        description: 'Charged for delays beyond grace period',
        keywords: ['wait', 'waiting', 'wait time', 'delay', 'wait fee'],
        placeholder: 'e.g., 15 min wait time charge',
        autoSuggestTriggers: ['wait time', 'waiting fee', 'wait charge']
    },
    {
        value: 'Additional Stop Fees',
        label: 'Additional Stop Fees',
        description: 'Extra stops or route changes during trip',
        keywords: ['stop', 'detour', 'extra stop', 'additional', 'route change'],
        placeholder: 'e.g., Extra stop fee for 2 locations',
        autoSuggestTriggers: ['extra stop', 'additional stop', 'detour']
    },
    {
        value: 'Toll Reimbursements',
        label: 'Toll Reimbursements',
        description: 'Clients reimburse tolls manually (separate from fare)',
        keywords: ['toll', 'reimbursement', 'reimburse', 'toll refund'],
        placeholder: 'e.g., Client reimbursed GWB toll',
        autoSuggestTriggers: ['toll reimbursement', 'reimburse toll']
    },
    {
        value: 'Cancellation Fees',
        label: 'Cancellation Fees',
        description: 'Driver keeps part of fare if client cancels late',
        keywords: ['cancel', 'cancellation', 'no show', 'noshow', 'late cancel'],
        placeholder: 'e.g., Late cancellation fee earned',
        autoSuggestTriggers: ['cancellation', 'cancelled', 'no show']
    },
    {
        value: 'Event Package Income',
        label: 'Event Package Income',
        description: 'Wedding, prom, wine tours with bundled hourly service',
        keywords: ['event', 'package', 'wedding', 'prom', 'wine tour', 'bundle'],
        placeholder: 'e.g., Prom night package 6 hours',
        autoSuggestTriggers: ['prom', 'wine tour', 'event package']
    },
    
    // OPTIONAL INCOME
    {
        value: 'Vehicle Rental Income',
        label: 'Vehicle Rental Income',
        description: 'Rent your car to other drivers',
        keywords: ['rental', 'rent', 'car rental', 'vehicle rental', 'lease out'],
        placeholder: 'e.g., Weekly car rental to driver',
        autoSuggestTriggers: ['rent car', 'rental income', 'lease car']
    },
    {
        value: 'Vehicle Advertising',
        label: 'Vehicle Advertising',
        description: 'Run ads on your vehicle (Wrapify, Carvertise)',
        keywords: ['advertising', 'ad', 'wrap', 'wrapify', 'carvertise', 'car ad'],
        placeholder: 'e.g., Monthly ad payment from Wrapify',
        autoSuggestTriggers: ['wrapify', 'carvertise', 'car ad', 'vehicle ad']
    },
    {
        value: 'Other Income',
        label: 'Other Income',
        description: 'Misc work like delivery driving or other business income',
        keywords: ['other', 'misc', 'miscellaneous', 'doordash', 'ubereats', 'delivery'],
        placeholder: 'e.g., Describe your income source',
        autoSuggestTriggers: []
    }
];

// Expense categories with descriptions, tax info, and vendor suggestions
const EXPENSE_CATEGORIES = [
    {
        value: 'Gas',
        label: 'Gas',
        description: 'Fuel for your vehicle (fully tax deductible)',
        keywords: ['gas', 'fuel', 'fill', 'fillup', 'petrol', 'bp', 'shell', 'exxon'],
        placeholder: 'e.g., Fill-up near LGA, premium gas',
        vendors: ['Shell', 'BP', 'Exxon', 'Mobil', 'Chevron', 'Sunoco', 'Citgo', 'Speedway'],
        taxDeductible: 'full'
    },
    {
        value: 'Tolls',
        label: 'Tolls',
        description: 'Highway tolls and bridge fees (fully tax deductible)',
        keywords: ['toll', 'bridge', 'tunnel', 'ezpass', 'turnpike'],
        placeholder: 'e.g., GWB toll, 3 trips',
        vendors: ['E-ZPass', 'SunPass', 'FasTrak', 'TxTag'],
        taxDeductible: 'full'
    },
    {
        value: 'Parking',
        label: 'Parking',
        description: 'Parking fees and garage charges (fully tax deductible)',
        keywords: ['parking', 'park', 'garage', 'lot', 'meter'],
        placeholder: 'e.g., Manhattan garage before pickup',
        vendors: ['ParkWhiz', 'SpotHero', 'Icon Parking', 'Impark'],
        taxDeductible: 'full'
    },
    {
        value: 'Car Wash',
        label: 'Car Wash',
        description: 'Vehicle washing and cleaning services (fully tax deductible)',
        keywords: ['wash', 'car wash', 'clean', 'detail', 'detailing', 'vacuum'],
        placeholder: 'e.g., Deluxe wash & vacuum',
        vendors: ['Delta Sonic', 'Splash Car Wash', 'Auto Spa', 'Mr. Clean Car Wash'],
        taxDeductible: 'full'
    },
    {
        value: 'Maintenance & Repairs',
        label: 'Maintenance & Repairs',
        description: 'Oil changes, tire rotation, brake service, repairs (fully tax deductible)',
        keywords: ['maintenance', 'repair', 'oil', 'tire', 'brake', 'fix', 'service'],
        placeholder: 'e.g., Oil change & tire rotation',
        vendors: ['Jiffy Lube', 'Pep Boys', 'Midas', 'Firestone', 'Valvoline'],
        taxDeductible: 'full'
    },
    {
        value: 'Insurance',
        label: 'Insurance',
        description: 'Vehicle insurance premiums (fully tax deductible)',
        keywords: ['insurance', 'premium', 'coverage', 'policy'],
        placeholder: 'e.g., Monthly car insurance payment',
        vendors: ['Geico', 'State Farm', 'Progressive', 'Allstate', 'USAA'],
        taxDeductible: 'full'
    },
    {
        value: 'Car Payment',
        label: 'Car Payment',
        description: 'Monthly car loan or lease payment (interest portion may be deductible)',
        keywords: ['payment', 'loan', 'lease', 'financing', 'car payment'],
        placeholder: 'e.g., Monthly lease payment',
        vendors: [],
        taxDeductible: 'partial'
    },
    {
        value: 'Phone Bill',
        label: 'Phone Bill',
        description: 'Mobile phone service for business use (business portion deductible)',
        keywords: ['phone', 'cell', 'mobile', 'wireless', 'data', 'service'],
        placeholder: 'e.g., Monthly phone plan',
        vendors: ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'],
        taxDeductible: 'partial'
    },
    {
        value: 'Supplies',
        label: 'Supplies',
        description: 'Water, mints, napkins, chargers, wipes for passengers (fully tax deductible)',
        keywords: ['supplies', 'water', 'mint', 'napkin', 'charger', 'wipes', 'tissue'],
        placeholder: 'e.g., Water bottles & phone chargers',
        vendors: ['Amazon', 'Costco', 'Sam\'s Club', 'Target', 'Walmart'],
        taxDeductible: 'full'
    },
    {
        value: 'Meals',
        label: 'Meals',
        description: 'Business meals are typically 50% deductible. Meals during shift or while traveling for work may qualify.',
        keywords: ['meal', 'meals', 'food', 'lunch', 'dinner', 'breakfast', 'eat', 'restaurant'],
        placeholder: 'e.g., Lunch during 12-hour shift',
        vendors: ['McDonald\'s', 'Subway', 'Chipotle', 'Starbucks', 'Dunkin\'', 'Panera Bread', 'Chick-fil-A', 'Wendy\'s'],
        taxDeductible: 'partial'
    },
    {
        value: 'Other',
        label: 'Other',
        description: 'Any other business expense not listed above',
        keywords: ['other', 'misc', 'miscellaneous'],
        placeholder: 'e.g., Describe your expense',
        vendors: [],
        taxDeductible: 'varies'
    }
];

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

function getRecentlyUsed(type) {
    const key = `chauflow_recent_${type}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function addToRecentlyUsed(type, value) {
    const key = `chauflow_recent_${type}`;
    let recent = getRecentlyUsed(type);
    
    // Remove if already exists
    recent = recent.filter(item => item !== value);
    
    // Add to front
    recent.unshift(value);
    
    // Keep only top 5
    recent = recent.slice(0, 5);
    
    localStorage.setItem(key, JSON.stringify(recent));
}

function getRecentVendors(category) {
    const key = `chauflow_vendors_${category}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function addRecentVendor(category, vendor) {
    if (!vendor || vendor.trim() === '') return;
    
    const key = `chauflow_vendors_${category}`;
    let vendors = getRecentVendors(category);
    
    // Remove if already exists
    vendors = vendors.filter(v => v.toLowerCase() !== vendor.toLowerCase());
    
    // Add to front
    vendors.unshift(vendor);
    
    // Keep only top 10
    vendors = vendors.slice(0, 10);
    
    localStorage.setItem(key, JSON.stringify(vendors));
}

function getLastUsedDate() {
    return localStorage.getItem('chauflow_last_date') || '';
}

function setLastUsedDate(date) {
    localStorage.setItem('chauflow_last_date', date);
}

// ============================================
// FUZZY SEARCH HELPER
// ============================================

function fuzzyMatch(search, target) {
    const searchLower = search.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Exact match
    if (targetLower.includes(searchLower)) {
        return true;
    }
    
    // Check keywords
    return false;
}

function searchItems(query, items) {
    if (!query || query.length === 0) {
        return items;
    }
    
    const queryLower = query.toLowerCase();
    
    return items.filter(item => {
        // Check label
        if (item.label.toLowerCase().includes(queryLower)) {
            return true;
        }
        
        // Check keywords
        if (item.keywords && item.keywords.some(kw => kw.includes(queryLower))) {
            return true;
        }
        
        return false;
    });
}

// ============================================
// AUTOCOMPLETE DROPDOWN CREATOR
// ============================================

function createAutocompleteDropdown(inputId, items, type, onSelect) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Create dropdown container
    const dropdownId = `${inputId}-dropdown`;
    let dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = dropdownId;
        dropdown.className = 'absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto hidden';
        input.parentElement.classList.add('relative');
        input.parentElement.appendChild(dropdown);
    }
    
    function updateDropdown(searchQuery = '') {
        const recentItems = getRecentlyUsed(type);
        const filteredItems = searchQuery ? searchItems(searchQuery, items) : items;
        
        let html = '';
        
        // Recently used section
        if (!searchQuery && recentItems.length > 0) {
            html += '<div class="px-3 py-2 bg-gray-50 border-b border-gray-200"><p class="text-xs font-semibold text-gray-600">Recently Used</p></div>';
            
            recentItems.forEach(recentValue => {
                const item = items.find(i => i.value === recentValue);
                if (item) {
                    html += createDropdownItem(item, true);
                }
            });
            
            if (filteredItems.length > 0) {
                html += '<div class="px-3 py-2 bg-gray-50 border-b border-gray-200"><p class="text-xs font-semibold text-gray-600">All Options</p></div>';
            }
        }
        
        // All items (filtered)
        filteredItems.forEach(item => {
            if (!recentItems.includes(item.value) || searchQuery) {
                html += createDropdownItem(item, false);
            }
        });
        
        if (html === '') {
            html = '<div class="px-4 py-3 text-sm text-gray-500 text-center">No matches found</div>';
        }
        
        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
        
        // Add click handlers
        dropdown.querySelectorAll('[data-value]').forEach(el => {
            el.addEventListener('click', () => {
                const value = el.dataset.value;
                const selectedItem = items.find(i => i.value === value);
                input.value = value;
                onSelect(selectedItem);
                addToRecentlyUsed(type, value);
                dropdown.classList.add('hidden');
            });
        });
    }
    
    function createDropdownItem(item, isRecent) {
        const taxBadge = item.taxDeductible === 'full' 
            ? '<span class="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Tax Deductible</span>'
            : item.taxDeductible === 'partial'
            ? '<span class="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Partial</span>'
            : '';
        
        const recentBadge = isRecent 
            ? '<svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            : '';
        
        return `
            <div data-value="${item.value}" class="px-4 py-3 hover:bg-blue-50 cursor-pointer group border-b border-gray-100 last:border-0">
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1">
                        ${recentBadge}
                        <span class="font-medium text-gray-900">${item.label}</span>
                    </div>
                    ${taxBadge}
                    <button 
                        type="button"
                        class="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        onclick="event.stopPropagation(); showTooltip('${item.description.replace(/'/g, "\\'")}')"
                        title="More info"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-1 pl-6">${item.description}</p>
            </div>
        `;
    }
    
    // Event listeners
    input.addEventListener('focus', () => updateDropdown(input.value));
    input.addEventListener('input', (e) => updateDropdown(e.target.value));
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    return { updateDropdown, dropdown };
}

// ============================================
// VENDOR AUTOCOMPLETE
// ============================================

function createVendorAutocomplete(vendorInputId, categorySelectId) {
    const vendorInput = document.getElementById(vendorInputId);
    const categorySelect = document.getElementById(categorySelectId);
    
    if (!vendorInput || !categorySelect) return;
    
    const dropdownId = `${vendorInputId}-dropdown`;
    let dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = dropdownId;
        dropdown.className = 'absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto hidden';
        vendorInput.parentElement.classList.add('relative');
        vendorInput.parentElement.appendChild(dropdown);
    }
    
    function updateVendorSuggestions() {
        const category = categorySelect.value;
        const categoryData = EXPENSE_CATEGORIES.find(c => c.value === category);
        const searchQuery = vendorInput.value.toLowerCase();
        
        if (!categoryData) {
            dropdown.classList.add('hidden');
            return;
        }
        
        // Combine default vendors and recent vendors
        const defaultVendors = categoryData.vendors || [];
        const recentVendors = getRecentVendors(category);
        const allVendors = [...new Set([...recentVendors, ...defaultVendors])];
        
        // Filter by search query
        const filteredVendors = searchQuery 
            ? allVendors.filter(v => v.toLowerCase().includes(searchQuery))
            : allVendors;
        
        if (filteredVendors.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }
        
        let html = '';
        filteredVendors.slice(0, 8).forEach((vendor, index) => {
            const isRecent = recentVendors.includes(vendor);
            const recentIcon = isRecent 
                ? '<svg class="w-3 h-3 text-blue-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                : '';
            
            html += `
                <div data-vendor="${vendor}" class="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-sm border-b border-gray-100 last:border-0">
                    ${recentIcon}
                    <span class="text-gray-900">${vendor}</span>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
        
        // Add click handlers
        dropdown.querySelectorAll('[data-vendor]').forEach(el => {
            el.addEventListener('click', () => {
                vendorInput.value = el.dataset.vendor;
                addRecentVendor(category, el.dataset.vendor);
                dropdown.classList.add('hidden');
            });
        });
    }
    
    vendorInput.addEventListener('focus', updateVendorSuggestions);
    vendorInput.addEventListener('input', updateVendorSuggestions);
    categorySelect.addEventListener('change', () => {
        vendorInput.value = ''; // Clear vendor when category changes
        updateVendorSuggestions();
    });
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!vendorInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

// ============================================
// DYNAMIC PLACEHOLDER UPDATER
// ============================================

function setupDynamicPlaceholder(selectId, descriptionInputId, items) {
    const select = document.getElementById(selectId);
    const description = document.getElementById(descriptionInputId);
    
    if (!select || !description) return;
    
    select.addEventListener('change', () => {
        const selectedValue = select.value;
        const item = items.find(i => i.value === selectedValue);
        
        if (item && item.placeholder) {
            description.placeholder = item.placeholder;
        } else {
            description.placeholder = 'e.g., Add more details here';
        }
    });
}

// ============================================
// TOOLTIP HELPER
// ============================================

function showTooltip(message) {
    // Create or get tooltip element
    let tooltip = document.getElementById('smart-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'smart-tooltip';
        tooltip.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl max-w-sm text-sm';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = message;
    tooltip.classList.remove('hidden');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        tooltip.classList.add('hidden');
    }, 4000);
}

// ============================================
// DATE AUTOFILL
// ============================================

function setupDateAutofill(dateInputId) {
    const dateInput = document.getElementById(dateInputId);
    if (!dateInput) return;
    
    // Pre-fill with last used date or today
    const lastDate = getLastUsedDate();
    const today = new Date().toISOString().split('T')[0];
    
    if (lastDate) {
        dateInput.value = lastDate;
    } else {
        dateInput.value = today;
    }
    
    // Save on change
    dateInput.addEventListener('change', () => {
        setLastUsedDate(dateInput.value);
    });
}

// ============================================
// TAX HELPER TEXT
// ============================================

function addTaxHelperText(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const helpText = document.createElement('div');
    helpText.className = 'bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2';
    helpText.innerHTML = `
        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-sm text-blue-800">
            <strong>Tip:</strong> Keeping accurate records here will make tax season easier and help maximize your deductions.
        </p>
    `;
    
    // Insert before submit buttons
    const submitArea = form.querySelector('.flex.gap-3.pt-2');
    if (submitArea) {
        form.insertBefore(helpText, submitArea);
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeSmartModals() {
    console.log('🚀 Initializing Smart Modals...');
    
    // Income modal enhancements
    const incomeSourceInput = document.createElement('input');
    incomeSourceInput.type = 'text';
    incomeSourceInput.id = 'income-source-input';
    incomeSourceInput.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';
    incomeSourceInput.placeholder = 'Type to search income sources...';
    incomeSourceInput.required = true;
    
    const incomeSourceSelect = document.getElementById('income-source');
    if (incomeSourceSelect) {
        incomeSourceSelect.parentElement.replaceChild(incomeSourceInput, incomeSourceSelect);
        
        // Hidden input to store actual value
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'income-source';
        hiddenInput.name = 'income-source';
        incomeSourceInput.parentElement.appendChild(hiddenInput);
        
        createAutocompleteDropdown('income-source-input', INCOME_SOURCES, 'income', (item) => {
            hiddenInput.value = item.value;
            incomeSourceInput.value = item.label;
            
            // Update description placeholder
            const descInput = document.getElementById('income-description');
            if (descInput && item.placeholder) {
                descInput.placeholder = item.placeholder;
            }
        });
    }
    
    // Expense modal enhancements
    const expenseCategoryInput = document.createElement('input');
    expenseCategoryInput.type = 'text';
    expenseCategoryInput.id = 'expense-category-input';
    expenseCategoryInput.className = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';
    expenseCategoryInput.placeholder = 'Type to search expense categories...';
    expenseCategoryInput.required = true;
    
    const expenseCategorySelect = document.getElementById('expense-category');
    if (expenseCategorySelect) {
        expenseCategorySelect.parentElement.replaceChild(expenseCategoryInput, expenseCategorySelect);
        
        // Hidden input to store actual value
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'expense-category';
        hiddenInput.name = 'expense-category';
        expenseCategoryInput.parentElement.appendChild(hiddenInput);
        
        createAutocompleteDropdown('expense-category-input', EXPENSE_CATEGORIES, 'expense', (item) => {
            hiddenInput.value = item.value;
            expenseCategoryInput.value = item.label;
            
            // Update description placeholder
            const descInput = document.getElementById('expense-description');
            if (descInput && item.placeholder) {
                descInput.placeholder = item.placeholder;
            }
            
            // Trigger vendor suggestions update
            const vendorInput = document.getElementById('expense-vendor');
            if (vendorInput) {
                vendorInput.focus();
                vendorInput.blur();
            }
        });
    }
    
    // Vendor autocomplete (needs hidden category select for compatibility)
    const categoryHiddenSelect = document.createElement('select');
    categoryHiddenSelect.id = 'expense-category-hidden-select';
    categoryHiddenSelect.className = 'hidden';
    categoryHiddenSelect.innerHTML = EXPENSE_CATEGORIES.map(cat => 
        `<option value="${cat.value}">${cat.label}</option>`
    ).join('');
    document.body.appendChild(categoryHiddenSelect);
    
    // Sync hidden select with hidden input
    const categoryHiddenInput = document.getElementById('expense-category');
    if (categoryHiddenInput) {
        new MutationObserver(() => {
            categoryHiddenSelect.value = categoryHiddenInput.value;
        }).observe(categoryHiddenInput, { attributes: true, attributeFilter: ['value'] });
    }
    
    createVendorAutocomplete('expense-vendor', 'expense-category-hidden-select');
    
    // Date autofill
    setupDateAutofill('income-date');
    setupDateAutofill('expense-date');
    
    // Tax helper text
    addTaxHelperText('income-form');
    addTaxHelperText('expense-form');
    
    // Setup description-based auto-suggestions for income
    setupDescriptionAutoSuggest();
    
    console.log('✅ Smart Modals initialized successfully!');
}

// ============================================
// DESCRIPTION-BASED AUTO-SUGGESTION
// ============================================

function setupDescriptionAutoSuggest() {
    const incomeDescInput = document.getElementById('income-description');
    const incomeSourceHidden = document.getElementById('income-source');
    const incomeSourceInput = document.getElementById('income-source-input');
    
    if (!incomeDescInput || !incomeSourceHidden) return;
    
    let suggestionTimeout;
    let suggestionPopup = null;
    
    incomeDescInput.addEventListener('input', (e) => {
        clearTimeout(suggestionTimeout);
        
        // Only suggest if source is not already selected
        if (incomeSourceHidden.value) return;
        
        const description = e.target.value.toLowerCase();
        if (description.length < 3) {
            if (suggestionPopup) suggestionPopup.remove();
            return;
        }
        
        suggestionTimeout = setTimeout(() => {
            // Find matching income source based on auto-suggest triggers
            let matchedSource = null;
            
            for (const source of INCOME_SOURCES) {
                if (source.autoSuggestTriggers && source.autoSuggestTriggers.length > 0) {
                    for (const trigger of source.autoSuggestTriggers) {
                        if (description.includes(trigger.toLowerCase())) {
                            matchedSource = source;
                            break;
                        }
                    }
                }
                if (matchedSource) break;
            }
            
            if (matchedSource) {
                showAutoSuggestion(matchedSource, incomeSourceInput, incomeSourceHidden);
            } else {
                if (suggestionPopup) suggestionPopup.remove();
            }
        }, 500); // Wait 500ms after user stops typing
    });
    
    function showAutoSuggestion(source, sourceInput, sourceHidden) {
        // Remove existing popup
        if (suggestionPopup) suggestionPopup.remove();
        
        // Create suggestion popup
        suggestionPopup = document.createElement('div');
        suggestionPopup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] bg-white border-2 border-blue-500 rounded-xl shadow-2xl p-6 max-w-md animate-bounce-in';
        suggestionPopup.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-900 mb-1">Smart Suggestion</h4>
                    <p class="text-sm text-gray-600 mb-3">
                        Looks like this might be <strong class="text-blue-600">"${source.label}"</strong>. 
                        Use this category?
                    </p>
                    <p class="text-xs text-gray-500 mb-4 italic">${source.description}</p>
                    <div class="flex gap-2">
                        <button 
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                            onclick="acceptAutoSuggestion('${source.value}', '${source.label}')"
                        >
                            Yes, Use This
                        </button>
                        <button 
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                            onclick="dismissAutoSuggestion()"
                        >
                            No Thanks
                        </button>
                    </div>
                </div>
                <button 
                    class="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    onclick="dismissAutoSuggestion()"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(suggestionPopup);
        
        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            if (suggestionPopup && suggestionPopup.parentElement) {
                suggestionPopup.remove();
            }
        }, 8000);
    }
    
    // Make functions global for onclick handlers
    window.acceptAutoSuggestion = (value, label) => {
        if (incomeSourceHidden && incomeSourceInput) {
            incomeSourceHidden.value = value;
            incomeSourceInput.value = label;
            
            // Update placeholder
            const source = INCOME_SOURCES.find(s => s.value === value);
            if (source && source.placeholder) {
                incomeDescInput.placeholder = source.placeholder;
            }
            
            // Add to recently used
            addToRecentlyUsed('income', value);
        }
        if (suggestionPopup) suggestionPopup.remove();
    };
    
    window.dismissAutoSuggestion = () => {
        if (suggestionPopup) suggestionPopup.remove();
    };
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSmartModals);
} else {
    initializeSmartModals();
}

