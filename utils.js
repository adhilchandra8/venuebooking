// Utility Functions

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format Time
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    
    const time = new Date(`2000-01-01T${timeString}`);
    if (isNaN(time.getTime())) return timeString;
    
    return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Debounce Function
function debounce(func, wait) {
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

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Validate Email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate Phone
function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Generate Unique ID
function generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save to LocalStorage with expiration
function saveToLocalStorage(key, data, expirationMinutes = null) {
    const item = {
        data: data,
        timestamp: new Date().getTime()
    };
    
    if (expirationMinutes) {
        item.expires = expirationMinutes * 60 * 1000;
    }
    
    localStorage.setItem(key, JSON.stringify(item));
}

// Get from LocalStorage with expiration check
function getFromLocalStorage(key) {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
        return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    if (item.expires && now - item.timestamp > item.expires) {
        localStorage.removeItem(key);
        return null;
    }
    
    return item.data;
}

// Show Loading Spinner
function showLoading(container) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner"></div>
        <p>Loading...</p>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .loading-spinner {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    if (container) {
        container.innerHTML = '';
        container.appendChild(spinner);
    }
    
    return spinner;
}

// Hide Loading Spinner
function hideLoading(spinner) {
    if (spinner && spinner.parentNode) {
        spinner.remove();
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Download File
function downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// Parse Query Parameters
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// Update Query Parameters
function updateQueryParams(params) {
    const url = new URL(window.location);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    });
    
    window.history.pushState({}, '', url.toString());
}

// Scroll to Element
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Check if Element is in Viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Toggle Dark Mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('darkModeChange', { detail: isDarkMode }));
}

// Initialize Dark Mode
function initializeDarkMode() {
    const darkModePref = localStorage.getItem('darkMode');
    
    if (darkModePref === 'true' || 
        (darkModePref === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }
}

// Add dark mode styles
function addDarkModeStyles() {
    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.textContent = `
        .dark-mode {
            --primary-color: #6c8bff;
            --primary-dark: #5a7aff;
            --secondary-color: #868e96;
            --light-color: #343a40;
            --dark-color: #f8f9fa;
            --gray-color: #adb5bd;
            --light-gray: #495057;
            --border-color: #495057;
            background-color: #212529;
            color: #f8f9fa;
        }
        
        .dark-mode .navbar,
        .dark-mode .auth-card,
        .dark-mode .venue-card,
        .dark-mode .dashboard-section,
        .dark-mode .modal-content,
        .dark-mode .admin-stat,
        .dark-mode .chart-container,
        .dark-mode .report-table,
        .dark-mode .insight-card,
        .dark-mode .feature-card,
        .dark-mode .module-card,
        .dark-mode .stat-card {
            background-color: #343a40;
            color: #f8f9fa;
        }
        
        .dark-mode .form-control,
        .dark-mode .form-select {
            background-color: #495057;
            border-color: #6c757d;
            color: #f8f9fa;
        }
        
        .dark-mode .form-control:focus,
        .dark-mode .form-select:focus {
            border-color: var(--primary-color);
            background-color: #495057;
        }
    `;
    document.head.appendChild(style);
}

// Initialize utilities
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initializeDarkMode();
    addDarkModeStyles();
    
    // Add dark mode toggle button if not exists
    if (!document.getElementById('darkModeToggle')) {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.id = 'darkModeToggle';
        darkModeToggle.className = 'btn btn-sm btn-outline';
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.title = 'Toggle dark mode';
        darkModeToggle.style.position = 'fixed';
        darkModeToggle.style.bottom = '20px';
        darkModeToggle.style.right = '20px';
        darkModeToggle.style.zIndex = '1000';
        
        darkModeToggle.addEventListener('click', toggleDarkMode);
        document.body.appendChild(darkModeToggle);
    }
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.media = 'print';
    printStyles.textContent = `
        @media print {
            .navbar, .footer, .no-print {
                display: none !important;
            }
            
            body {
                background-color: white !important;
                color: black !important;
            }
            
            .modal {
                position: static !important;
                background-color: white !important;
            }
            
            .modal-content {
                box-shadow: none !important;
                border: 1px solid #000 !important;
            }
        }
    `;
    document.head.appendChild(printStyles);
});

// Export utilities for use in other modules
window.Utils = {
    formatDate,
    formatTime,
    formatCurrency,
    debounce,
    throttle,
    validateEmail,
    validatePhone,
    generateId,
    saveToLocalStorage,
    getFromLocalStorage,
    showLoading,
    hideLoading,
    copyToClipboard,
    downloadFile,
    getQueryParams,
    updateQueryParams,
    scrollToElement,
    isInViewport,
    toggleDarkMode
};