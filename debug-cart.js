// Cart Debug Tool
(function() {
    console.log("Cart Debugger loaded");
    
    // Add a debug button to the page
    function addDebugButton() {
        const button = document.createElement('button');
        button.textContent = 'Debug Cart';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.style.background = '#333';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '12px';
        button.style.opacity = '0.7';
        
        button.addEventListener('click', debugCart);
        document.body.appendChild(button);
    }
    
    // Debug the cart
    function debugCart() {
        console.group("Cart Debug Information");
        
        // Check localStorage
        const cartData = localStorage.getItem('cart');
        console.log("Cart in localStorage:", cartData ? JSON.parse(cartData) : null);
        
        // Check if cart elements exist
        const cartButton = document.getElementById('cartButton');
        const cartCount = document.getElementById('cartCount');
        const cartModal = document.getElementById('cartModal');
        
        console.log("cartButton exists:", !!cartButton);
        console.log("cartCount exists:", !!cartCount);
        console.log("cartModal exists:", !!cartModal);
        
        // Check event listeners
        if (cartButton) {
            console.log("cartButton click will be triggered");
            // Create a test event
            const testEvent = new Event('click');
            testEvent.preventDefault = function() {};
            cartButton.dispatchEvent(testEvent);
        }
        
        // Test add to cart function
        console.log("Testing addToCart with sample product");
        // Create a custom event
        const addToCartEvent = new CustomEvent('addToCart', { 
            detail: { 
                product: {
                    id: 'test-' + Date.now(),
                    title: 'Test Product',
                    price: 100000,
                    image: 'https://via.placeholder.com/100',
                    quantity: 1
                } 
            }
        });
        document.dispatchEvent(addToCartEvent);
        
        // Check if Bootstrap is available
        console.log("Bootstrap available:", typeof bootstrap !== 'undefined');
        
        console.groupEnd();
        
        alert('Cart debug info printed to console. Check browser developer tools.');
    }
    
    // Add a fix cart function
    function fixCart() {
        // Clear localStorage and reset
        localStorage.removeItem('cart');
        console.log("Cart reset. Reloading page...");
        location.reload();
    }
    
    // Add the debug button once DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDebugButton);
    } else {
        addDebugButton();
    }
    
    // Expose debug functions to global scope
    window.debugCart = debugCart;
    window.fixCart = fixCart;
})();
