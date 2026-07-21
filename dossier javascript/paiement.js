/**
 * Système de paiement - Chris & Compagnie
 * Gère la validation, le traitement et la sauvegarde des commandes
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
const paymentForm = document.getElementById('payment-form');
const cartBadge = document.querySelector('.cart-badge');
const paymentModal = document.getElementById('payment-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalLoading = document.getElementById('modal-loading');
const modalAction = document.getElementById('modal-action');
const modalClose = document.getElementById('modal-close');

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier la connexion de l'utilisateur
    const isConnected = checkUserConnection();
    
    loadCart();
    setupFormFormatting();
    setupFormValidation();
    setupFormSubmission();
    updateCartBadge();

    // Ajouter une classe au formulaire si pas connecté
    if (!isConnected) {
        paymentForm.style.opacity = '0.6';
        paymentForm.style.pointerEvents = 'none';
    }
});

// ============================================
// CHARGEMENT ET AFFICHAGE DU PANIER
// ============================================
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showEmptyCart();
        paymentForm.style.display = 'none';
        return;
    }
    
    displayOrderItems(cart);
    calculateTotals(cart);
}

function displayOrderItems(cart) {
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <span class="item-emoji">${item.emoji}</span>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity}</p>
                </div>
            </div>
            <div class="item-price">
                <span class="price">${(item.price * item.quantity).toFixed(2)} fc</span>
                <span class="unit-price">(${item.price.toFixed(2)} fc x ${item.quantity})</span>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
}

function calculateTotals(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);  
    const tax = subtotal * 0.16;
    
    document.getElementById('summary-subtotal').textContent = subtotal.toFixed(2) + ' fc';
    document.getElementById('summary-tax').textContent = tax.toFixed(2) + ' fc';
    document.getElementById('summary-total').textContent = (subtotal + tax).toFixed(2) + ' fc';
}

function showEmptyCart() {
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = `
        <div class="empty-message">
            <p>Votre panier est vide</p>
            <a href="vente.html" class="btn-primary">Continuer les achats</a>
        </div>
    `;
}

// ============================================
// FORMATAGE DES CHAMPS
// ============================================
function setupFormFormatting() {
    // Formatage du numéro de carte (espaces tous les 4 chiffres)
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });

    // Formatage de la date d'expiration (MM/AA)
    const expiryInput = document.getElementById('expiry');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // Formatage du CVV (chiffres uniquement)
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Formatage du téléphone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        // Format simple: afficher tel quel
        e.target.value = value;
    });
}

// ============================================
// VALIDATION DU FORMULAIRE
// ============================================
function setupFormValidation() {
    const inputs = paymentForm.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('change', () => validateField(input));
    });
}

function validateField(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`error-${field.id}`);
    let error = '';

    switch(fieldName) {
        case 'firstName':
        case 'lastName':
            if (!field.value.trim()) {
                error = 'Ce champ est requis';
            } else if (field.value.length < 2) {
                error = 'Minimum 2 caractères';
            }
            break;

        case 'email':
            if (!field.value.trim()) {
                error = 'Email requis';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                error = 'Email invalide';
            }
            break;

        case 'phone':
            if (!field.value.trim()) {
                error = 'Téléphone requis';
            } else if (field.value.replace(/\D/g, '').length < 9) {
                error = 'Numéro invalide';
            }
            break;

        case 'address':
        case 'city':
            if (!field.value.trim()) {
                error = 'Ce champ est requis';
            }
            break;

        case 'postalCode':
            if (!field.value.trim()) {
                error = 'Code postal requis';
            } else if (field.value.length < 3) {
                error = 'Code postal invalide';
            }
            break;

        case 'cardHolder':
            if (!field.value.trim()) {
                error = 'Nom du titulaire requis';
            }
            break;

        case 'cardNumber':
            let cardNum = field.value.replace(/\s/g, '');
            if (!cardNum) {
                error = 'Numéro de carte requis';
            } else if (cardNum.length !== 16) {
                error = 'Numéro de carte invalide (16 chiffres)';
            } else if (!isValidCardNumber(cardNum)) {
                error = 'Numéro de carte invalide';
            }
            break;

        case 'expiry':
            if (!field.value.trim()) {
                error = 'Date requise';
            } else if (!/^\d{2}\/\d{2}$/.test(field.value)) {
                error = 'Format: MM/AA';
            } else if (!isValidExpiry(field.value)) {
                error = 'Carte expirée';
            }
            break;

        case 'cvv':
            if (!field.value.trim()) {
                error = 'CVV requis';
            } else if (field.value.length !== 3) {
                error = '3 chiffres requis';
            }
            break;
    }

    if (errorElement) {
        errorElement.textContent = error;
        field.classList.toggle('error', !!error);
    }

    return !error;
}

// Validation du numéro de carte (algorithme de Luhn)


// Vérifier si la carte est expirée
function isValidExpiry(expiry) {
    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return expiryMonth >= 1 && expiryMonth <= 12;
}

// ============================================
// SOUMISSION DU FORMULAIRE
// ============================================
function setupFormSubmission() {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Vérifier d'abord la connexion
        if (!checkUserConnection()) {
            alert('Veuillez vous connecter avant de continuer');
            window.location.href = 'page_de_connection.html';
            return;
        }

        // Vérifier que le panier n'est pas vide
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Votre panier est vide!');
            window.location.href = 'panier.html';
            return;
        }

        // Valider tous les champs
        const inputs = paymentForm.querySelectorAll('input[required]');
        let isFormValid = true;

        

        // Vérifier les conditions
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            isFormValid = false;
            const errorElement = document.getElementById('error-terms');
            if (errorElement) {
                errorElement.textContent = 'Vous devez accepter les conditions';
            }
        }

        if (!isFormValid) {
            alert('Veuillez corriger les erreurs du formulaire');
            return;
        }

        // Traiter le paiement
        await processPayment();
    });
}

// ============================================
// TRAITEMENT DU PAIEMENT
// ============================================
async function processPayment() {
    // Afficher le modal de traitement
    openPaymentModal('Traitement du paiement', 'Veuillez patienter...');

    try {
        // Récupérer les données du formulaire
        const formData = new FormData(paymentForm);
        const paymentData = {
            personal: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
            },
            address: {
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode'),
            },
            card: {
                holder: formData.get('cardHolder'),
                number: maskCardNumber(formData.get('cardNumber')),
                expiry: formData.get('expiry'),
            },
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            timestamp: new Date().toISOString(),
        };

        // Simuler le traitement du paiement (2-3 secondes)
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Sauvegarder la commande
        saveOrder(paymentData);

        // Afficher le succès
        updatePaymentModal(
            'Paiement réussi ✓',
            `<div class="success-message">
                <p>Votre paiement a été traité avec succès!</p>
                <p>Numéro de commande: <strong>#${generateOrderNumber()}</strong></p>
                <p>Un email de confirmation a été envoyé à <strong>${paymentData.personal.email}</strong></p>
            </div>`
        );

        // Changer l'action du bouton
        modalAction.textContent = 'Voir la confirmation';
        modalAction.onclick = () => {
            localStorage.removeItem('cart');
            window.location.href = 'confirmation.html';
        };

    } catch (error) {
        console.error('Erreur lors du paiement:', error);
        updatePaymentModal(
            'Erreur ✗',
            `<div class="error-message">
                <p>Une erreur s'est produite lors du paiement.</p>
                <p>${error.message}</p>
                <p>Veuillez réessayer ou contacter le support.</p>
            </div>`
        );

        modalAction.textContent = 'Réessayer';
        modalAction.onclick = () => closePaymentModal();
    }
}

function openPaymentModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = `<p>${message}</p>`;
    modalLoading.style.display = 'block';
    modalAction.style.display = 'none';
    paymentModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function updatePaymentModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = message;
    modalLoading.style.display = 'none';
    modalAction.style.display = 'block';
}

function closePaymentModal() {
    paymentModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

modalClose.addEventListener('click', closePaymentModal);

// ============================================
// SAUVEGARDE DE LA COMMANDE
// ============================================
function saveOrder(paymentData) {
    // Récupérer les commandes existantes
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Ajouter la nouvelle commande
    const order = {
        id: generateOrderNumber(),
        ...paymentData,
        status: 'completed',
        totalAmount: calculateOrderTotal(paymentData.cart),
    };

    orders.push(order);

    // Sauvegarder dans localStorage
    localStorage.setItem('orders', JSON.stringify(orders));

    // Vider le panier
    localStorage.removeItem('cart');

    console.log('Commande sauvegardée:', order);
}

// ============================================
// UTILITAIRES
// ============================================
function maskCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const last4 = cleaned.slice(-4);
    return `****-****-****-${last4}`;
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
}

function calculateOrderTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.16;
    return subtotal + tax;
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartBadge.textContent = cart.length;
}

// ============================================
// ÉCOUTE DES CHANGEMENTS DE LOCALSTORAGE
// ============================================
window.addEventListener('storage', updateCartBadge);

// ============================================
// REMPLISSAGE AUTOMATIQUE UTILISATEUR
// ============================================
window.addEventListener('load', () => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.email) {
        console.warn('Utilisateur non connecté. Redirection vers la connexion...');
        // Optionnel: rediriger vers la connexion
        // window.location.href = 'page_de_connection.html';
        // return;
    }

    // Récupérer les données de l'utilisateur
    const userData = currentUser || JSON.parse(localStorage.getItem('utilisateurs'))?.[0] || {};

    // Pré-remplir les champs avec les données de l'utilisateur
    if (userData.prenom) {
        document.getElementById('first-name').value = userData.prenom.trim();
    }
    
    if (userData.nom) {
        document.getElementById('last-name').value = userData.nom.trim();
    }
    
    if (userData.email) {
        document.getElementById('email').value = userData.email.trim();
    }
    
    // Pré-remplir l'adresse si disponible
    if (userData.adresse) {
        document.getElementById('address').value = userData.adresse.trim();
    }

    // Pré-remplir le titulaire de la carte avec le nom complet
    if (userData.prenom && userData.nom) {
        const fullName = `${userData.nom.toUpperCase()} ${userData.prenom.toUpperCase()}`;
        document.getElementById('card-holder').value = fullName;
    }

    console.log('✓ Formulaire pré-rempli avec les données utilisateur');
});

// ============================================
// VÉRIFICATION DE CONNEXION
// ============================================
function checkUserConnection() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authWarning = document.getElementById('auth-warning');
    
    if (!currentUser || !currentUser.email) {
        // Afficher le message d'avertissement
        if (authWarning) {
            authWarning.style.display = 'block';
        }
        
        console.warn('⚠️ Utilisateur non connecté');
        return false;
    }
    
    // L'utilisateur est connecté
    if (authWarning) {
        authWarning.style.display = 'none';
    }
    
    console.log('✓ Utilisateur connecté:', currentUser.email);
    return true;
}