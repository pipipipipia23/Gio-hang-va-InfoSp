// Cart Modal Interaction Fix
document.addEventListener('DOMContentLoaded', function() {
    console.log("Cart modal fix script loaded");
    
    // Check for modal element
    const modalElement = document.getElementById('cartModal');
    if (!modalElement) {
        console.error("Cart modal not found!");
        return;
    }
    
    // Fix modal backdrop issues
    function fixModalBackdrop() {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            // Ensure the backdrop doesn't interfere with clicks
            backdrop.style.pointerEvents = 'none';
        });
    }
    
    // Fix z-index and interaction issues when modal is shown
    function applyModalFixes() {
        // Ensure modal content has higher z-index than backdrop
        const modalDialog = modalElement.querySelector('.modal-dialog');
        const modalContent = modalElement.querySelector('.modal-content');
        
        if (modalDialog) {
            modalDialog.style.zIndex = '1051';
            modalDialog.style.position = 'relative';
            modalDialog.style.pointerEvents = 'auto';
        }
        
        if (modalContent) {
            modalContent.style.zIndex = '1052';
            modalContent.style.position = 'relative';
            modalContent.style.pointerEvents = 'auto';
        }
        
        // Fix for interactive elements
        const interactiveElements = modalElement.querySelectorAll('button, input, a, .cart-item-actions, .cart-qty-controls');
        interactiveElements.forEach(element => {
            element.style.position = 'relative';
            element.style.zIndex = '1060';
            element.style.pointerEvents = 'auto';
        });
        
        // Fix backdrop
        fixModalBackdrop();
    }
    
    // Listen for modal shown event
    modalElement.addEventListener('shown.bs.modal', applyModalFixes);
    
    // Also apply when the modal is visible regardless of Bootstrap events
    if (modalElement.classList.contains('show')) {
        applyModalFixes();
    }
    
    // Fallback method: Listen for clicks on cart button
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            // Allow time for modal to appear
            setTimeout(applyModalFixes, 300);
        });
    }
    
    // Fix existing modal if already open
    if (document.body.classList.contains('modal-open')) {
        applyModalFixes();
    }
    
    // Add direct click capability to cart items
    function enhanceCartItemInteraction() {
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => {
            const quantityControls = item.querySelectorAll('.cart-qty-controls button');
            const removeButton = item.querySelector('.remove-item');
            
            quantityControls.forEach(button => {
                // Remove any existing event listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add enhanced click handling
                newButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log("Cart quantity button clicked");
                    
                    // Pass click to the original handler for cart increase/decrease
                    if (this.classList.contains('cart-increase')) {
                        const itemId = this.getAttribute('data-id');
                        // Create and dispatch custom event
                        const event = new CustomEvent('cartIncrease', { detail: { id: itemId } });
                        document.dispatchEvent(event);
                    } else if (this.classList.contains('cart-decrease')) {
                        const itemId = this.getAttribute('data-id');
                        // Create and dispatch custom event
                        const event = new CustomEvent('cartDecrease', { detail: { id: itemId } });
                        document.dispatchEvent(event);
                    }
                });
            });
            
            if (removeButton) {
                // Remove any existing event listeners
                const newRemoveButton = removeButton.cloneNode(true);
                removeButton.parentNode.replaceChild(newRemoveButton, removeButton);
                
                // Add enhanced click handling
                newRemoveButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log("Remove item button clicked");
                    
                    const itemId = this.getAttribute('data-id');
                    // Create and dispatch custom event
                    const event = new CustomEvent('removeCartItem', { detail: { id: itemId } });
                    document.dispatchEvent(event);
                });
            }
        });
    }
    
    // Listen for custom events
    document.addEventListener('cartItemsRendered', enhanceCartItemInteraction);
    document.addEventListener('cartModalShown', applyModalFixes);
    
    // Periodically check for new cart items that need enhanced interaction
    setInterval(function() {
        if (modalElement.classList.contains('show')) {
            enhanceCartItemInteraction();
        }
    }, 1000);
});
