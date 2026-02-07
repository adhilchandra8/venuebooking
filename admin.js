// Admin Panel JavaScript

// Initialize Admin Dashboard
function initializeAdminDashboard() {
    updateAdminStats();
    initializeCharts();
    initializeReports();
}

// Update Admin Stats
function updateAdminStats() {
    // These values would come from an API in production
    const stats = {
        totalVenues: 25,
        activeBookings: 18,
        pendingApprovals: 12,
        totalUsers: 542,
        revenue: 24580,
        utilization: 78.5
    };
    
    // Update stat cards
    document.querySelectorAll('.admin-stat h3').forEach((stat, index) => {
        const values = Object.values(stats);
        if (values[index] !== undefined) {
            stat.textContent = values[index];
        }
    });
}

// Initialize Charts
function initializeCharts() {
    // This would initialize real charts (Chart.js, etc.) in production
    // For demo, we'll just show placeholder charts
    
    const chartContainers = document.querySelectorAll('.chart-placeholder');
    chartContainers.forEach(container => {
        if (!container.querySelector('.chart-mock')) {
            container.innerHTML = `
                <div class="chart-mock">
                    <div class="chart-bars">
                        <div class="bar" style="height: 60%;"></div>
                        <div class="bar" style="height: 80%;"></div>
                        <div class="bar" style="height: 70%;"></div>
                        <div class="bar" style="height: 90%;"></div>
                        <div class="bar" style="height: 75%;"></div>
                        <div class="bar" style="height: 95%;"></div>
                    </div>
                    <div class="chart-labels">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                </div>
            `;
        }
    });
}

// Initialize Reports
function initializeReports() {
    const reportTabs = document.querySelectorAll('.report-tab');
    const reportContents = document.querySelectorAll('.report-content');
    
    if (reportTabs.length > 0) {
        reportTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const reportType = this.getAttribute('data-report');
                
                // Update active tab
                reportTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                reportContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${reportType}-report`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Period selector
    const periodBtns = document.querySelectorAll('.period-btn');
    if (periodBtns.length > 0) {
        periodBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                periodBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const period = this.getAttribute('data-period');
                loadReportData(period);
            });
        });
    }
    
    // Custom period
    const applyCustomBtn = document.getElementById('applyCustom');
    if (applyCustomBtn) {
        applyCustomBtn.addEventListener('click', function() {
            const startDate = document.getElementById('customStart').value;
            const endDate = document.getElementById('customEnd').value;
            
            if (!startDate || !endDate) {
                showNotification('Please select both start and end dates', 'error');
                return;
            }
            
            if (new Date(startDate) > new Date(endDate)) {
                showNotification('Start date must be before end date', 'error');
                return;
            }
            
            loadReportData('custom', { startDate, endDate });
        });
    }
    
    // Print report
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
        printReportBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Export report
    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            showNotification('Report export feature would generate a PDF in production', 'info');
        });
    }
}

// Load Report Data
function loadReportData(period, customDates = null) {
    // This would fetch data from an API based on period
    // For demo, we'll just show a notification
    
    let message = `Loading ${period} report data...`;
    if (period === 'custom' && customDates) {
        message = `Loading report from ${customDates.startDate} to ${customDates.endDate}`;
    }
    
    showNotification(message, 'info');
}

// Conflict Detection
function checkForConflicts(booking) {
    // This would check for overlapping bookings in a real system
    // For demo, we'll simulate some conflicts
    
    const conflicts = [
        {
            id: 'VB-2024-006',
            venue: booking.venueName,
            date: booking.date,
            time: '1 PM - 4 PM',
            user: 'Jane Smith',
            conflictType: 'time-overlap'
        }
    ];
    
    return conflicts.length > 0 ? conflicts : null;
}

// Show Conflict Modal
function showConflictModal(conflicts) {
    const modal = document.getElementById('conflictModal');
    if (!modal) return;
    
    if (conflicts && conflicts.length > 0) {
        const conflict = conflicts[0];
        
        document.getElementById('conflictVenue').textContent = conflict.venue;
        document.getElementById('conflictDate').textContent = formatDate(conflict.date);
        document.getElementById('conflictTime').textContent = conflict.time;
        document.getElementById('conflictUser').textContent = conflict.user;
        
        modal.classList.add('show');
    }
}

// Conflict Resolution Actions
document.addEventListener('DOMContentLoaded', function() {
    const suggestAlternativeBtn = document.getElementById('suggestAlternativeBtn');
    const contactUserBtn = document.getElementById('contactUserBtn');
    const forceBookBtn = document.getElementById('forceBookBtn');
    const resolveConflictBtn = document.getElementById('resolveConflictBtn');
    
    if (suggestAlternativeBtn) {
        suggestAlternativeBtn.addEventListener('click', function() {
            showNotification('Finding alternative time slots...', 'info');
            
            // In production, this would fetch alternative slots
            setTimeout(() => {
                showNotification('Suggested alternative: Same venue, tomorrow at 2 PM', 'success');
            }, 1000);
        });
    }
    
    if (contactUserBtn) {
        contactUserBtn.addEventListener('click', function() {
            const user = document.getElementById('conflictUser').textContent;
            const message = prompt(`Enter message to send to ${user}:`);
            
            if (message) {
                showNotification(`Message sent to ${user}`, 'success');
            }
        });
    }
    
    if (forceBookBtn) {
        forceBookBtn.addEventListener('click', function() {
            if (confirm('Warning: This will override the existing booking. Are you sure?')) {
                showNotification('Booking forced - existing booking will be notified', 'warning');
            }
        });
    }
    
    if (resolveConflictBtn) {
        resolveConflictBtn.addEventListener('click', function() {
            showNotification('Conflict resolution in progress...', 'info');
            
            setTimeout(() => {
                const modal = document.getElementById('conflictModal');
                if (modal) modal.classList.remove('show');
                
                showNotification('Conflict resolved successfully', 'success');
            }, 1500);
        });
    }
});

// User Management
function initializeUserManagement() {
    // This would initialize user management features
    // For demo, we'll just add some placeholder functionality
    
    const searchInput = document.querySelector('.user-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }
}

// Filter Users
function filterUsers(searchTerm) {
    // This would filter users in a real system
    // For demo, we'll just show a notification
    
    if (searchTerm.length > 2) {
        console.log(`Searching for users: ${searchTerm}`);
    }
}

// System Settings
function initializeSystemSettings() {
    const settingsForm = document.getElementById('systemSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get all settings values
            const settings = {};
            const formData = new FormData(this);
            
            for (let [key, value] of formData.entries()) {
                settings[key] = value;
            }
            
            // Save settings (in production, this would be an API call)
            localStorage.setItem('systemSettings', JSON.stringify(settings));
            
            showNotification('System settings saved successfully', 'success');
        });
    }
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('systemSettings') || '{}');
    Object.keys(savedSettings).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = savedSettings[key] === 'on';
            } else {
                input.value = savedSettings[key];
            }
        }
    });
}

// Backup and Restore
function initializeBackupRestore() {
    const backupBtn = document.getElementById('backupBtn');
    const restoreBtn = document.getElementById('restoreBtn');
    const restoreFile = document.getElementById('restoreFile');
    
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            // Create backup data
            const backupData = {
                venues: JSON.parse(localStorage.getItem('venues') || '[]'),
                bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
                users: JSON.parse(localStorage.getItem('users') || '[]'),
                timestamp: new Date().toISOString()
            };
            
            // Create download link
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `venuebook-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showNotification('Backup created and downloaded', 'success');
        });
    }
    
    if (restoreBtn && restoreFile) {
        restoreBtn.addEventListener('click', function() {
            restoreFile.click();
        });
        
        restoreFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (confirm('Warning: Restoring will overwrite current data. Continue?')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        const backupData = JSON.parse(e.target.result);
                        
                        // Restore data
                        if (backupData.venues) {
                            localStorage.setItem('venues', JSON.stringify(backupData.venues));
                        }
                        if (backupData.bookings) {
                            localStorage.setItem('bookings', JSON.stringify(backupData.bookings));
                        }
                        if (backupData.users) {
                            localStorage.setItem('users', JSON.stringify(backupData.users));
                        }
                        
                        showNotification('Data restored successfully', 'success');
                        
                        // Reload page to reflect changes
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                        
                    } catch (error) {
                        showNotification('Invalid backup file', 'error');
                    }
                };
                
                reader.readAsText(file);
            }
        });
    }
}

// Initialize Admin Features
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.admin-main')) {
        initializeAdminDashboard();
    }
    
    if (document.getElementById('systemSettingsForm')) {
        initializeSystemSettings();
    }
    
    if (document.getElementById('backupBtn')) {
        initializeBackupRestore();
    }
    
    // Admin logout
    const adminLogoutBtn = document.querySelector('a[href="admin-login.html"]');
    if (adminLogoutBtn && window.location.pathname.includes('admin-')) {
        adminLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Logout from admin panel?')) {
                localStorage.removeItem('currentAdmin');
                window.location.href = 'admin-login.html';
            }
        });
    }
    
    // Initialize admin booking management if on that page
    if (document.getElementById('bookingsTable')) {
        // Already initialized in booking.js
    }
});

// Admin Notifications
function showAdminNotification(message, type = 'info') {
    // Similar to regular notification but with admin styling
    showNotification(`[Admin] ${message}`, type);
}

// System Health Check
function checkSystemHealth() {
    // This would check various system components
    // For demo, we'll simulate a health check
    
    const health = {
        database: 'healthy',
        api: 'healthy',
        email: 'healthy',
        storage: '85% used',
        uptime: '99.8%'
    };
    
    return health;
}

// Display System Health
function displaySystemHealth() {
    const health = checkSystemHealth();
    const healthContainer = document.getElementById('systemHealth');
    
    if (healthContainer) {
        let healthHTML = '<h3>System Health</h3><div class="health-grid">';
        
        Object.entries(health).forEach(([component, status]) => {
            const isHealthy = status === 'healthy' || status.includes('%');
            healthHTML += `
                <div class="health-item ${isHealthy ? 'healthy' : 'warning'}">
                    <span class="health-component">${component}</span>
                    <span class="health-status">${status}</span>
                </div>
            `;
        });
        
        healthHTML += '</div>';
        healthContainer.innerHTML = healthHTML;
    }
}

// Initialize System Health Display
if (document.getElementById('systemHealth')) {
    displaySystemHealth();
    
    // Refresh health status every 30 seconds
    setInterval(displaySystemHealth, 30000);
}