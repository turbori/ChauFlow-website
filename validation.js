// ============================================
// ChauFlow - Custom Validation & Error Messages
// ============================================

/**
 * Validation utility for ChauFlow forms
 * Provides user-friendly error messages
 */

const ValidationMessages = {
    // Income validation
    income: {
        amount: {
            required: 'Please enter the income amount',
            invalid: 'Please enter a valid dollar amount (e.g., 45.50)',
            min: 'Income amount must be greater than $0',
            max: 'Income amount cannot exceed $99,999,999'
        },
        source: {
            required: 'Please select an income source (e.g., Rideshare, Black Car)',
            invalid: 'Please select a valid income source from the list'
        },
        date: {
            required: 'Please select the date you earned this income',
            invalid: 'Please enter a valid date',
            future: 'Income date cannot be in the future',
            tooOld: 'Income date cannot be more than 10 years in the past'
        },
        trips: {
            invalid: 'Please enter a valid number of trips',
            min: 'Number of trips cannot be negative'
        },
        hours: {
            invalid: 'Please enter valid hours worked (e.g., 8.5)',
            min: 'Hours cannot be negative',
            max: 'Hours cannot exceed 24 per entry'
        },
        miles: {
            invalid: 'Please enter valid miles driven (e.g., 125.5)',
            min: 'Miles cannot be negative',
            max: 'Miles cannot exceed 10,000 per entry'
        }
    },
    
    // Expense validation
    expense: {
        amount: {
            required: 'Please enter the expense amount',
            invalid: 'Please enter a valid dollar amount (e.g., 25.99)',
            min: 'Expense amount must be greater than $0',
            max: 'Expense amount cannot exceed $99,999,999'
        },
        category: {
            required: 'Please select an expense category (e.g., Gas, Tolls)',
            invalid: 'Please select a valid expense category from the list'
        },
        date: {
            required: 'Please select the date of this expense',
            invalid: 'Please enter a valid date',
            future: 'Expense date cannot be in the future',
            tooOld: 'Expense date cannot be more than 10 years in the past'
        },
        vendor: {
            tooLong: 'Vendor name is too long (max 100 characters)'
        },
        description: {
            tooLong: 'Description is too long (max 500 characters)'
        }
    },
    
    // Asset validation
    asset: {
        name: {
            required: 'Please enter a name for this asset (e.g., 2023 Escalade)',
            tooShort: 'Asset name must be at least 2 characters',
            tooLong: 'Asset name is too long (max 100 characters)'
        },
        type: {
            required: 'Please select an asset type',
            invalid: 'Please select a valid asset type from the list'
        },
        value: {
            required: 'Please enter the current value of this asset',
            invalid: 'Please enter a valid dollar amount',
            min: 'Asset value must be greater than $0',
            max: 'Asset value cannot exceed $999,999,999'
        },
        purchaseDate: {
            invalid: 'Please enter a valid purchase date',
            future: 'Purchase date cannot be in the future'
        }
    },
    
    // Liability validation
    liability: {
        name: {
            required: 'Please enter a name for this liability (e.g., Auto Loan - Escalade)',
            tooShort: 'Liability name must be at least 2 characters',
            tooLong: 'Liability name is too long (max 100 characters)'
        },
        type: {
            required: 'Please select a liability type',
            invalid: 'Please select a valid liability type from the list'
        },
        balance: {
            required: 'Please enter the balance owed',
            invalid: 'Please enter a valid dollar amount',
            min: 'Balance must be greater than $0',
            max: 'Balance cannot exceed $999,999,999'
        },
        dueDate: {
            invalid: 'Please enter a valid due date',
            past: 'Due date should not be in the past'
        }
    },
    
    // Date range validation
    dateRange: {
        invalidRange: 'End date must be after start date',
        tooLarge: 'Date range cannot exceed 1 year'
    },
    
    // General validation
    general: {
        networkError: 'Unable to connect. Please check your internet connection.',
        serverError: 'Something went wrong on our end. Please try again.',
        unauthorized: 'Your session has expired. Please log in again.',
        unknown: 'An unexpected error occurred. Please try again.'
    }
};

/**
 * Validate income form data
 * @param {Object} data - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateIncome(data) {
    const errors = {};
    
    // Validate amount
    if (!data.amount || data.amount === '') {
        errors.amount = ValidationMessages.income.amount.required;
    } else {
        const amount = parseFloat(data.amount);
        if (isNaN(amount)) {
            errors.amount = ValidationMessages.income.amount.invalid;
        } else if (amount <= 0) {
            errors.amount = ValidationMessages.income.amount.min;
        } else if (amount > 99999999) {
            errors.amount = ValidationMessages.income.amount.max;
        }
    }
    
    // Validate source
    if (!data.source || data.source === '') {
        errors.source = ValidationMessages.income.source.required;
    }
    
    // Validate date
    if (!data.date || data.date === '') {
        errors.date = ValidationMessages.income.date.required;
    } else {
        const date = new Date(data.date);
        const today = new Date();
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(today.getFullYear() - 10);
        
        if (isNaN(date.getTime())) {
            errors.date = ValidationMessages.income.date.invalid;
        } else if (date > today) {
            errors.date = ValidationMessages.income.date.future;
        } else if (date < tenYearsAgo) {
            errors.date = ValidationMessages.income.date.tooOld;
        }
    }
    
    // Validate optional fields
    if (data.trips && data.trips !== '') {
        const trips = parseInt(data.trips);
        if (isNaN(trips)) {
            errors.trips = ValidationMessages.income.trips.invalid;
        } else if (trips < 0) {
            errors.trips = ValidationMessages.income.trips.min;
        }
    }
    
    if (data.hours && data.hours !== '') {
        const hours = parseFloat(data.hours);
        if (isNaN(hours)) {
            errors.hours = ValidationMessages.income.hours.invalid;
        } else if (hours < 0) {
            errors.hours = ValidationMessages.income.hours.min;
        } else if (hours > 24) {
            errors.hours = ValidationMessages.income.hours.max;
        }
    }
    
    if (data.miles && data.miles !== '') {
        const miles = parseFloat(data.miles);
        if (isNaN(miles)) {
            errors.miles = ValidationMessages.income.miles.invalid;
        } else if (miles < 0) {
            errors.miles = ValidationMessages.income.miles.min;
        } else if (miles > 10000) {
            errors.miles = ValidationMessages.income.miles.max;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * Validate expense form data
 * @param {Object} data - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateExpense(data) {
    const errors = {};
    
    // Validate amount
    if (!data.amount || data.amount === '') {
        errors.amount = ValidationMessages.expense.amount.required;
    } else {
        const amount = parseFloat(data.amount);
        if (isNaN(amount)) {
            errors.amount = ValidationMessages.expense.amount.invalid;
        } else if (amount <= 0) {
            errors.amount = ValidationMessages.expense.amount.min;
        } else if (amount > 99999999) {
            errors.amount = ValidationMessages.expense.amount.max;
        }
    }
    
    // Validate category
    if (!data.category || data.category === '') {
        errors.category = ValidationMessages.expense.category.required;
    }
    
    // Validate date
    if (!data.date || data.date === '') {
        errors.date = ValidationMessages.expense.date.required;
    } else {
        const date = new Date(data.date);
        const today = new Date();
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(today.getFullYear() - 10);
        
        if (isNaN(date.getTime())) {
            errors.date = ValidationMessages.expense.date.invalid;
        } else if (date > today) {
            errors.date = ValidationMessages.expense.date.future;
        } else if (date < tenYearsAgo) {
            errors.date = ValidationMessages.expense.date.tooOld;
        }
    }
    
    // Validate optional fields
    if (data.vendor && data.vendor.length > 100) {
        errors.vendor = ValidationMessages.expense.vendor.tooLong;
    }
    
    if (data.description && data.description.length > 500) {
        errors.description = ValidationMessages.expense.description.tooLong;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * Validate asset form data
 * @param {Object} data - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateAsset(data) {
    const errors = {};
    
    // Validate name
    if (!data.name || data.name === '') {
        errors.name = ValidationMessages.asset.name.required;
    } else if (data.name.length < 2) {
        errors.name = ValidationMessages.asset.name.tooShort;
    } else if (data.name.length > 100) {
        errors.name = ValidationMessages.asset.name.tooLong;
    }
    
    // Validate type
    if (!data.type || data.type === '') {
        errors.type = ValidationMessages.asset.type.required;
    }
    
    // Validate value
    if (!data.value || data.value === '') {
        errors.value = ValidationMessages.asset.value.required;
    } else {
        const value = parseFloat(data.value);
        if (isNaN(value)) {
            errors.value = ValidationMessages.asset.value.invalid;
        } else if (value <= 0) {
            errors.value = ValidationMessages.asset.value.min;
        } else if (value > 999999999) {
            errors.value = ValidationMessages.asset.value.max;
        }
    }
    
    // Validate purchase date if provided
    if (data.purchaseDate && data.purchaseDate !== '') {
        const date = new Date(data.purchaseDate);
        const today = new Date();
        
        if (isNaN(date.getTime())) {
            errors.purchaseDate = ValidationMessages.asset.purchaseDate.invalid;
        } else if (date > today) {
            errors.purchaseDate = ValidationMessages.asset.purchaseDate.future;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * Validate liability form data
 * @param {Object} data - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateLiability(data) {
    const errors = {};
    
    // Validate name
    if (!data.name || data.name === '') {
        errors.name = ValidationMessages.liability.name.required;
    } else if (data.name.length < 2) {
        errors.name = ValidationMessages.liability.name.tooShort;
    } else if (data.name.length > 100) {
        errors.name = ValidationMessages.liability.name.tooLong;
    }
    
    // Validate type
    if (!data.type || data.type === '') {
        errors.type = ValidationMessages.liability.type.required;
    }
    
    // Validate balance
    if (!data.balance || data.balance === '') {
        errors.balance = ValidationMessages.liability.balance.required;
    } else {
        const balance = parseFloat(data.balance);
        if (isNaN(balance)) {
            errors.balance = ValidationMessages.liability.balance.invalid;
        } else if (balance <= 0) {
            errors.balance = ValidationMessages.liability.balance.min;
        } else if (balance > 999999999) {
            errors.balance = ValidationMessages.liability.balance.max;
        }
    }
    
    // Validate due date if provided
    if (data.dueDate && data.dueDate !== '') {
        const date = new Date(data.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(date.getTime())) {
            errors.dueDate = ValidationMessages.liability.dueDate.invalid;
        }
        // Note: We allow past due dates for liabilities
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * Validate date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} { isValid: boolean, error: string }
 */
function validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        return { isValid: true, error: null };
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
        return {
            isValid: false,
            error: ValidationMessages.dateRange.invalidRange
        };
    }
    
    // Check if range is more than 1 year
    const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds
    if (end - start > oneYear) {
        return {
            isValid: false,
            error: ValidationMessages.dateRange.tooLarge
        };
    }
    
    return { isValid: true, error: null };
}

/**
 * Display validation errors in the UI
 * @param {Object} errors - Errors object from validation
 * @param {string} formId - ID of the form
 */
function displayValidationErrors(errors, formId) {
    // Clear previous errors
    const form = document.getElementById(formId);
    if (!form) return;
    
    const errorElements = form.querySelectorAll('.validation-error');
    errorElements.forEach(el => el.remove());
    
    // Add new errors
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (field) {
            // Add error class to field
            field.classList.add('border-red-500', 'focus:ring-red-500');
            
            // Create error message element
            const errorEl = document.createElement('p');
            errorEl.className = 'validation-error text-sm text-red-600 mt-1';
            errorEl.textContent = errors[fieldName];
            
            // Insert after field
            field.parentNode.insertBefore(errorEl, field.nextSibling);
        }
    });
    
    // Scroll to first error
    const firstError = form.querySelector('.validation-error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Clear validation errors from form
 * @param {string} formId - ID of the form
 */
function clearValidationErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Remove error classes
    const fields = form.querySelectorAll('.border-red-500');
    fields.forEach(field => {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
    });
    
    // Remove error messages
    const errorElements = form.querySelectorAll('.validation-error');
    errorElements.forEach(el => el.remove());
}

/**
 * Get user-friendly error message for API errors
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
function getApiErrorMessage(error) {
    if (!error) return ValidationMessages.general.unknown;
    
    // Network errors
    if (!navigator.onLine || error.message === 'Failed to fetch') {
        return ValidationMessages.general.networkError;
    }
    
    // Supabase errors
    if (error.code) {
        switch (error.code) {
            case '401':
            case 'PGRST301':
                return ValidationMessages.general.unauthorized;
            case '500':
            case 'PGRST500':
                return ValidationMessages.general.serverError;
            default:
                return error.message || ValidationMessages.general.unknown;
        }
    }
    
    return error.message || ValidationMessages.general.unknown;
}

