// Mock data for cart items
let cartItems = [
    { id: 1, name: 'Product 1', price: 29.99 },
    { id: 2, name: 'Product 2', price: 49.99 },
    { id: 3, name: 'Product 3', price: 19.99 }
];

// Function to update cart display
function updateCart() {
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    let total = 0;
    cartList.innerHTML = '';

    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = ${item.name} - $${item.price.toFixed(2)};
        cartList.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Event listener for form submission
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // Show confirmation and order summary
    const confirmation = document.getElementById('confirmation');
    const orderSummary = document.getElementById('order-summary');
    confirmation.style.display = 'block';

    orderSummary.textContent = Name: ${name}, Email: ${email}, Address: ${address}, Total: $${document.getElementById('cart-total').textContent};

    // Clear the cart
    cartItems = [];
    updateCart();
});

// Initialize cart display
updateCart();