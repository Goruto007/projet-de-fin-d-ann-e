// Fonctionnalité d'achat - Intégration panier
const cartBadge = document.querySelector('.cart-badge');

function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.map((item) => ({
        emoji: item.emoji,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
    }));
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount(cart) {
    return cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
}

// Charger le badge du panier
function updateBadge() {
    if (!cartBadge) {
        return;
    }

    const cart = getCart();
    cartBadge.textContent = getCartCount(cart);
}

// Fonction pour ajouter au panier
window.addToCart = function(emoji, name, price) {
    const cart = getCart();
    const numericPrice = Number(price) || 0;
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({ emoji, name, price: numericPrice, quantity: 1 });
    }

    saveCart(cart);
    updateBadge();

    // Mettre à jour le badge dans tous les onglets
    window.dispatchEvent(new Event('storage'));
};

// Initialiser le badge au chargement
updateBadge();

// Écouter les changements de localStorage
window.addEventListener('storage', updateBadge);
