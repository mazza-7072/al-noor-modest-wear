// ===============================
// AL-NOOR MODEST WEAR - CART
// ===============================

let cart = JSON.parse(localStorage.getItem("alNoorCart")) || [];

// Save cart
function saveCart() {
    localStorage.setItem("alNoorCart", JSON.stringify(cart));
    updateCartBadge();
}

// Add product to cart
function addToCart(product) {
    const existingProduct = cart.find(item =>
        item.id === product.id &&
        JSON.stringify(item.options || {}) === JSON.stringify(product.options || {})
    );

    if (existingProduct) {
        existingProduct.quantity += product.quantity || 1;
    } else {
        cart.push({
            ...product,
            quantity: product.quantity || 1
        });
    }

    saveCart();

    alert(product.name + " added to cart!");
}

// Remove product
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

// Change quantity
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// Get total items
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get total price
function getCartTotal() {
    return cart.reduce((total, item) => {
        return total + (Number(item.price) * item.quantity);
    }, 0);
}

// Update cart badge
function updateCartBadge() {
    const badges = document.querySelectorAll("#cartBadge");

    badges.forEach(badge => {
        badge.textContent = getCartCount();
    });
}

// Display cart
function displayCart() {
    const cartContainer = document.getElementById("cartItems");

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        updateCartTotal();
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">

            <img 
                src="${item.image || ""}" 
                alt="${item.name}"
            >

            <div class="cart-item-info">
                <h3>${item.name}</h3>

                <p>
                    KES ${Number(item.price).toLocaleString()}
                </p>

                ${
                    item.options
                    ? `
                        <div class="cart-options">
                            ${Object.entries(item.options).map(([key, value]) => `
                                <small>
                                    ${key}: ${value}
                                </small>
                            `).join("")}
                        </div>
                    `
                    : ""
                }

                <div class="quantity-controls">

                    <button onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

                <button
                    class="remove-cart-item"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

            <strong>
                KES ${(Number(item.price) * item.quantity).toLocaleString()}
            </strong>

        </div>
    `).join("");

    updateCartTotal();
}

// Update total displayed on cart page
function updateCartTotal() {
    const totalElement = document.getElementById("cartTotal");

    if (totalElement) {
        totalElement.textContent =
            "KES " + getCartTotal().toLocaleString();
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    displayCart();
});