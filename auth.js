// Authentication JavaScript

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const isAuthPage = window.location.pathname.includes('login') || 
                      window.location.pathname.includes('register');
    
    // If user is logged in and trying to access auth pages, redirect to dashboard
    if (currentUser && isAuthPage) {
        window.location.href = 'user-dashboard.html';
        return;
    }
    
    // If user is not logged in and trying to access protected pages, redirect to login
    const protectedPages = ['user-dashboard', 'booking-history', 'admin-dashboard', 'manage-bookings'];
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (!currentUser && protectedPages.includes(currentPage)) {
        window.location.href = 'user-login.html';
        return;
    }
    
    // If admin is not logged in and trying to access admin pages, redirect to admin login
    const adminPages = ['admin-dashboard', 'add-venue', 'manage-bookings', 'view-reports'];
    const currentAdmin = localStorage.getItem('currentAdmin');
    
    if (!currentAdmin && adminPages.includes(currentPage)) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Update UI with user info
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateUserUI(user);
    }
}

// User Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Demo credentials check
        if (email === 'user@demo.com' && password === 'password123') {
            const user = {
                name: 'John Doe',
                email: email,
                phone: '+1 (555) 123-4567',
                institution: 'University of Technology'
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 1500);
        } else {
            showNotification('Invalid email or password. Try: user@demo.com / password123', 'error');
        }
    });
}

// User Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const institution = document.getElementById('institution').value;
        
        // Validation
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }
        
        // Create user object
        const user = {
            name: fullName,
            email: email,
            phone: phone,
            institution: institution,
            createdAt: new Date().toISOString()
        };
        
        // Get existing users or create empty array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            showNotification('User with this email already exists!', 'error');
            return;
        }
        
        // Add new user
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showNotification('Registration successful! Welcome to VenueBook.', 'success');
        
        setTimeout(() => {
            window.location.href = 'user-dashboard.html';
        }, 2000);
    });
}

// Admin Login
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const securityCode = document.getElementById('adminCode').value;
        
        // Demo admin credentials check
        if (username === 'admin' && password === 'admin123' && securityCode === '123456') {
            const admin = {
                username: username,
                role: 'administrator',
                lastLogin: new Date().toISOString()
            };
            
            localStorage.setItem('currentAdmin', JSON.stringify(admin));
            showNotification('Admin login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            showNotification('Invalid credentials. Try: admin / admin123 / 123456', 'error');
        }
    });
}

// Update User UI
function updateUserUI(user) {
    // Update user name in navbar
    const userNameElements = document.querySelectorAll('#userName, #profileName, #welcomeName');
    userNameElements.forEach(element => {
        if (element) {
            element.textContent = user.name;
        }
    });
    
    // Update profile info
    const profileEmail = document.querySelector('#profileEmail');
    const profilePhone = document.querySelector('#profilePhone');
    
    if (profileEmail) profileEmail.textContent = user.email;
    if (profilePhone) profilePhone.textContent = user.phone;
}

// Logout
function logout(isAdmin = false) {
    if (isAdmin) {
        localStorage.removeItem('currentAdmin');
        window.location.href = 'admin-login.html';
    } else {
        localStorage.removeItem('currentUser');
        window.location.href = 'user-login.html';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Social Login Handlers
const googleLoginBtn = document.querySelector('.btn-google');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', function() {
        showNotification('Google login would be implemented in production', 'info');
    });
}

const microsoftLoginBtn = document.querySelector('.btn-microsoft');
if (microsoftLoginBtn) {
    microsoftLoginBtn.addEventListener('click', function() {
        showNotification('Microsoft login would be implemented in production', 'info');
    });
}

// Forgot Password
const forgotPasswordLinks = document.querySelectorAll('.forgot-password');
forgotPasswordLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const email = prompt('Enter your email address to reset password:');
        if (email) {
            showNotification(`Password reset instructions sent to ${email}`, 'success');
        }
    });
});