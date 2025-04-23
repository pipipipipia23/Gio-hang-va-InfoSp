// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Cart.js loaded");
    
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Log the initial cart state
    console.log("Initial cart:", cart);
    
    // Update cart count in header
    updateCartCount();
    
    // Listen for custom addToCart event from product-fix.js
    document.addEventListener('addToCart', function(event) {
        console.log("addToCart event received", event.detail);
        if (event.detail && event.detail.product) {
            addToCart(event.detail.product);
        }
    });
    
    // Direct event listener for the Add to Cart button (fallback approach)
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        console.log("Add to cart button found, adding direct event listener");
        addToCartBtn.addEventListener('click', function() {
            const productTitle = document.querySelector('.product-title')?.textContent || 'Unknown Product';
            const productPrice = document.querySelector('.current-price')?.textContent || '0';
            const productImage = document.querySelector('.main-image img')?.src || '';
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
            
            // Convert price string to number
            const price = parseInt(productPrice.replace(/\D/g, '')) || 0;
            
            // Create product object
            const product = {
                id: Date.now().toString(),
                title: productTitle,
                price: price,
                image: productImage,
                quantity: quantity
            };
            
            // Add to cart
            addToCart(product);
            
            // Provide visual feedback
            showToast("Đã thêm sản phẩm vào giỏ hàng!");
        });
    }
    
    // Get DOM elements
    const cartButton = document.getElementById('cartButton');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Check if Bootstrap is available
    const hasBootstrap = typeof bootstrap !== 'undefined';
    console.log("Bootstrap available:", hasBootstrap);
    
    // Initialize Bootstrap modal if available
    let cartModal;
    const modalElement = document.getElementById('cartModal');
    
    if (modalElement) {
        console.log("Cart modal element found");
        if (hasBootstrap) {
            cartModal = new bootstrap.Modal(modalElement);
        } else {
            // Fallback for when Bootstrap JS is not loaded
            cartModal = {
                show: function() {
                    modalElement.style.display = 'block';
                    modalElement.classList.add('show');
                    document.body.classList.add('modal-open');
                },
                hide: function() {
                    modalElement.style.display = 'none';
                    modalElement.classList.remove('show');
                    document.body.classList.remove('modal-open');
                }
            };
            
            // Add close event handlers for the fallback modal
            const closeButtons = modalElement.querySelectorAll('[data-bs-dismiss="modal"], .close');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    cartModal.hide();
                });
            });
            
            // Close on click outside
            modalElement.addEventListener('click', function(e) {
                if (e.target === modalElement) {
                    cartModal.hide();
                }
            });
        }
    } else {
        console.log("Cart modal element not found");
    }
    
    // Add event listeners
    if (cartButton) {
        console.log("Cart button found, adding click listener");
        cartButton.addEventListener('click', function(e) {
            console.log("Cart button clicked");
            e.preventDefault();
            renderCartItems();
            
            if (cartModal) {
                console.log("Opening cart modal");
                cartModal.show();
                // Dispatch custom event to notify that the modal has been shown
                document.dispatchEvent(new CustomEvent('cartModalShown'));
            } else {
                console.log("Cart modal not initialized");
                // Try manual approach if modal object isn't available
                if (modalElement) {
                    modalElement.style.display = 'block';
                    modalElement.classList.add('show');
                    // Dispatch custom event to notify that the modal has been shown
                    document.dispatchEvent(new CustomEvent('cartModalShown'));
                }
            }
        });
    } else {
        console.log("Cart button not found!");
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Giỏ hàng của bạn đang trống');
                return;
            }
            
            alert('Đang chuyển đến trang thanh toán...');
            // Here you would redirect to checkout page
            // window.location.href = "checkout.html";
        });
    }
    
    // Function to add product to cart
    function addToCart(product) {
        if (!product) {
            console.error("No product provided to addToCart function");
            return;
        }
        
        console.log("Adding to cart:", product);
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => 
            item.title === product.title
        );
        
        if (existingProductIndex !== -1) {
            // Update quantity if product exists
            cart[existingProductIndex].quantity += product.quantity;
            console.log("Updated quantity for existing product");
        } else {
            // Add new product to cart
            cart.push(product);
            console.log("Added new product to cart");
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart saved to localStorage, new length:", cart.length);
        
        // Update cart count with animation
        updateCartCount(true);
        
        // Optional: render cart items if cart is open
        if (modalElement && modalElement.classList.contains('show')) {
            renderCartItems();
        }
    }
    
    // Function to render cart items
    function renderCartItems() {
        if (!cartItems) {
            console.error("Cart items container not found");
            return;
        }
        
        console.log("Rendering cart with", cart.length, "items");
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Giỏ hàng của bạn đang trống</p>
                    <button class="btn btn-outline-primary btn-sm" data-bs-dismiss="modal">Tiếp tục mua sắm</button>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '0₫';
            return;
        }
        
        let totalPrice = 0;
        let cartHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}₫</div>
                        <div class="cart-item-actions">
                            <div class="cart-qty-controls">
                                <button class="btn cart-decrease" ${item.quantity <= 1 ? 'disabled' : ''} data-id="${item.id}">−</button>
                                <input type="text" class="form-control cart-qty-input" value="${item.quantity}" readonly>
                                <button class="btn cart-increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash-alt me-1"></i>Xóa
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        if (cartTotal) cartTotal.textContent = `${formatPrice(totalPrice)}₫`;
        
        // Add event listeners to cart buttons
        document.querySelectorAll('.cart-increase').forEach(button => {
            button.addEventListener('click', () => updateItemQuantity(button.dataset.id, 1));
        });
        
        document.querySelectorAll('.cart-decrease').forEach(button => {
            button.addEventListener('click', () => updateItemQuantity(button.dataset.id, -1));
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => removeItem(button.dataset.id));
        });
    }
    
    // Function to update item quantity
    function updateItemQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            
            // Remove item if quantity is 0 or less
            if (cart[itemIndex].quantity <= 0) {
                removeItem(id);
                return;
            }
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            renderCartItems();
            updateCartCount();
        }
    }
    
    // Function to remove item from cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
    
    // Function to update cart count in header
    function updateCartCount(animate = false) {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) {
            console.error("Cart count badge element not found");
            return;
        }
        
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        console.log("Updating cart count to", totalItems);
        
        cartCount.textContent = totalItems;
        
        if (animate) {
            // Remove the class first to restart animation if it's already there
            cartCount.classList.remove('updated');
            
            // Force reflow to ensure animation triggers even if already in 'updated' state
            void cartCount.offsetWidth;
            
            // Add the class back to trigger the animation
            cartCount.classList.add('updated');
            
            setTimeout(() => {
                cartCount.classList.remove('updated');
            }, 500);
        }
    }
    
    // Function to improve the styling of cart quantity selectors
    function stylizeCartItemQuantitySelectors() {
        const cartQtyControls = document.querySelectorAll('.cart-qty-controls');
        cartQtyControls.forEach(controlsContainer => {
            // Apply similar styling as the main quantity selector
            controlsContainer.style.border = '1px solid #e0e0e0';
            controlsContainer.style.borderRadius = '4px';
            controlsContainer.style.overflow = 'hidden';
            
            // Get child elements
            const decreaseBtn = controlsContainer.querySelector('.cart-decrease');
            const increaseBtn = controlsContainer.querySelector('.cart-increase');
            const qtyInput = controlsContainer.querySelector('.cart-qty-input');
            
            if (decreaseBtn && increaseBtn && qtyInput) {
                // Style decrease button
                decreaseBtn.classList.remove('btn-outline-secondary');
                decreaseBtn.style.border = 'none';
                decreaseBtn.style.background = 'white';
                decreaseBtn.style.color = '#757575';
                
                // Style increase button
                increaseBtn.classList.remove('btn-outline-secondary');
                increaseBtn.style.border = 'none';
                increaseBtn.style.background = 'white';
                increaseBtn.style.color = '#757575';
                
                // Style quantity input
                qtyInput.style.border = 'none';
                qtyInput.style.borderLeft = '1px solid #e0e0e0';
                qtyInput.style.borderRight = '1px solid #e0e0e0';
                
                // Handle disabled state
                const currentQty = parseInt(qtyInput.value) || 1;
                if (currentQty <= 1) {
                    decreaseBtn.classList.add('disabled');
                    decreaseBtn.style.color = '#ccc';
                }
            }
        });
    }
    
    // Helper function to format price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Helper function to show toast
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
    
    // Listen for custom events from the cart-modal-fix.js
    document.addEventListener('cartIncrease', function(event) {
        if (event.detail && event.detail.id) {
            updateItemQuantity(event.detail.id, 1);
        }
    });
    
    document.addEventListener('cartDecrease', function(event) {
        if (event.detail && event.detail.id) {
            updateItemQuantity(event.detail.id, -1);
        }
    });
    
    document.addEventListener('removeCartItem', function(event) {
        if (event.detail && event.detail.id) {
            removeItem(event.detail.id);
        }
    });
});
