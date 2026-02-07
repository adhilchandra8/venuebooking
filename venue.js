// Venue Management JavaScript

// Sample Venue Data
const sampleVenues = [
    {
        id: 1,
        name: 'Conference Room A',
        code: 'CONF-A',
        type: 'conference',
        capacity: 50,
        building: 'Main Building',
        floor: '3rd Floor',
        roomNumber: '301',
        campus: 'main',
        amenities: ['wifi', 'projector', 'ac', 'whiteboard', 'sound'],
        pricePerHour: 50,
        pricePerDay: 300,
        status: 'active',
        rating: 4.8,
        bookings: 128
    },
    {
        id: 2,
        name: 'Auditorium Main',
        code: 'AUD-MAIN',
        type: 'auditorium',
        capacity: 300,
        building: 'Arts Building',
        floor: 'Ground Floor',
        roomNumber: 'A100',
        campus: 'main',
        amenities: ['wifi', 'projector', 'ac', 'sound', 'catering', 'parking', 'wheelchair'],
        pricePerHour: 100,
        pricePerDay: 600,
        status: 'active',
        rating: 4.6,
        bookings: 95
    },
    {
        id: 3,
        name: 'Classroom 301',
        code: 'CLASS-301',
        type: 'classroom',
        capacity: 40,
        building: 'Science Building',
        floor: '3rd Floor',
        roomNumber: '301',
        campus: 'north',
        amenities: ['wifi', 'projector', 'ac', 'whiteboard'],
        pricePerHour: 20,
        pricePerDay: 120,
        status: 'active',
        rating: 4.5,
        bookings: 87
    },
    {
        id: 4,
        name: 'Sports Complex',
        code: 'SPORTS',
        type: 'sports',
        capacity: 500,
        building: 'Sports Center',
        floor: 'Ground Floor',
        roomNumber: 'SC-01',
        campus: 'south',
        amenities: ['ac', 'sound', 'parking', 'wheelchair', 'security'],
        pricePerHour: 150,
        pricePerDay: 900,
        status: 'active',
        rating: 4.7,
        bookings: 65
    },
    {
        id: 5,
        name: 'Computer Lab B',
        code: 'LAB-B',
        type: 'lab',
        capacity: 30,
        building: 'Technology Building',
        floor: '2nd Floor',
        roomNumber: 'T201',
        campus: 'east',
        amenities: ['wifi', 'ac', 'security'],
        pricePerHour: 40,
        pricePerDay: 240,
        status: 'active',
        rating: 4.4,
        bookings: 72
    },
    {
        id: 6,
        name: 'Small Meeting Room',
        code: 'MEET-01',
        type: 'conference',
        capacity: 15,
        building: 'Business Building',
        floor: '1st Floor',
        roomNumber: 'B101',
        campus: 'west',
        amenities: ['wifi', 'ac', 'whiteboard'],
        pricePerHour: 30,
        pricePerDay: 180,
        status: 'active',
        rating: 4.3,
        bookings: 54
    }
];

// Initialize Venues
function initializeVenues() {
    const venuesGrid = document.getElementById('venuesGrid');
    if (!venuesGrid) return;

    displayVenues(sampleVenues);
    updateResultsCount(sampleVenues.length);
}

// Display Venues
function displayVenues(venues) {
    const venuesGrid = document.getElementById('venuesGrid');
    if (!venuesGrid) return;

    let venuesHTML = '';
    
    venues.forEach(venue => {
        const amenitiesHTML = venue.amenities.map(amenity => {
            const amenityIcons = {
                wifi: 'fa-wifi',
                projector: 'fa-video',
                ac: 'fa-snowflake',
                sound: 'fa-volume-up',
                whiteboard: 'fa-chalkboard',
                catering: 'fa-utensils',
                parking: 'fa-parking',
                wheelchair: 'fa-wheelchair',
                security: 'fa-shield-alt',
                tv: 'fa-tv'
            };
            
            const amenityLabels = {
                wifi: 'Wi-Fi',
                projector: 'Projector',
                ac: 'AC',
                sound: 'Sound System',
                whiteboard: 'Whiteboard',
                catering: 'Catering',
                parking: 'Parking',
                wheelchair: 'Wheelchair Access',
                security: 'Security',
                tv: 'TV'
            };
            
            return `
                <span class="amenity-tag">
                    <i class="fas ${amenityIcons[amenity] || 'fa-check'}"></i>
                    ${amenityLabels[amenity] || amenity}
                </span>
            `;
        }).join('');
        
        venuesHTML += `
            <div class="venue-card" data-venue-id="${venue.id}">
                <div class="venue-image">
                    <i class="fas fa-building"></i>
                </div>
                <div class="venue-content">
                    <div class="venue-header">
                        <div>
                            <h3 class="venue-title">${venue.name}</h3>
                            <div class="venue-rating">
                                ${generateStarRating(venue.rating)}
                            </div>
                        </div>
                        <span class="status ${venue.status}">${venue.status}</span>
                    </div>
                    <div class="venue-meta">
                        <span><i class="fas fa-users"></i> ${venue.capacity} people</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${venue.building}</span>
                        <span><i class="fas fa-dollar-sign"></i> $${venue.pricePerHour}/hr</span>
                    </div>
                    <div class="venue-amenities">
                        ${amenitiesHTML}
                    </div>
                    <div class="venue-actions">
                        <button class="btn btn-primary btn-sm book-venue-btn" 
                                data-venue='${JSON.stringify(venue).replace(/'/g, "\\'")}'>
                            <i class="fas fa-calendar-plus"></i> Book Now
                        </button>
                        <button class="btn btn-outline btn-sm view-details-btn">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    venuesGrid.innerHTML = venuesHTML;
    
    // Add event listeners to book buttons
    const bookButtons = document.querySelectorAll('.book-venue-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const venueData = JSON.parse(this.getAttribute('data-venue'));
            openBookingModal(venueData);
        });
    });
}

// Generate Star Rating
function generateStarRating(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    starsHTML += `<span class="rating-text">${rating.toFixed(1)}</span>`;
    return starsHTML;
}

// Open Booking Modal
function openBookingModal(venue) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;
    
    // Update modal with venue info
    document.getElementById('modalVenueName').textContent = venue.name;
    document.getElementById('modalCapacity').textContent = venue.capacity;
    document.getElementById('modalLocation').textContent = `${venue.building}, ${venue.campus}`;
    
    // Update summary
    document.getElementById('summaryVenue').textContent = venue.name;
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').value = today;
    document.getElementById('summaryDate').textContent = formatDate(today);
    
    // Show modal
    modal.classList.add('show');
    
    // Add event listeners to form fields
    const bookingDate = document.getElementById('bookingDate');
    const timeSlot = document.getElementById('timeSlot');
    const attendees = document.getElementById('attendees');
    
    if (bookingDate) {
        bookingDate.addEventListener('change', function() {
            document.getElementById('summaryDate').textContent = formatDate(this.value);
        });
    }
    
    if (timeSlot) {
        timeSlot.addEventListener('change', function() {
            const timeLabels = {
                morning: 'Morning (9 AM - 12 PM)',
                afternoon: 'Afternoon (1 PM - 4 PM)',
                evening: 'Evening (5 PM - 8 PM)',
                full: 'Full Day (9 AM - 8 PM)'
            };
            document.getElementById('summaryTime').textContent = timeLabels[this.value] || '-';
        });
    }
    
    if (attendees) {
        attendees.addEventListener('input', function() {
            const capacity = venue.capacity;
            const attendeesCount = parseInt(this.value) || 0;
            
            if (attendeesCount > capacity) {
                document.getElementById('capacityHint').textContent = 
                    `Warning: Exceeds venue capacity (${capacity})`;
                document.getElementById('capacityHint').style.color = '#dc3545';
            } else if (attendeesCount === capacity) {
                document.getElementById('capacityHint').textContent = 
                    `At full capacity (${capacity})`;
                document.getElementById('capacityHint').style.color = '#ffc107';
            } else {
                document.getElementById('capacityHint').textContent = 
                    `Within capacity (${capacity} maximum)`;
                document.getElementById('capacityHint').style.color = '#28a745';
            }
        });
    }
}

// Initialize Filters
function initializeFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const sortBy = document.getElementById('sortBy');
    const viewButtons = document.querySelectorAll('.btn-view');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', applyFilters);
    }
    
    if (viewButtons.length > 0) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const view = this.getAttribute('data-view');
                toggleView(view);
            });
        });
    }
    
    // Capacity range slider
    const capacityRange = document.getElementById('capacityRange');
    const minCapacity = document.getElementById('minCapacity');
    const maxCapacity = document.getElementById('maxCapacity');
    const capacityPresets = document.querySelectorAll('.btn-preset');
    
    if (capacityRange) {
        capacityRange.addEventListener('input', function() {
            minCapacity.textContent = this.value;
        });
    }
    
    if (capacityPresets.length > 0) {
        capacityPresets.forEach(preset => {
            preset.addEventListener('click', function() {
                const min = this.getAttribute('data-min');
                const max = this.getAttribute('data-max');
                
                if (capacityRange) {
                    capacityRange.value = min;
                    capacityRange.dispatchEvent(new Event('input'));
                }
                
                if (minCapacity) minCapacity.textContent = min;
                if (maxCapacity) textContent = max;
            });
        });
    }
}

// Apply Filters
function applyFilters() {
    let filteredVenues = [...sampleVenues];
    
    // Get filter values
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterDate = document.getElementById('filterDate')?.value || '';
    const filterTime = document.getElementById('filterTime')?.value || '';
    const venueTypes = Array.from(document.querySelectorAll('input[name="venueType"]:checked'))
                          .map(cb => cb.value);
    const capacityMin = parseInt(document.getElementById('minCapacity')?.textContent || '10');
    const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
                         .map(cb => cb.value);
    const location = document.getElementById('filterLocation')?.value || '';
    const sortBy = document.getElementById('sortBy')?.value || 'name';
    
    // Apply search filter
    if (searchTerm) {
        filteredVenues = filteredVenues.filter(venue => 
            venue.name.toLowerCase().includes(searchTerm) ||
            venue.building.toLowerCase().includes(searchTerm) ||
            venue.campus.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply venue type filter
    if (venueTypes.length > 0 && !venueTypes.includes('all')) {
        filteredVenues = filteredVenues.filter(venue => 
            venueTypes.includes(venue.type)
        );
    }
    
    // Apply capacity filter
    filteredVenues = filteredVenues.filter(venue => 
        venue.capacity >= capacityMin
    );
    
    // Apply amenities filter
    if (amenities.length > 0) {
        filteredVenues = filteredVenues.filter(venue => 
            amenities.every(amenity => venue.amenities.includes(amenity))
        );
    }
    
    // Apply location filter
    if (location) {
        filteredVenues = filteredVenues.filter(venue => 
            venue.campus === location
        );
    }
    
    // Apply sorting
    filteredVenues.sort((a, b) => {
        switch (sortBy) {
            case 'capacity':
                return b.capacity - a.capacity;
            case 'rating':
                return b.rating - a.rating;
            case 'popularity':
                return b.bookings - a.bookings;
            default: // name
                return a.name.localeCompare(b.name);
        }
    });
    
    // Display filtered venues
    displayVenues(filteredVenues);
    updateResultsCount(filteredVenues.length);
}

// Clear Filters
function clearFilters() {
    // Reset all filter inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="date"]');
    inputs.forEach(input => input.value = '');
    
    const selects = document.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    
    // Reset capacity
    const capacityRange = document.getElementById('capacityRange');
    const minCapacity = document.getElementById('minCapacity');
    if (capacityRange) capacityRange.value = 10;
    if (minCapacity) minCapacity.textContent = '10';
    
    // Re-apply filters to show all venues
    applyFilters();
}

// Toggle View
function toggleView(view) {
    const venuesGrid = document.getElementById('venuesGrid');
    const venuesMap = document.getElementById('venuesMap');
    const venuesList = document.getElementById('venuesList'); // If implemented
    
    if (!venuesGrid || !venuesMap) return;
    
    switch (view) {
        case 'grid':
            venuesGrid.style.display = 'grid';
            venuesMap.style.display = 'none';
            break;
        case 'list':
            // Convert grid to list view
            venuesGrid.style.display = 'flex';
            venuesGrid.style.flexDirection = 'column';
            venuesMap.style.display = 'none';
            break;
        case 'map':
            venuesGrid.style.display = 'none';
            venuesMap.style.display = 'block';
            break;
    }
}

// Update Results Count
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (resultsCount) {
        resultsCount.textContent = `${count} venue${count !== 1 ? 's' : ''} found`;
    }
    
    if (noResults) {
        noResults.style.display = count === 0 ? 'block' : 'none';
    }
}

// Handle Booking Form Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const venueName = document.getElementById('modalVenueName').textContent;
        const date = document.getElementById('bookingDate').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const purpose = document.getElementById('purpose').value;
        const description = document.getElementById('description').value;
        const attendees = document.getElementById('attendees').value;
        
        // Validation
        if (!date || !timeSlot || !purpose || !attendees) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        // Create booking object
        const booking = {
            id: 'VB-' + Date.now(),
            venue: venueName,
            date: date,
            timeSlot: timeSlot,
            purpose: purpose,
            description: description,
            attendees: parseInt(attendees),
            status: 'pending',
            createdAt: new Date().toISOString(),
            user: JSON.parse(localStorage.getItem('currentUser'))
        };
        
        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Show success message
        showNotification('Booking request submitted successfully! Awaiting admin approval.', 'success');
        
        // Close modal and reset form
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.classList.remove('show');
        }
        
        this.reset();
        
        // Simulate email/SMS notification
        setTimeout(() => {
            showNotification('Confirmation email sent to your registered email address', 'info');
        }, 1000);
    });
}

// Add Venue Form
const venueForm = document.getElementById('venueForm');
if (venueForm) {
    venueForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const venueData = {};
        
        for (let [key, value] of formData.entries()) {
            venueData[key] = value;
        }
        
        // Get amenities
        const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
                              .map(cb => cb.value);
        venueData.amenities = amenities;
        
        // Get time slots
        const slots = Array.from(document.querySelectorAll('input[name="slots"]:checked'))
                          .map(cb => cb.value);
        venueData.slots = slots;
        
        // Generate venue ID
        venueData.id = Date.now();
        venueData.bookings = 0;
        venueData.rating = 0;
        
        // Save venue to localStorage
        const venues = JSON.parse(localStorage.getItem('venues') || '[]');
        venues.push(venueData);
        localStorage.setItem('venues', JSON.stringify(venues));
        
        showNotification('Venue added successfully!', 'success');
        
        // Reset form
        this.reset();
        
        // Close preview modal if open
        const previewModal = document.getElementById('previewModal');
        if (previewModal) {
            previewModal.classList.remove('show');
        }
    });
}

// Image Upload Preview
const uploadArea = document.getElementById('uploadArea');
if (uploadArea) {
    const fileInput = uploadArea.querySelector('input[type="file"]');
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        const uploadedImages = document.getElementById('uploadedImages');
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '100%';
                    img.style.height = '100px';
                    img.style.objectFit = 'cover';
                    
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'uploaded-image';
                    imageContainer.appendChild(img);
                    
                    // Add remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-image';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.addEventListener('click', () => {
                        imageContainer.remove();
                    });
                    
                    imageContainer.appendChild(removeBtn);
                    uploadedImages.appendChild(imageContainer);
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Reset file input
        this.value = '';
    });
}

// Preview Venue
const previewBtn = document.getElementById('previewBtn');
if (previewBtn) {
    previewBtn.addEventListener('click', function() {
        const previewModal = document.getElementById('previewModal');
        if (!previewModal) return;
        
        // Get form values and update preview
        document.getElementById('previewName').textContent = 
            document.getElementById('venueName').value || 'Conference Room A';
        
        document.getElementById('previewCode').textContent = 
            document.getElementById('venueCode').value || 'CONF-A';
        
        document.getElementById('previewType').textContent = 
            document.getElementById('venueType').value || 'Conference Room';
        
        document.getElementById('previewCapacity').textContent = 
            document.getElementById('capacity').value + ' people' || '50 people';
        
        document.getElementById('previewBuilding').textContent = 
            document.getElementById('building').value || 'Main Building';
        
        document.getElementById('previewFloor').textContent = 
            document.getElementById('floor').value || '3rd Floor';
        
        document.getElementById('previewCampus').textContent = 
            document.getElementById('campus').value || 'Main Campus';
        
        // Update amenities preview
        const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked'))
                              .map(cb => {
                                  const label = document.querySelector(`label[for="${cb.id}"] span`);
                                  return label ? label.textContent : cb.value;
                              });
        
        const amenitiesPreview = document.getElementById('previewAmenities');
        if (amenitiesPreview) {
            amenitiesPreview.innerHTML = amenities.map(amenity => 
                `<span class="amenity-preview">${amenity}</span>`
            ).join('');
        }
        
        // Show modal
        previewModal.classList.add('show');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('venuesGrid')) {
        initializeVenues();
        initializeFilters();
    }
    
    if (venueForm) {
        initializeVenueForm();
    }
});