// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// SOS Button Functionality
const sosButton = document.querySelector('.sos-button button');

if (sosButton) {
    sosButton.addEventListener('click', () => {
        // In a real application, this would trigger an emergency call or alert
        alert('Emergency alert triggered! In a real application, this would contact emergency services or your emergency contacts.');
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for header
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // In a real application, this would submit the form data
            alert('Form submitted successfully! In a real application, this data would be sent to the server.');
            form.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
});

// Testimonial Carousel (simplified version)
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

function showTestimonials() {
    if (window.innerWidth < 768 && testimonialCards.length > 0) {
        testimonialCards.forEach((card, index) => {
            if (index === currentTestimonial) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    } else {
        testimonialCards.forEach(card => {
            card.style.display = 'block';
        });
    }
}

// Initialize testimonial display
if (testimonialCards.length > 0) {
    showTestimonials();
    setInterval(showTestimonials, 5000); // Rotate every 5 seconds on mobile
}

// Window resize handler
window.addEventListener('resize', () => {
    if (testimonialCards.length > 0) {
        showTestimonials();
    }
});

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.product-card .btn');
let cartCount = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        alert(`Product added to cart! Cart now has ${cartCount} items.`);
        // In a real application, this would add the product to the cart
    });
});