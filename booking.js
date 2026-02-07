// Booking Management JavaScript

// Sample Booking Data
const sampleBookings = [
    {
        id: 'VB-2024-001',
        venueId: 1,
        venueName: 'Conference Room A',
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        date: '2024-10-15',
        timeSlot: 'afternoon',
        purpose: 'Team Meeting',
        attendees: 25,
        description: 'Weekly team meeting with video conference setup',
        status: 'approved',
        createdAt: '2024-10-10T14:30:00',
        approvedAt: '2024-10-11T10:15:00'
    },
    {
        id: 'VB-2024-002',
        venueId: 2,
        venueName: 'Auditorium Main',
        userId: 2,
        userName: 'Jane Smith',
        userEmail: 'jane.smith@example.com',
        date: '2024-10-18',
        timeSlot: 'morning',
        purpose: 'Conference',
        attendees: 150,
        description: 'Annual technology conference',
        status: 'confirmed',
        createdAt: '2024-10-05T09:20:00',
        approvedAt: '2024-10-06T11:30:00',
        confirmedAt: '2024-10-07T14:45:00'
    },
    {
        id: 'VB-2024-003',
        venueId: 3,
        venueName: 'Classroom 301',
        userId: 3,
        userName: 'Robert Johnson',
        userEmail: 'robert.j@example.com',
        date: '2024-10-20',
        timeSlot: 'evening',
        purpose: 'Training Session',
        attendees: 35,
        description: 'Employee training session',
        status: 'pending',
        createdAt: '2024-10-12T16:45:00'
    },
    {
        id: 'VB-2024-004',
        venueId: 4,
        venueName: 'Sports Complex',
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        date: '2024-10-22',
        timeSlot: 'full',
        purpose: 'Sports Event',
        attendees: 200,
        description: 'Annual sports day event',
        status: 'approved',
        createdAt: '2024-10-08T11:20:00',
        approvedAt: '2024-10-09T09:15:00'
    },
    {
        id: 'VB-2024-005',
        venueId: 5,
        venueName: 'Computer Lab B',
        userId: 4,
        userName: 'Sarah Williams',
        userEmail: 'sarah.w@example.com',
        date: '2024-10-25',
        timeSlot: 'afternoon',
        purpose: 'Workshop',
        attendees: 25,
        description: 'Programming workshop for students',
        status: 'completed',
        createdAt: '2024-10-01T13:30:00',
        approvedAt: '2024-10-02T10:45:00',
        completedAt: '2024-10-25T17:00:00'
    }
];

// Initialize Bookings
function initializeBookings() {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    if (!bookingsTableBody) return;

    displayBookings(sampleBookings);
    updateBookingStats();
}

// Display Bookings
function displayBookings(bookings) {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    if (!bookingsTableBody) return;

    let tableHTML = '';
    
    bookings.forEach(booking => {
        const timeLabels = {
            morning: '9 AM - 12 PM',
            afternoon: '1 PM - 4 PM',
            evening: '5 PM - 8 PM',
            full: 'Full Day'
        };
        
        tableHTML += `
            <tr data-booking-id="${booking.id}">
                <td>
                    <div class="booking-info">
                        <strong>${booking.venueName}</strong>
                        <small>${booking.id}</small>
                    </div>
                </td>
                <td>${formatDate(booking.date)}</td>
                <td>${timeLabels[booking.timeSlot] || booking.timeSlot}</td>
                <td><span class="status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
                <td>${booking.attendees}</td>
                <td>
                    <button class="btn btn-sm btn-outline view-details-btn" data-booking='${JSON.stringify(booking).replace(/'/g, "\\'")}'>
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger cancel-btn" ${booking.status !== 'pending' && booking.status !== 'approved' ? 'disabled' : ''}>
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    bookingsTableBody.innerHTML = tableHTML;
    
    // Add event listeners
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    viewDetailsBtns.forEach(button => {
        button.addEventListener('click', function() {
            const bookingData = JSON.parse(this.getAttribute('data-booking'));
            openBookingDetails(bookingData);
        });
    });
    
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    cancelBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const bookingId = row.getAttribute('data-booking-id');
            openCancelModal(bookingId);
        });
    });
}

// Update Booking Stats
function updateBookingStats() {
    const bookings = sampleBookings;
    
    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(b => 
        new Date(b.date) >= new Date() && 
        ['approved', 'confirmed'].includes(b.status)
    ).length;
    
    const completedBookings = bookings.filter(b => 
        b.status === 'completed'
    ).length;
    
    const pendingApproval = bookings.filter(b => 
        b.status === 'pending'
    ).length;
    
    // Update dashboard stats
    const upcomingEl = document.getElementById('upcomingBookings');
    const completedEl = document.getElementById('completedBookings');
    const pendingEl = document.getElementById('pendingApproval');
    const totalEl = document.getElementById('totalBookings');
    const pendingCountEl = document.getElementById('pendingCount');
    
    if (upcomingEl) upcomingEl.textContent = upcomingBookings;
    if (completedEl) completedEl.textContent = completedBookings;
    if (pendingEl) pendingEl.textContent = pendingApproval;
    if (totalEl) totalEl.textContent = totalBookings;
    if (pendingCountEl) pendingCountEl.textContent = pendingApproval;
}

// Open Booking Details
function openBookingDetails(booking) {
    const modal = document.getElementById('bookingDetailsModal');
    if (!modal) return;
    
    // Update modal with booking details
    document.getElementById('detailId').textContent = booking.id;
    document.getElementById('detailStatus').textContent = booking.status;
    document.getElementById('detailStatus').className = `status ${booking.status}`;
    document.getElementById('detailDate').textContent = formatDate(booking.date);
    
    const timeLabels = {
        morning: 'Morning (9 AM - 12 PM)',
        afternoon: 'Afternoon (1 PM - 4 PM)',
        evening: 'Evening (5 PM - 8 PM)',
        full: 'Full Day (9 AM - 8 PM)'
    };
    document.getElementById('detailTime').textContent = timeLabels[booking.timeSlot] || booking.timeSlot;
    
    document.getElementById('detailCreated').textContent = formatDateTime(booking.createdAt);
    document.getElementById('detailUpdated').textContent = formatDateTime(booking.updatedAt || booking.createdAt);
    
    document.getElementById('detailVenueName').textContent = booking.venueName;
    document.getElementById('detailCapacity').textContent = booking.attendees;
    document.getElementById('detailLocation').textContent = 'Main Campus, Building A'; // This would come from venue data
    document.getElementById('detailAmenities').textContent = 'Wi-Fi, Projector, AC'; // This would come from venue data
    
    document.getElementById('detailUser').textContent = booking.userName;
    document.getElementById('detailEmail').textContent = booking.userEmail;
    document.getElementById('detailPhone').textContent = '+1 (555) 123-4567'; // This would come from user data
    document.getElementById('detailOrg').textContent = 'University of Technology'; // This would come from user data
    
    document.getElementById('detailPurpose').textContent = booking.purpose;
    document.getElementById('detailAttendees').textContent = booking.attendees;
    document.getElementById('detailNotes').textContent = booking.description || 'No additional notes.';
    
    // Update status timeline
    updateStatusTimeline(booking);
    
    // Show modal
    modal.classList.add('show');
}

// Update Status Timeline
function updateStatusTimeline(booking) {
    const timeline = document.getElementById('statusTimeline');
    if (!timeline) return;
    
    const events = [];
    
    // Created
    events.push({
        time: booking.createdAt,
        title: 'Booking Requested',
        description: 'Booking request submitted',
        icon: 'fa-calendar-plus',
        status: 'created'
    });
    
    // Approved
    if (booking.approvedAt) {
        events.push({
            time: booking.approvedAt,
            title: 'Booking Approved',
            description: 'Admin approved the booking request',
            icon: 'fa-check-circle',
            status: 'approved'
        });
    }
    
    // Confirmed
    if (booking.confirmedAt) {
        events.push({
            time: booking.confirmedAt,
            title: 'Booking Confirmed',
            description: 'Booking confirmed by user',
            icon: 'fa-calendar-check',
            status: 'confirmed'
        });
    }
    
    // Completed
    if (booking.completedAt) {
        events.push({
            time: booking.completedAt,
            title: 'Booking Completed',
            description: 'Venue usage completed',
            icon: 'fa-flag-checkered',
            status: 'completed'
        });
    }
    
    // Sort events by time
    events.sort((a, b) => new Date(a.time) - new Date(b.time));
    
    // Generate timeline HTML
    let timelineHTML = '';
    events.forEach(event => {
        timelineHTML += `
            <div class="timeline-event ${event.status}">
                <div class="event-icon">
                    <i class="fas ${event.icon}"></i>
                </div>
                <div class="event-content">
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${formatDateTime(event.time)}</div>
                    <div class="event-description">${event.description}</div>
                </div>
            </div>
        `;
    });
    
    timeline.innerHTML = timelineHTML;
}

// Open Cancel Modal
function openCancelModal(bookingId) {
    const modal = document.getElementById('cancelModal');
    if (!modal) return;
    
    // Find booking
    const booking = sampleBookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Update modal with booking info
    document.getElementById('cancelVenueName').textContent = booking.venueName;
    document.getElementById('cancelDate').textContent = formatDate(booking.date);
    
    const timeLabels = {
        morning: '9 AM - 12 PM',
        afternoon: '1 PM - 4 PM',
        evening: '5 PM - 8 PM',
        full: 'Full Day'
    };
    document.getElementById('cancelTime').textContent = timeLabels[booking.timeSlot] || booking.timeSlot;
    
    // Show modal
    modal.classList.add('show');
}

// Handle Cancel Confirmation
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', function() {
        const reason = document.getElementById('cancelReason').value;
        const notes = document.getElementById('cancelNotes').value;
        
        if (!reason) {
            showNotification('Please select a cancellation reason', 'error');
            return;
        }
        
        // In a real app, this would update the booking status via API
        showNotification('Booking cancellation requested. Admin will review.', 'success');
        
        // Close modal
        const modal = document.getElementById('cancelModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        // Reset form
        document.getElementById('cancelReason').selectedIndex = 0;
        document.getElementById('cancelNotes').value = '';
    });
}

// Initialize Booking History Filters
function initializeHistoryFilters() {
    const applyFiltersBtn = document.getElementById('applyHistoryFilters');
    const statusFilters = document.querySelectorAll('.status-filter');
    const venueFilters = document.querySelectorAll('input[name="venueFilter"]');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyHistoryFilters);
    }
    
    if (statusFilters.length > 0) {
        statusFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                statusFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                applyHistoryFilters();
            });
        });
    }
    
    if (venueFilters.length > 0) {
        venueFilters.forEach(filter => {
            filter.addEventListener('change', applyHistoryFilters);
        });
    }
}

// Apply History Filters
function applyHistoryFilters() {
    const activeStatus = document.querySelector('.status-filter.active')?.getAttribute('data-status') || 'all';
    const venueFilters = Array.from(document.querySelectorAll('input[name="venueFilter"]:checked'))
                             .map(cb => cb.value);
    
    let filteredBookings = [...sampleBookings];
    
    // Apply status filter
    if (activeStatus !== 'all') {
        filteredBookings = filteredBookings.filter(booking => booking.status === activeStatus);
    }
    
    // Apply venue type filter
    if (venueFilters.length > 0 && !venueFilters.includes('all')) {
        // This would filter by venue type in a real app
        // For demo, we'll just use the current data
    }
    
    // Apply date range filter
    const dateFrom = document.getElementById('dateFrom')?.value;
    const dateTo = document.getElementById('dateTo')?.value;
    
    if (dateFrom) {
        filteredBookings = filteredBookings.filter(booking => booking.date >= dateFrom);
    }
    
    if (dateTo) {
        filteredBookings = filteredBookings.filter(booking => booking.date <= dateTo);
    }
    
    // Display filtered bookings
    displayBookings(filteredBookings);
    
    // Update stats
    const totalBookings = filteredBookings.length;
    const upcomingBookings = filteredBookings.filter(b => 
        new Date(b.date) >= new Date() && 
        ['approved', 'confirmed'].includes(b.status)
    ).length;
    
    const completedBookings = filteredBookings.filter(b => 
        b.status === 'completed'
    ).length;
    
    const pendingBookings = filteredBookings.filter(b => 
        b.status === 'pending'
    ).length;
    
    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('upcomingBookings').textContent = upcomingBookings;
    document.getElementById('completedBookings').textContent = completedBookings;
    document.getElementById('pendingBookings').textContent = pendingBookings;
}

// Initialize Booking Tabs
function initializeBookingTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Update active tab
                tabBtns.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter bookings by tab
                let filteredBookings = [...sampleBookings];
                
                switch (tabName) {
                    case 'upcoming':
                        filteredBookings = filteredBookings.filter(b => 
                            new Date(b.date) >= new Date() && 
                            ['approved', 'confirmed'].includes(b.status)
                        );
                        break;
                    case 'pending':
                        filteredBookings = filteredBookings.filter(b => b.status === 'pending');
                        break;
                    case 'past':
                        filteredBookings = filteredBookings.filter(b => 
                            new Date(b.date) < new Date() || 
                            b.status === 'completed'
                        );
                        break;
                    case 'cancelled':
                        filteredBookings = filteredBookings.filter(b => b.status === 'cancelled');
                        break;
                }
                
                displayBookings(filteredBookings);
            });
        });
    }
}

// Format Date and Time
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Print Booking Details
const printDetailsBtn = document.getElementById('printDetailsBtn');
if (printDetailsBtn) {
    printDetailsBtn.addEventListener('click', function() {
        window.print();
    });
}

// Export Bookings
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        // In a real app, this would generate and download a CSV/PDF
        showNotification('Export feature would generate a CSV file in production', 'info');
    });
}

// New Booking Button
const newBookingBtn = document.getElementById('newBookingBtn');
if (newBookingBtn) {
    newBookingBtn.addEventListener('click', function() {
        window.location.href = 'view-venues.html';
    });
}

// Admin Booking Management
function initializeAdminBookings() {
    const bookingsTable = document.getElementById('bookingsTable');
    if (!bookingsTable) return;

    displayAdminBookings(sampleBookings);
    initializeAdminFilters();
    initializeBulkActions();
}

// Display Admin Bookings
function displayAdminBookings(bookings) {
    const bookingsTable = document.getElementById('bookingsTable');
    if (!bookingsTable) return;

    let tableHTML = '';
    
    bookings.forEach(booking => {
        const timeLabels = {
            morning: '9 AM - 12 PM',
            afternoon: '1 PM - 4 PM',
            evening: '5 PM - 8 PM',
            full: 'Full Day'
        };
        
        tableHTML += `
            <tr>
                <td>
                    <input type="checkbox" class="booking-checkbox" data-booking-id="${booking.id}">
                </td>
                <td>${booking.id}</td>
                <td>
                    <div class="venue-info-sm">
                        <strong>${booking.venueName}</strong>
                        <small>Capacity: ${booking.attendees}</small>
                    </div>
                </td>
                <td>
                    <div class="user-info-sm">
                        <strong>${booking.userName}</strong>
                        <small>${booking.userEmail}</small>
                    </div>
                </td>
                <td>
                    <div class="datetime-info">
                        <strong>${formatDate(booking.date)}</strong>
                        <small>${timeLabels[booking.timeSlot] || booking.timeSlot}</small>
                    </div>
                </td>
                <td>${booking.purpose}</td>
                <td>
                    <span class="status ${booking.status}">
                        ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline view-booking-btn" 
                            data-booking='${JSON.stringify(booking).replace(/'/g, "\\'")}'>
                        <i class="fas fa-eye"></i>
                    </button>
                    ${booking.status === 'pending' ? `
                        <button class="btn btn-sm btn-success approve-btn" data-booking-id="${booking.id}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-danger reject-btn" data-booking-id="${booking.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    });

    bookingsTable.querySelector('tbody').innerHTML = tableHTML;
    
    // Add event listeners
    addAdminBookingEventListeners();
}

// Add Admin Booking Event Listeners
function addAdminBookingEventListeners() {
    // View booking buttons
    const viewButtons = document.querySelectorAll('.view-booking-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookingData = JSON.parse(this.getAttribute('data-booking'));
            openAdminBookingDetails(bookingData);
        });
    });
    
    // Approve buttons
    const approveButtons = document.querySelectorAll('.approve-btn');
    approveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookingId = this.getAttribute('data-booking-id');
            approveBooking(bookingId);
        });
    });
    
    // Reject buttons
    const rejectButtons = document.querySelectorAll('.reject-btn');
    rejectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookingId = this.getAttribute('data-booking-id');
            rejectBooking(bookingId);
        });
    });
    
    // Checkbox selection
    const checkboxes = document.querySelectorAll('.booking-checkbox');
    const selectAll = document.getElementById('selectAll');
    
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            checkboxes.forEach(cb => {
                cb.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBulkActions);
    });
}

// Open Admin Booking Details
function openAdminBookingDetails(booking) {
    const modal = document.getElementById('bookingDetailsModal');
    if (!modal) return;
    
    // Similar to user booking details but with admin actions
    openBookingDetails(booking);
}

// Approve Booking
function approveBooking(bookingId) {
    if (confirm('Approve this booking request?')) {
        // In a real app, this would make an API call
        showNotification('Booking approved successfully!', 'success');
        
        // Update UI
        const row = document.querySelector(`tr[data-booking-id="${bookingId}"]`);
        if (row) {
            const statusCell = row.querySelector('.status');
            statusCell.textContent = 'Approved';
            statusCell.className = 'status approved';
            
            // Remove action buttons
            const actionCell = row.querySelector('td:last-child');
            actionCell.innerHTML = '<button class="btn btn-sm btn-outline view-booking-btn"><i class="fas fa-eye"></i></button>';
        }
    }
}

// Reject Booking
function rejectBooking(bookingId) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
        // In a real app, this would make an API call
        showNotification(`Booking rejected. Reason: ${reason}`, 'success');
        
        // Update UI
        const row = document.querySelector(`tr[data-booking-id="${bookingId}"]`);
        if (row) {
            const statusCell = row.querySelector('.status');
            statusCell.textContent = 'Rejected';
            statusCell.className = 'status rejected';
            
            // Remove action buttons
            const actionCell = row.querySelector('td:last-child');
            actionCell.innerHTML = '<button class="btn btn-sm btn-outline view-booking-btn"><i class="fas fa-eye"></i></button>';
        }
    }
}

// Initialize Admin Filters
function initializeAdminFilters() {
    const filterStatus = document.getElementById('filterStatus');
    const filterVenue = document.getElementById('filterVenue');
    const filterStartDate = document.getElementById('filterStartDate');
    const filterEndDate = document.getElementById('filterEndDate');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (filterStatus) {
        filterStatus.addEventListener('change', applyAdminFilters);
    }
    
    if (filterVenue) {
        filterVenue.addEventListener('change', applyAdminFilters);
    }
    
    if (filterStartDate || filterEndDate) {
        filterStartDate?.addEventListener('change', applyAdminFilters);
        filterEndDate?.addEventListener('change', applyAdminFilters);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', applyAdminFilters);
    }
}

// Apply Admin Filters
function applyAdminFilters() {
    let filteredBookings = [...sampleBookings];
    
    // Apply status filter
    const status = document.getElementById('filterStatus')?.value;
    if (status && status !== 'all') {
        filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    // Apply venue filter (simplified for demo)
    const venue = document.getElementById('filterVenue')?.value;
    if (venue && venue !== 'all') {
        // In real app, filter by venue type
    }
    
    // Apply date range filter
    const startDate = document.getElementById('filterStartDate')?.value;
    const endDate = document.getElementById('filterEndDate')?.value;
    
    if (startDate) {
        filteredBookings = filteredBookings.filter(booking => booking.date >= startDate);
    }
    
    if (endDate) {
        filteredBookings = filteredBookings.filter(booking => booking.date <= endDate);
    }
    
    // Display filtered bookings
    displayAdminBookings(filteredBookings);
    
    // Update stats
    updateAdminStats(filteredBookings);
}

// Update Admin Stats
function updateAdminStats(bookings) {
    const pendingRequests = bookings.filter(b => b.status === 'pending').length;
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today).length;
    
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('todayBookings').textContent = todayBookings;
}

// Initialize Bulk Actions
function initializeBulkActions() {
    const bulkApproveBtn = document.getElementById('bulkApproveBtn');
    const bulkRejectBtn = document.getElementById('bulkRejectBtn');
    const bulkPendingBtn = document.getElementById('bulkPendingBtn');
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    
    if (bulkApproveBtn) {
        bulkApproveBtn.addEventListener('click', function() {
            const selectedIds = getSelectedBookingIds();
            if (selectedIds.length > 0) {
                if (confirm(`Approve ${selectedIds.length} selected bookings?`)) {
                    // In real app, make API call
                    showNotification(`${selectedIds.length} bookings approved`, 'success');
                    clearSelection();
                }
            }
        });
    }
    
    if (bulkRejectBtn) {
        bulkRejectBtn.addEventListener('click', function() {
            const selectedIds = getSelectedBookingIds();
            if (selectedIds.length > 0) {
                const reason = prompt('Enter rejection reason for all selected bookings:');
                if (reason) {
                    // In real app, make API call
                    showNotification(`${selectedIds.length} bookings rejected`, 'success');
                    clearSelection();
                }
            }
        });
    }
    
    if (bulkPendingBtn) {
        bulkPendingBtn.addEventListener('click', function() {
            const selectedIds = getSelectedBookingIds();
            if (selectedIds.length > 0) {
                // In real app, make API call
                showNotification(`${selectedIds.length} bookings marked as pending`, 'success');
                clearSelection();
            }
        });
    }
    
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
    }
}

// Get Selected Booking IDs
function getSelectedBookingIds() {
    const checkboxes = document.querySelectorAll('.booking-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute('data-booking-id'));
}

// Update Bulk Actions
function updateBulkActions() {
    const selectedCount = document.querySelectorAll('.booking-checkbox:checked').length;
    const bulkActions = document.getElementById('bulkActions');
    const selectedCountEl = document.getElementById('selectedCount');
    
    if (bulkActions) {
        bulkActions.style.display = selectedCount > 0 ? 'block' : 'none';
    }
    
    if (selectedCountEl) {
        selectedCountEl.textContent = `${selectedCount} booking${selectedCount !== 1 ? 's' : ''} selected`;
    }
}

// Clear Selection
function clearSelection() {
    const checkboxes = document.querySelectorAll('.booking-checkbox');
    const selectAll = document.getElementById('selectAll');
    
    checkboxes.forEach(cb => cb.checked = false);
    if (selectAll) selectAll.checked = false;
    updateBulkActions();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('bookingsTableBody')) {
        initializeBookings();
        initializeHistoryFilters();
        initializeBookingTabs();
    }
    
    if (document.getElementById('bookingsTable')) {
        initializeAdminBookings();
    }
});