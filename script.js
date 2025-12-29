/**
 * Form Validation & Submission Handler
 * Handles client-side validation, form submission, and user feedback
 */

class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitButton = document.getElementById('submitButton');
        this.successMessage = document.getElementById('successMessage');
        this.fields = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            whatsapp: document.getElementById('whatsapp'),
            hearAbout: document.getElementById('hearAbout')
        };
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation on blur
        Object.values(this.fields).forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
        
        // Phone number formatting
        this.fields.phone.addEventListener('input', (e) => this.formatPhoneNumber(e));
        this.fields.whatsapp.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }
    
    /**
     * Format phone number input for better UX
     */
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // If starts with country code, format accordingly
        if (value.startsWith('233')) {
            value = '+233 ' + value.slice(3);
        } else if (value.length > 0 && !value.startsWith('+')) {
            value = '+233 ' + value;
        }
        
        // Add spacing for readability
        if (value.length > 6) {
            value = value.replace(/(\+233\s?)(\d{2})(\d{3})(\d{4})/, '$1$2 $3 $4');
        }
        
        e.target.value = value;
    }
    
    /**
     * Validate individual field
     */
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        // Clear previous error
        this.clearError(field);
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            this.showError(field, errorElement, 'This field is required');
            return false;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, errorElement, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation (international format)
        if ((fieldName === 'phone' || fieldName === 'whatsapp') && value) {
            const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, errorElement, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Show error message
     */
    showError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    /**
     * Clear error message
     */
    clearError(field) {
        field.classList.remove('error');
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;
        
        Object.values(this.fields).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            // Focus first invalid field
            const firstInvalid = Object.values(this.fields).find(field => {
                return field.hasAttribute('required') && !field.value.trim();
            });
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }
        
        // Prepare form data
        const formData = {
            fullName: this.fields.fullName.value.trim(),
            email: this.fields.email.value.trim(),
            phone: this.fields.phone.value.trim(),
            whatsapp: this.fields.whatsapp.value.trim(),
            hearAbout: this.fields.hearAbout.value
        };
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Submit to backend
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Registration failed. Please try again.');
            }
            
            // Success
            this.showSuccess();
            this.form.reset();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError(this.submitButton, null, error.message || 'Something went wrong. Please try again.');
            this.setLoadingState(false);
        }
    }
    
    /**
     * Set loading state on submit button
     */
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
        }
    }
    
    /**
     * Show success message
     */
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.classList.add('show');
        this.setLoadingState(false);
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RegistrationForm();
    });
} else {
    new RegistrationForm();
}

// Lazy load background video
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.background-video');
    if (video) {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            video.style.display = 'none';
            return;
        }
        
        // Lazy load video
        video.load();
        
        // Handle video loading errors
        video.addEventListener('error', () => {
            console.warn('Background video failed to load, using fallback');
            video.style.display = 'none';
        });
    }
});

