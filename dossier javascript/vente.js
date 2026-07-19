const cartBadge = document.querySelector('.cart-badge');

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount(cart) {
    return cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
}

function updateBadge() {
    if (!cartBadge) {
        return;
    }

    cartBadge.textContent = getCartCount(getCart());
}

window.addToCart = function(emoji, nomProduit, prix) {
    const cart = getCart();
    const numericPrice = Number(prix) || 0;
    const existingItem = cart.find((item) => item.name === nomProduit);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            emoji: String(emoji || '🎵').trim(),
            name: nomProduit,
            price: numericPrice,
            quantity: 1,
        });
    }

    saveCart(cart);
    updateBadge();

    if (typeof alert === 'function') {
        alert(`${nomProduit} a été ajouté au panier !`);
    }
};

updateBadge();

const menuToggle = document.getElementById('menuToggle');
const siteMenu = document.getElementById('siteMenu');

if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    siteMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            siteMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.textContent = '☰';
        });
    });
}
