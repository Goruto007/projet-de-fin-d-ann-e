// Gestion du panier
const cartBadge = document.querySelector('.cart-badge');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const cartContent = document.getElementById('cart-content');

// Charger le panier depuis le localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay(cart);
}

// Mettre à jour l'affichage du panier
function updateCartDisplay(cart) {
    cartBadge.textContent = cart.length;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide</p>
                <a href="vente.html" class="btn-continue">Continuer vos achats</a>
            </div>
        `;
        subtotalEl.textContent = '0,00 €';
        taxEl.textContent = '0,00 €';
        totalEl.textContent = '0,00 €';
        return;
    }

    let html = '<div class="cart-items-list">';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}€ x <span id="qty-${index}">${item.quantity}</span></p>
                </div>
                <div class="item-total">
                    ${itemTotal.toFixed(2)}€
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });
    html += '</div>';
    cartContent.innerHTML = html;

    const tax = subtotal * 0.16;
    const total = subtotal + tax;

    subtotalEl.textContent = subtotal.toFixed(2) + ' €';
    taxEl.textContent = tax.toFixed(2) + ' €';
    totalEl.textContent = total.toFixed(2) + ' €';
}

// Ajouter au panier (appelé depuis les autres pages)
window.addToCart = function(emoji, name, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ emoji, name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay(cart);
    alert(`${name} a été ajouté au panier!`);
}

// Retirer du panier
window.removeFromCart = function(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Checkout
document.getElementById('checkout-btn').addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    alert('Redirection vers le paiement...\n\nArticles: ' + cart.length);
});

// Charger le panier au chargement de la page
loadCart();

// Menu hamburger
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
