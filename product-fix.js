// Product Page Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
    // Fix for product tabs
    const productTabs = document.querySelectorAll('#productTabs .nav-link');
    if (productTabs.length > 0) {
        productTabs.forEach(tab => {
            tab.addEventListener('click', function(event) {
                event.preventDefault();
                
                // Remove active class from all tabs
                productTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show related tab content
                const target = document.querySelector(this.getAttribute('data-bs-target'));
                if (target) {
                    document.querySelectorAll('.tab-pane').forEach(pane => {
                        pane.classList.remove('show', 'active');
                    });
                    target.classList.add('show', 'active');
                }
            });
        });
    }

    // Smooth image switching with fade effect
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Get main image element
                const mainImage = document.querySelector('.main-image img');
                if (!mainImage) return;
                
                const newImageSrc = this.getAttribute('data-image');
                
                // Don't proceed if clicking the already active thumbnail
                if (this.classList.contains('active')) return;
                
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Apply fade-out effect
                mainImage.style.opacity = '0';
                mainImage.style.transform = 'scale(0.95)';
                
                // Change image source after a short delay
                setTimeout(() => {
                    mainImage.src = newImageSrc;
                    
                    // Trigger re-flow
                    mainImage.offsetHeight;
                    
                    // Apply fade-in effect
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    // Initialize quantity buttons - FIX FOR DOUBLING ISSUE
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.decrease');
    const increaseBtn = document.querySelector('.increase');
    
    // Remove any existing event listeners to prevent doubles (fix for quantity issue)
    if (quantityInput && decreaseBtn && increaseBtn) {
        // Clone and replace elements to remove all event listeners
        const newDecreaseBtn = decreaseBtn.cloneNode(true);
        const newIncreaseBtn = increaseBtn.cloneNode(true);
        const newQuantityInput = quantityInput.cloneNode(true);
        
        decreaseBtn.parentNode.replaceChild(newDecreaseBtn, decreaseBtn);
        increaseBtn.parentNode.replaceChild(newIncreaseBtn, increaseBtn);
        quantityInput.parentNode.replaceChild(newQuantityInput, quantityInput);
        
        // Add event listeners to the new elements
        newDecreaseBtn.addEventListener('click', function() {
            let value = parseInt(newQuantityInput.value);
            if (value > 1) {
                newQuantityInput.value = value - 1;
                // Trigger change event to update any dependent elements
                newQuantityInput.dispatchEvent(new Event('change'));
            }
        });
        
        newIncreaseBtn.addEventListener('click', function() {
            let value = parseInt(newQuantityInput.value);
            newQuantityInput.value = value + 1;
            // Trigger change event to update any dependent elements
            newQuantityInput.dispatchEvent(new Event('change'));
        });
        
        newQuantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }
    
    // Fix for product addition issue - Ensure cart button has proper functionality
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        // Remove existing listeners to prevent doubles
        const newAddToCartBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
        
        newAddToCartBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get current quantity
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            
            // Get product details
            const productTitle = document.querySelector('.product-title')?.textContent || 'Unknown Product';
            const productPrice = document.querySelector('.current-price')?.textContent || '0';
            const productImage = document.querySelector('.main-image img')?.src || '';
            
            // Convert price from string (e.g., "115.600₫") to number
            const price = parseInt(productPrice.replace(/\D/g, '')) || 0;
            
            // Create product object
            const product = {
                id: Date.now().toString(),
                title: productTitle,
                price: price,
                image: productImage,
                quantity: quantity
            };
            
            // Add to cart (this will be handled by cart.js, we're just dispatching an event)
            const addToCartEvent = new CustomEvent('addToCart', { 
                detail: { product: product }
            });
            document.dispatchEvent(addToCartEvent);
            
            // Visual feedback for the user
            showToast('Đã thêm sản phẩm vào giỏ hàng!');
        });
    }
    
    // Helper function to show toast message
    function showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.position = 'fixed';
            toast.style.bottom = '30px';
            toast.style.right = '30px';
            toast.style.background = 'rgba(0, 0, 0, 0.8)';
            toast.style.color = 'white';
            toast.style.padding = '12px 24px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '9999';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
    
    // Add hover effects to all buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});
