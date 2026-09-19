/**
 * STRICT VANILLA JS
 * Handles Text Splitting Animations, Intersection Observers, and Form Routing.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. TEXT SPLIT ANIMATION LOGIC
    const textAnimateElements = document.querySelectorAll('.text-animate');
    
    textAnimateElements.forEach(el => {
        const text = el.textContent;
        el.textContent = ''; // Clear original text
        el.setAttribute('aria-label', text); // Preserve accessibility
        
        const words = text.split(' ');
        
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            wordSpan.setAttribute('aria-hidden', 'true');
            
            // Split into characters for stagger
            const chars = word.split('');
            chars.forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.classList.add('char');
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
            });
            
            el.appendChild(wordSpan);
        });
    });

    // 2. INTERSECTION OBSERVER FOR REVEALS & TEXT ANIMATIONS
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Handle block reveals
                if (target.classList.contains('reveal')) {
                    target.classList.add('active');
                }
                
                // Handle text animations
                if (target.classList.contains('text-animate')) {
                    const chars = target.querySelectorAll('.char');
                    chars.forEach((char, index) => {
                        // Stagger the animation of each character
                        setTimeout(() => {
                            char.classList.add('active');
                        }, index * 20); // 20ms delay per char
                    });
                }
                
                // Unobserve after animating once
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observe standard reveals
    document.querySelectorAll('.reveal').forEach(el => intersectionObserver.observe(el));
    
    // Observe text animations
    textAnimateElements.forEach(el => intersectionObserver.observe(el));


    // 3. DYNAMIC CONTACT FORM (WhatsApp/Email Routing)
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Extract raw data attributes configured in HTML
            const waNumber = contactForm.getAttribute('data-target-wa');
            const emailAddress = contactForm.getAttribute('data-target-email');
            
            // Safely extract values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const query = document.getElementById('query').value.trim();
            
            // Format for URL transport
            const messageBody = `Name: ${name}\nEmail: ${email}\nQuery: ${query}`;
            const encodedMessage = encodeURIComponent(messageBody);
            
            // Route logic
            if (waNumber && waNumber !== "") {
                const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
                window.open(waUrl, '_blank');
            } else if (emailAddress && emailAddress !== "") {
                const mailUrl = `mailto:${emailAddress}?subject=Website%20Query&body=${encodedMessage}`;
                window.open(mailUrl, '_blank');
            } else {
                console.error("Routing Error: No endpoint configured.");
                alert("Form submission is currently unavailable.");
            }
            
            contactForm.reset();
        });
    }
});