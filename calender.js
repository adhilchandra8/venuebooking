// Calendar JavaScript

// Calendar State
let currentDate = new Date();
let currentView = 'month'; // 'month', 'week', 'day'

// Sample Booking Data for Calendar
const calendarBookings = [
    {
        id: 'VB-2024-001',
        venue: 'Conference Room A',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
        timeSlot: 'afternoon',
        status: 'approved',
        user: 'John Doe'
    },
    {
        id: 'VB-2024-002',
        venue: 'Auditorium Main',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 18),
        timeSlot: 'morning',
        status: 'confirmed',
        user: 'Jane Smith'
    },
    {
        id: 'VB-2024-003',
        venue: 'Classroom 301',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
        timeSlot: 'evening',
        status: 'pending',
        user: 'Robert Johnson'
    },
    {
        id: 'VB-2024-004',
        venue: 'Sports Complex',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
        timeSlot: 'full',
        status: 'approved',
        user: 'John Doe'
    },
    {
        id: 'VB-2024-005',
        venue: 'Computer Lab B',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
        timeSlot: 'afternoon',
        status: 'completed',
        user: 'Sarah Williams'
    },
    {
        id: 'VB-2024-006',
        venue: 'Conference Room B',
        date: new Date(),
        timeSlot: 'morning',
        status: 'confirmed',
        user: 'Mike Brown'
    },
    {
        id: 'VB-2024-007',
        venue: 'Auditorium Small',
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        timeSlot: 'evening',
        status: 'pending',
        user: 'Emily Davis'
    },
    {
        id: 'VB-2024-008',
        venue: 'Meeting Room 1',
        date: new Date(new Date().setDate(new Date().getDate() + 3)),
        timeSlot: 'afternoon',
        status: 'approved',
        user: 'David Wilson'
    }
];

// Initialize Calendar
function initializeAdminCalendar() {
    const miniCalendar = document.getElementById('miniCalendar');
    if (miniCalendar) {
        renderMiniCalendar();
    }
    
    const fullCalendar = document.getElementById('fullCalendar');
    if (fullCalendar) {
        renderFullCalendar();
        setupCalendarNavigation();
        setupCalendarViewOptions();
    }
    
    // Initialize calendar event listeners
    initializeCalendarEventListeners();
}

// Render Mini Calendar
function renderMiniCalendar() {
    const miniCalendar = document.getElementById('miniCalendar');
    if (!miniCalendar) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    let calendarHTML = `
        <div class="mini-calendar">
            <div class="mini-calendar-header">
                <span>${monthNames[month]} ${year}</span>
            </div>
            <div class="mini-calendar-grid">
    `;
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="mini-calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="mini-calendar-day empty"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const hasBooking = calendarBookings.some(booking => 
            booking.date.toDateString() === date.toDateString()
        );
        
        let dayClass = 'mini-calendar-day';
        if (isToday) dayClass += ' today';
        if (hasBooking) dayClass += ' booked';
        
        calendarHTML += `
            <div class="${dayClass}" data-date="${date.toISOString().split('T')[0]}">
                ${day}
            </div>
        `;
    }
    
    calendarHTML += `
            </div>
            <div class="mini-calendar-footer">
                <div class="calendar-legend">
                    <span class="legend-dot today"></span> Today
                    <span class="legend-dot booked"></span> Booked
                </div>
            </div>
        </div>
    `;
    
    miniCalendar.innerHTML = calendarHTML;
    
    // Add click event to days
    const calendarDays = miniCalendar.querySelectorAll('.mini-calendar-day:not(.empty)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            showDayBookings(dateStr);
        });
    });
}

// Render Full Calendar
function renderFullCalendar() {
    const fullCalendar = document.getElementById('fullCalendar');
    const calendarMonth = document.getElementById('calendarMonth');
    if (!fullCalendar || !calendarMonth) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    calendarMonth.textContent = `${monthNames[month]} ${year}`;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const today = new Date();
    
    let calendarHTML = '';
    
    // Day headers
    const dayHeaders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<div class="calendar-day empty"></div>`;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const dayBookings = calendarBookings.filter(booking => 
            booking.date.toDateString() === date.toDateString()
        );
        
        let dayClass = 'calendar-day';
        if (isToday) dayClass += ' today';
        if (dayBookings.length > 0) dayClass += ' has-events';
        
        calendarHTML += `
            <div class="${dayClass}" data-date="${date.toISOString().split('T')[0]}">
                <div class="day-number">${day}</div>
                <div class="day-events">
        `;
        
        // Show up to 3 events per day
        dayBookings.slice(0, 3).forEach(booking => {
            calendarHTML += `
                <div class="event-item ${booking.status}" 
                     data-booking-id="${booking.id}"
                     title="${booking.venue} - ${booking.user}">
                    ${booking.venue}
                </div>
            `;
        });
        
        // Show "more" indicator if there are more events
        if (dayBookings.length > 3) {
            calendarHTML += `<div class="event-item more">+${dayBookings.length - 3} more</div>`;
        }
        
        calendarHTML += `
                </div>
            </div>
        `;
    }
    
    fullCalendar.innerHTML = calendarHTML;
    
    // Add event listeners to booking items
    const bookingItems = fullCalendar.querySelectorAll('.event-item');
    bookingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookingId = this.getAttribute('data-booking-id');
            if (bookingId) {
                showBookingDetails(bookingId);
            }
        });
    });
    
    // Add click event to days
    const calendarDays = fullCalendar.querySelectorAll('.calendar-day:not(.empty)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const dateStr = this.getAttribute('data-date');
            showDayDetails(dateStr);
        });
    });
}

// Setup Calendar Navigation
function setupCalendarNavigation() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderFullCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderFullCalendar();
        });
    }
}

// Setup Calendar View Options
function setupCalendarViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active view
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Change view
            currentView = view;
            switchView(view);
        });
    });
}

// Switch Calendar View
function switchView(view) {
    const fullCalendar = document.getElementById('fullCalendar');
    if (!fullCalendar) return;
    
    switch(view) {
        case 'month':
            renderFullCalendar();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'day':
            renderDayView();
            break;
    }
}

// Render Week View
function renderWeekView() {
    const fullCalendar = document.getElementById('fullCalendar');
    if (!fullCalendar) return;
    
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = [];
    
    // Get all days of the week
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
    }
    
    let calendarHTML = `
        <div class="week-view">
            <div class="week-header">
                <div class="time-column">Time</div>
    `;
    
    // Day headers
    weekDays.forEach(day => {
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = day.getDate();
        const isToday = day.toDateString() === new Date().toDateString();
        
        calendarHTML += `
            <div class="day-header ${isToday ? 'today' : ''}">
                <div class="day-name">${dayName}</div>
                <div class="day-number">${dayNumber}</div>
            </div>
        `;
    });
    
    calendarHTML += `</div><div class="week-body">`;
    
    // Time slots (8 AM to 8 PM)
    for (let hour = 8; hour <= 20; hour++) {
        calendarHTML += `<div class="time-slot-row">`;
        calendarHTML += `<div class="time-label">${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}</div>`;
        
        // Cells for each day
        weekDays.forEach(day => {
            const dayBookings = calendarBookings.filter(booking => {
                const bookingDate = booking.date;
                return bookingDate.getDate() === day.getDate() &&
                       bookingDate.getMonth() === day.getMonth() &&
                       bookingDate.getFullYear() === day.getFullYear();
            });
            
            const hasBooking = dayBookings.length > 0;
            calendarHTML += `<div class="time-cell ${hasBooking ? 'has-booking' : ''}"></div>`;
        });
        
        calendarHTML += `</div>`;
    }
    
    calendarHTML += `</div></div>`;
    
    fullCalendar.innerHTML = calendarHTML;
}

// Render Day View
function renderDayView() {
    const fullCalendar = document.getElementById('fullCalendar');
    if (!fullCalendar) return;
    
    const day = currentDate;
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = day.getDate();
    const monthName = day.toLocaleDateString('en-US', { month: 'long' });
    const year = day.getFullYear();
    
    let calendarHTML = `
        <div class="day-view">
            <div class="day-header">
                <h3>${dayName}, ${monthName} ${dayNumber}, ${year}</h3>
            </div>
            <div class="day-timeline">
    `;
    
    // Time slots with bookings
    const dayBookings = calendarBookings.filter(booking => {
        const bookingDate = booking.date;
        return bookingDate.getDate() === day.getDate() &&
               bookingDate.getMonth() === day.getMonth() &&
               bookingDate.getFullYear() === day.getFullYear();
    });
    
    // Group bookings by time
    const timeSlots = {
        'morning': { start: 9, end: 12, label: 'Morning (9 AM - 12 PM)' },
        'afternoon': { start: 13, end: 16, label: 'Afternoon (1 PM - 4 PM)' },
        'evening': { start: 17, end: 20, label: 'Evening (5 PM - 8 PM)' },
        'full': { start: 9, end: 20, label: 'Full Day (9 AM - 8 PM)' }
    };
    
    for (let hour = 8; hour <= 20; hour++) {
        const timeLabel = `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
        
        // Check for bookings in this hour
        const hourBookings = dayBookings.filter(booking => {
            const timeSlot = booking.timeSlot;
            const slot = timeSlots[timeSlot];
            if (!slot) return false;
            
            return hour >= slot.start && hour < slot.end;
        });
        
        calendarHTML += `
            <div class="timeline-hour">
                <div class="hour-label">${timeLabel}</div>
                <div class="hour-cell">
        `;
        
        if (hourBookings.length > 0) {
            hourBookings.forEach(booking => {
                calendarHTML += `
                    <div class="timeline-booking ${booking.status}" 
                         data-booking-id="${booking.id}"
                         title="${booking.venue} - ${booking.user}">
                        ${booking.venue}
                    </div>
                `;
            });
        }
        
        calendarHTML += `
                </div>
            </div>
        `;
    }
    
    calendarHTML += `</div></div>`;
    
    fullCalendar.innerHTML = calendarHTML;
    
    // Add event listeners to booking items
    const bookingItems = fullCalendar.querySelectorAll('.timeline-booking');
    bookingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookingId = this.getAttribute('data-booking-id');
            if (bookingId) {
                showBookingDetails(bookingId);
            }
        });
    });
}

// Get Start of Week
function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Show Day Bookings
function showDayBookings(dateStr) {
    const date = new Date(dateStr);
    const dayBookings = calendarBookings.filter(booking => 
        booking.date.toDateString() === date.toDateString()
    );
    
    if (dayBookings.length === 0) {
        showNotification('No bookings for this date', 'info');
        return;
    }
    
    let message = `Bookings for ${formatDate(dateStr)}:\n\n`;
    dayBookings.forEach(booking => {
        const timeLabels = {
            morning: '9 AM - 12 PM',
            afternoon: '1 PM - 4 PM',
            evening: '5 PM - 8 PM',
            full: 'Full Day'
        };
        
        message += `• ${booking.venue} (${timeLabels[booking.timeSlot] || booking.timeSlot})\n`;
        message += `  Status: ${booking.status}, User: ${booking.user}\n\n`;
    });
    
    alert(message);
}

// Show Day Details
function showDayDetails(dateStr) {
    const date = new Date(dateStr);
    const dayBookings = calendarBookings.filter(booking => 
        booking.date.toDateString() === date.toDateString()
    );
    
    // Create modal for day details
    const modalHTML = `
        <div class="modal" id="dayDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Bookings for ${formatDate(dateStr)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${dayBookings.length === 0 ? 
                        '<p class="no-bookings">No bookings for this date</p>' : 
                        createDayBookingsHTML(dayBookings)
                    }
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="addBookingForDate('${dateStr}')">
                        <i class="fas fa-calendar-plus"></i> Add Booking
                    </button>
                    <button class="btn btn-secondary modal-close">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('dayDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('dayDetailsModal');
    modal.classList.add('show');
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            setTimeout(() => this.remove(), 300);
        }
    });
}

// Create Day Bookings HTML
function createDayBookingsHTML(bookings) {
    let html = '<div class="day-bookings-list">';
    
    bookings.forEach(booking => {
        const timeLabels = {
            morning: '9 AM - 12 PM',
            afternoon: '1 PM - 4 PM',
            evening: '5 PM - 8 PM',
            full: 'Full Day'
        };
        
        html += `
            <div class="booking-item ${booking.status}" data-booking-id="${booking.id}">
                <div class="booking-header">
                    <h4>${booking.venue}</h4>
                    <span class="status ${booking.status}">${booking.status}</span>
                </div>
                <div class="booking-details">
                    <p><i class="fas fa-clock"></i> ${timeLabels[booking.timeSlot] || booking.timeSlot}</p>
                    <p><i class="fas fa-user"></i> ${booking.user}</p>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-sm btn-outline view-booking-btn" onclick="showBookingDetails('${booking.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Show Booking Details
function showBookingDetails(bookingId) {
    const booking = calendarBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const timeLabels = {
        morning: '9 AM - 12 PM',
        afternoon: '1 PM - 4 PM',
        evening: '5 PM - 8 PM',
        full: 'Full Day'
    };
    
    const modalHTML = `
        <div class="modal" id="bookingDetailsModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Booking Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="booking-details-calendar">
                        <div class="detail-section">
                            <h4>Booking Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span>Booking ID:</span>
                                    <strong>${booking.id}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Status:</span>
                                    <span class="status ${booking.status}">${booking.status}</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>Venue Details</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span>Venue:</span>
                                    <strong>${booking.venue}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Date:</span>
                                    <strong>${formatDate(booking.date.toISOString().split('T')[0])}</strong>
                                </div>
                                <div class="detail-item">
                                    <span>Time:</span>
                                    <strong>${timeLabels[booking.timeSlot] || booking.timeSlot}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="detail-section">
                            <h4>User Information</h4>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span>Booked By:</span>
                                    <strong>${booking.user}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="editBooking('${booking.id}')">
                        <i class="fas fa-edit"></i> Edit Booking
                    </button>
                    <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">
                        <i class="fas fa-times"></i> Cancel Booking
                    </button>
                    <button class="btn btn-secondary modal-close">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('bookingDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = document.getElementById('bookingDetailsModal');
    modal.classList.add('show');
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            setTimeout(() => this.remove(), 300);
        }
    });
}

// Add Booking for Date
function addBookingForDate(dateStr) {
    showNotification(`Add booking feature for ${formatDate(dateStr)} would open booking form`, 'info');
    
    // Close day details modal
    const dayModal = document.getElementById('dayDetailsModal');
    if (dayModal) {
        dayModal.classList.remove('show');
        setTimeout(() => dayModal.remove(), 300);
    }
}

// Edit Booking
function editBooking(bookingId) {
    showNotification(`Edit booking ${bookingId} feature would open edit form`, 'info');
}

// Cancel Booking
function cancelBooking(bookingId) {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
        showNotification(`Booking ${bookingId} cancelled`, 'success');
        
        // Close booking details modal
        const bookingModal = document.getElementById('bookingDetailsModal');
        if (bookingModal) {
            bookingModal.classList.remove('show');
            setTimeout(() => bookingModal.remove(), 300);
        }
        
        // Update calendar display
        const index = calendarBookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            calendarBookings[index].status = 'cancelled';
            renderFullCalendar();
        }
    }
}

// Initialize Calendar Event Listeners
function initializeCalendarEventListeners() {
    // Add event listener for calendar day clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.calendar-day')) {
            const dayElement = e.target.closest('.calendar-day');
            if (!dayElement.classList.contains('empty')) {
                const dateStr = dayElement.getAttribute('data-date');
                showDayDetails(dateStr);
            }
        }
    });
}

// Export functions for global use
window.showBookingDetails = showBookingDetails;
window.editBooking = editBooking;
window.cancelBooking = cancelBooking;
window.addBookingForDate = addBookingForDate;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.calendar-container') || document.getElementById('miniCalendar')) {
        initializeAdminCalendar();
    }
    
    // Add calendar styles if not already present
    addCalendarStyles();
});

// Add Calendar Styles
function addCalendarStyles() {
    if (document.getElementById('calendar-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'calendar-styles';
    style.textContent = `
        /* Week View Styles */
        .week-view {
            width: 100%;
        }
        
        .week-header {
            display: grid;
            grid-template-columns: 80px repeat(7, 1fr);
            border-bottom: 2px solid var(--border-color);
        }
        
        .time-column {
            padding: 1rem;
            font-weight: bold;
            background-color: var(--light-gray);
        }
        
        .day-header {
            padding: 1rem;
            text-align: center;
            border-left: 1px solid var(--border-color);
        }
        
        .day-header.today {
            background-color: rgba(74, 107, 255, 0.1);
        }
        
        .day-name {
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .day-number {
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .week-body {
            max-height: 500px;
            overflow-y: auto;
        }
        
        .time-slot-row {
            display: grid;
            grid-template-columns: 80px repeat(7, 1fr);
            border-bottom: 1px solid var(--border-color);
            min-height: 60px;
        }
        
        .time-label {
            padding: 0.5rem;
            font-size: 0.875rem;
            color: var(--gray-color);
            border-right: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .time-cell {
            border-left: 1px solid var(--border-color);
            position: relative;
        }
        
        .time-cell.has-booking {
            background-color: rgba(74, 107, 255, 0.1);
            cursor: pointer;
        }
        
        .time-cell.has-booking:hover {
            background-color: rgba(74, 107, 255, 0.2);
        }
        
        /* Day View Styles */
        .day-view {
            width: 100%;
        }
        
        .day-header {
            padding: 1rem;
            border-bottom: 2px solid var(--border-color);
            text-align: center;
        }
        
        .day-timeline {
            max-height: 500px;
            overflow-y: auto;
        }
        
        .timeline-hour {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            min-height: 80px;
        }
        
        .hour-label {
            width: 80px;
            padding: 0.5rem;
            font-size: 0.875rem;
            color: var(--gray-color);
            border-right: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .hour-cell {
            flex: 1;
            padding: 0.5rem;
            position: relative;
        }
        
        .timeline-booking {
            position: absolute;
            left: 0;
            right: 0;
            padding: 0.5rem;
            margin: 0.25rem;
            border-radius: var(--radius);
            font-size: 0.875rem;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .timeline-booking.booking {
            background-color: rgba(74, 107, 255, 0.1);
            border-left: 3px solid var(--primary-color);
        }
        
        .timeline-booking.pending {
            background-color: rgba(255, 193, 7, 0.1);
            border-left: 3px solid var(--warning-color);
        }
        
        .timeline-booking.confirmed {
            background-color: rgba(40, 167, 69, 0.1);
            border-left: 3px solid var(--success-color);
        }
        
        /* Calendar Legend */
        .calendar-legend {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }
        
        .legend-color.booking {
            background-color: var(--primary-color);
        }
        
        .legend-color.pending {
            background-color: var(--warning-color);
        }
        
        .legend-color.confirmed {
            background-color: var(--success-color);
        }
        
        .legend-color.cancelled {
            background-color: var(--secondary-color);
        }
        
        /* Day Bookings List */
        .day-bookings-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .booking-item {
            background-color: var(--light-gray);
            border-radius: var(--radius);
            padding: 1rem;
            border-left: 4px solid var(--primary-color);
        }
        
        .booking-item.pending {
            border-left-color: var(--warning-color);
        }
        
        .booking-item.confirmed {
            border-left-color: var(--success-color);
        }
        
        .booking-item.cancelled {
            border-left-color: var(--secondary-color);
        }
        
        .booking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        
        .booking-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .booking-details p {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        /* Mini Calendar Legend */
        .mini-calendar-footer {
            padding-top: 0.5rem;
            margin-top: 0.5rem;
            border-top: 1px solid var(--border-color);
        }
        
        .legend-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 0.25rem;
        }
        
        .legend-dot.today {
            background-color: var(--primary-color);
        }
        
        .legend-dot.booked {
            background-color: var(--success-color);
        }
        
        /* Event item styles */
        .event-item.more {
            background-color: var(--light-gray);
            color: var(--gray-color);
            font-size: 0.75rem;
            padding: 2px 6px;
            text-align: center;
        }
        
        /* Admin Dashboard Calendar Styles */
        .admin-activity .activity-item {
            padding: 0.75rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .admin-activity .activity-item:last-child {
            border-bottom: none;
        }
        
        .admin-activity .activity-time {
            font-size: 0.75rem;
            color: var(--gray-color);
            margin-bottom: 0.25rem;
        }
        
        .admin-activity .activity-content {
            display: flex;
            gap: 0.75rem;
        }
        
        .admin-activity .activity-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(74, 107, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            flex-shrink: 0;
        }
        
        /* Top Venues Grid */
        .top-venues-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .top-venue-card {
            background-color: var(--light-gray);
            border-radius: var(--radius);
            padding: 1rem;
        }
        
        .venue-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .venue-rating {
            color: var(--warning-color);
            font-size: 0.875rem;
        }
        
        .venue-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }
        
        .venue-stat {
            display: flex;
            justify-content: space-between;
        }
        
        .stat-label {
            color: var(--gray-color);
            font-size: 0.875rem;
        }
        
        .stat-value {
            font-weight: bold;
        }
        
        .progress-bar {
            height: 6px;
            background-color: #e9ecef;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary-color);
            border-radius: 3px;
        }
        
        /* Notifications */
        .notifications-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .notification-item {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            position: relative;
        }
        
        .notification-item.unread {
            background-color: rgba(74, 107, 255, 0.05);
        }
        
        .notification-item:last-child {
            border-bottom: none;
        }
        
        .notification-item:hover {
            background-color: var(--light-gray);
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(74, 107, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            flex-shrink: 0;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content p {
            margin: 0 0 0.25rem 0;
        }
        
        .notification-content small {
            color: var(--gray-color);
            font-size: 0.875rem;
        }
        
        .notification-dot {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--primary-color);
        }
        
        /* Quick Stats Grid */
        .quick-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
        }
        
        .quick-stat-item {
            background-color: var(--light-gray);
            border-radius: var(--radius);
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .stat-icon-sm {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }
        
        .stat-icon-sm.primary {
            background-color: rgba(74, 107, 255, 0.1);
            color: var(--primary-color);
        }
        
        .stat-icon-sm.success {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success-color);
        }
        
        .stat-icon-sm.warning {
            background-color: rgba(255, 193, 7, 0.1);
            color: var(--warning-color);
        }
        
        .stat-icon-sm.info {
            background-color: rgba(23, 162, 184, 0.1);
            color: var(--info-color);
        }
        
        .stat-content-sm h4 {
            margin: 0;
            font-size: 1.25rem;
        }
        
        .stat-content-sm p {
            margin: 0;
            font-size: 0.875rem;
            color: var(--gray-color);
        }
        
        /* Today's Events */
        .todays-events {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .event-item {
            padding: 0.75rem;
            background-color: var(--light-gray);
            border-radius: var(--radius);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .event-time {
            font-weight: bold;
            min-width: 60px;
        }
        
        .event-details {
            flex: 1;
            padding: 0 1rem;
        }
        
        .event-details h4 {
            margin: 0 0 0.25rem 0;
            font-size: 1rem;
        }
        
        .event-details p {
            margin: 0;
            font-size: 0.875rem;
            color: var(--gray-color);
        }
        
        /* Two Column Layout */
        .two-column-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        @media (max-width: 1024px) {
            .two-column-layout {
                grid-template-columns: 1fr;
            }
        }
        
        /* Compact Tables */
        .admin-table.compact th,
        .admin-table.compact td {
            padding: 0.75rem;
            font-size: 0.875rem;
        }
        
        .user-info-sm strong {
            display: block;
            font-size: 0.875rem;
        }
        
        .user-info-sm small {
            display: block;
            font-size: 0.75rem;
            color: var(--gray-color);
        }
        
        /* Admin Welcome Banner */
        .admin-welcome {
            background: linear-gradient(135deg, var(--dark-color), #495057);
        }
        
        .admin-quick-stats {
            display: flex;
            gap: 2rem;
        }
        
        .quick-stat {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .quick-stat i {
            font-size: 2rem;
            opacity: 0.8;
        }
        
        .quick-stat h3 {
            margin: 0;
            font-size: 2rem;
        }
        
        .quick-stat p {
            margin: 0;
            opacity: 0.9;
        }
        
        /* Admin Actions */
        .admin-actions .action-card {
            border: 2px solid transparent;
            transition: all 0.3s;
        }
        
        .admin-actions .action-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-3px);
        }
    `;
    
    document.head.appendChild(style);
}