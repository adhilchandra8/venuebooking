// Main JavaScript File

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const userDropdown = document.getElementById('userDropdown');
const dropdownMenu = document.getElementById('dropdownMenu');
const logoutBtn = document.getElementById('logoutBtn');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal-close');
const quickBookBtn = document.getElementById('quickBookBtn');
const quickBookModal = document.getElementById('quickBookModal');
const quickBookForm = document.getElementById('quickBookForm');

// Initialize date inputs
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        if (!input.min) {
            input.min = today;
        }
    });

    // Initialize stats
    initializeStats();

    // Initialize calendar preview
    initializeCalendarPreview();

    // Initialize upcoming bookings
    initializeUpcomingBookings();

    // Initialize activity timeline
    initializeActivityTimeline();

    // Initialize venues
    initializeVenues();

    // Initialize bookings
    initializeBookings();

    // Initialize filters
    initializeFilters();
});

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// User Dropdown
if (userDropdown && dropdownMenu) {
    userDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
}

// Modal Handling
modalCloses.forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.classList.remove('show');
    });
});

// Close modal when clicking outside
modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
});

// Quick Booking Modal
if (quickBookBtn && quickBookModal) {
    quickBookBtn.addEventListener('click', function() {
        quickBookModal.classList.add('show');
    });
}

// Quick Booking Form
if (quickBookForm) {
    quickBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const venue = document.getElementById('quickVenue').value;
        const date = document.getElementById('quickDate').value;
        const time = document.getElementById('quickTime').value;
        const purpose = document.getElementById('quickPurpose').value;

        if (!venue || !date || !time || !purpose) {
            alert('Please fill all required fields');
            return;
        }

        // In a real application, this would make an API call
        showNotification('Booking request submitted! Checking availability...', 'success');
        
        // Close modal after delay
        setTimeout(() => {
            quickBookModal.classList.remove('show');
            quickBookForm.reset();
        }, 1500);
    });
}

// Toggle Password Visibility
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Initialize Stats
function initializeStats() {
    // Update stats on dashboard
    const venueCount = document.getElementById('venueCount');
    const bookingCount = document.getElementById('bookingCount');
    const userCount = document.getElementById('userCount');
    const ratingCount = document.getElementById('ratingCount');

    if (venueCount) venueCount.textContent = '25';
    if (bookingCount) bookingCount.textContent = '1,248';
    if (userCount) userCount.textContent = '542';
    if (ratingCount) ratingCount.textContent = '4.8';
}

// Initialize Calendar Preview
function initializeCalendarPreview() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Generate calendar days
    let calendarHTML = '';
    
    // Empty days at start
    for (let i = 0; i < startingDay; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate();
        const isBooked = Math.random() > 0.7; // Random booking status for demo
        const dayClass = isToday ? 'calendar-day today' : 'calendar-day';
        
        calendarHTML += `
            <div class="${dayClass}">
                <div class="day-number">${day}</div>
                ${isBooked ? '<div class="event-item booking">Booked</div>' : ''}
            </div>
        `;
    }

    calendarGrid.innerHTML = calendarHTML;
}

// Initialize Upcoming Bookings
function initializeUpcomingBookings() {
    const upcomingBookingsTable = document.getElementById('upcomingBookingsTable');
    if (!upcomingBookingsTable) return;

    const bookings = [
        { venue: 'Conference Room A', date: '2024-10-15', time: '1 PM - 4 PM', status: 'approved' },
        { venue: 'Auditorium Main', date: '2024-10-18', time: '9 AM - 12 PM', status: 'confirmed' },
        { venue: 'Classroom 301', date: '2024-10-20', time: '5 PM - 8 PM', status: 'pending' },
        { venue: 'Lab B', date: '2024-10-22', time: 'Full Day', status: 'approved' },
        { venue: 'Sports Complex', date: '2024-10-25', time: '2 PM - 6 PM', status: 'confirmed' }
    ];

    let tableHTML = '';
    bookings.forEach(booking => {
        tableHTML += `
            <tr>
                <td>${booking.venue}</td>
                <td>${booking.date}</td>
                <td>${booking.time}</td>
                <td><span class="status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline">View</button>
                    <button class="btn btn-sm btn-danger">Cancel</button>
                </td>
            </tr>
        `;
    });

    upcomingBookingsTable.innerHTML = tableHTML;
}

// Initialize Activity Timeline
function initializeActivityTimeline() {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline) return;

    const activities = [
        { time: '2 hours ago', icon: 'fa-calendar-check', title: 'Booking Confirmed', description: 'Auditorium Main booking confirmed for Oct 18' },
        { time: '1 day ago', icon: 'fa-star', title: 'Venue Rated', description: 'You rated Conference Room A: 5 stars' },
        { time: '2 days ago', icon: 'fa-calendar-plus', title: 'New Booking Request', description: 'Requested Lab B for Oct 22' },
        { time: '3 days ago', icon: 'fa-check-circle', title: 'Booking Approved', description: 'Classroom 301 booking approved' },
        { time: '1 week ago', icon: 'fa-bell', title: 'Reminder', description: 'Upcoming booking: Conference Room A tomorrow' }
    ];

    let timelineHTML = '';
    activities.forEach(activity => {
        timelineHTML += `
            <div class="activity-item">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-content">
                    <div class="activity-icon">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-details">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                    </div>
                </div>
            </div>
        `;
    });

    activityTimeline.innerHTML = timelineHTML;
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize Password Strength
function initializePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (!passwordInput || !strengthBar || !strengthText) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        // Check password strength
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update strength bar
        const width = strength * 25;
        strengthBar.style.width = `${width}%`;
        
        // Update colors and text
        let color, text;
        switch (strength) {
            case 0:
            case 1:
                color = '#dc3545';
                text = 'Weak';
                break;
            case 2:
                color = '#ffc107';
                text = 'Fair';
                break;
            case 3:
                color = '#17a2b8';
                text = 'Good';
                break;
            case 4:
                color = '#28a745';
                text = 'Strong';
                break;
        }
        
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    });
}

// Call initialization functions
initializePasswordStrength();