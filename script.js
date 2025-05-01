// Mobile menu toggle
document.getElementById('menu-btn').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Form submission handling (example)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message. We will contact you soon!');
        this.reset();
    });
});

// Back to Top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Form handling for Netlify forms
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a success page
    if (window.location.search.includes('form-submitted=true')) {
        const formName = new URLSearchParams(window.location.search).get('form');
        if (formName === 'consultation') {
            showSuccessMessage('consultation', 'Thank you! Your consultation request has been submitted. We will contact you soon.');
        } else if (formName === 'contact') {
            showSuccessMessage('contact', 'Thank you! Your message has been sent. We will get back to you soon.');
        }
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Handle form submissions
    document.querySelectorAll('form[netlify]').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Clear error when typing
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('border-red-500');
                    const errorElement = document.getElementById(`${this.id}-error`);
                    if (errorElement) errorElement.classList.add('hidden');
                }
            });
        });
    });

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formName = form.getAttribute('name');
        const successElement = document.getElementById(`${formName}-success`);
        const errorElement = document.getElementById(`${formName}-error`);

        // Hide previous messages
        if (successElement) successElement.classList.add('hidden');
        if (errorElement) errorElement.classList.add('hidden');

        // Validate form
        if (!validateForm(form)) {
            return false;
        }

        // Submit form via fetch API
        const formData = new FormData(form);
        
        fetch('/', {
            method: 'POST',
            body: new URLSearchParams(formData).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                showSuccessMessage(formName, 'Thank you! Your submission has been received.');
                form.reset();
                
                // Scroll to success message
                const successElement = document.getElementById(`${formName}-success`);
                if (successElement) {
                    successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            // Show error message
            showErrorMessage(formName, 'There was a problem submitting your form. Please try again later.');
            console.error('Error:', error);
        });
    }

    function validateForm(form) {
        let isValid = true;
        
        form.querySelectorAll('[required]').forEach(field => {
            const errorElement = document.getElementById(`${field.id}-error`);
            
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                if (errorElement) errorElement.classList.remove('hidden');
                isValid = false;
            } else {
                field.classList.remove('border-red-500');
                if (errorElement) errorElement.classList.add('hidden');
                
                // Additional email validation
                if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    field.classList.add('border-red-500');
                    const errorElement = document.getElementById(`${field.id}-error`);
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.classList.remove('hidden');
                    }
                    isValid = false;
                }
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = form.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                firstError.focus();
            }
        }
        
        return isValid;
    }

    function showSuccessMessage(formName, message) {
        const successElement = document.getElementById(`${formName}-success`);
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.remove('hidden');
        }
    }

    function showErrorMessage(formName, message) {
        const errorElement = document.getElementById(`${formName}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }
});