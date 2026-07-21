// Gestion du panier
const cartBadge = document.querySelector('.cart-badge');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const cartContent = document.getElementById('cart-content');

function getCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.map((item) => ({
        emoji: item.emoji,
        name: item.name || item.nomProduit || '',
        price: Number(item.price ?? item.prix) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
    }));
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount(cart) {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function getShippingCost(subtotal) {
    return subtotal > 100 ? 0 : 15;
}

// Charger le panier depuis le localStorage
function loadCart() {
    const cart = getCart();
    saveCart(cart);
    updateCartDisplay(cart);
}

// Mettre à jour l'affichage du panier
function updateCartDisplay(cart) {
    if (!cartBadge || !subtotalEl || !shippingEl || !taxEl || !totalEl || !cartContent) {
        return;
    }

    cartBadge.textContent = getCartCount(cart);

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide</p>
                <a href="vente.html" class="btn-continue">Continuer vos achats</a>
            </div>
        `;
        subtotalEl.textContent = '0,00 fc';
        shippingEl.textContent = 'Gratuit';
        taxEl.textContent = '0,00 fc';
        totalEl.textContent = '0,00 fc';
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
                    <p>${item.price.toFixed(2)} fc x <span id="qty-${index}">${item.quantity}</span></p>
                </div>
                <div class="item-total">
                    ${itemTotal.toFixed(2)} fc
                </div>
                <button class="btn-remove" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
    });
    html += '</div>';
    cartContent.innerHTML = html;

    const tax = subtotal * 0.16;
    const shipping = getShippingCost(subtotal);
    const total = subtotal + shipping + tax;

    subtotalEl.textContent = subtotal.toFixed(2) + ' fc';
    taxEl.textContent = tax.toFixed(2) + ' fc';
    totalEl.textContent = total.toFixed(2) + ' fc';
}

// Ajouter au panier (appelé depuis les autres pages)
window.addToCart = function(emoji, nomProduit, prix) {
    const cart = getCart();
    const numericPrice = Number(prix) || 0;
    const existingItem = cart.find(item => item.name === nomProduit);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ emoji, name: nomProduit, price: numericPrice, quantity: 1 });
    }

    saveCart(cart);
    updateCartDisplay(cart);
    alert(`${nomProduit} a été ajouté au panier!`);

    

};

// Retirer du panier
window.removeFromCart = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
};
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
