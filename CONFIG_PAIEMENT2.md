# ⚙️ Guide de Configuration et Intégration Finale

## 🎯 Objectif

Ce guide vous montre comment intégrer complètement le système de paiement avec les données utilisateur dans votre site Chris & Compagnie.

---

## 📁 Structure de Dossiers Requise

```
votre-projet/
│
├── index.html
├── panier.html                          [NOUVEAU]
├── paiement.html                        [NOUVEAU]
├── confirmation.html                    [NOUVEAU]
├── page_de_connection.html              [EXISTANT]
├── utilisateur.html                     [EXISTANT]
├── vente.html                           [EXISTANT]
├── location.html                        [EXISTANT]
├── maintenance.html                     [EXISTANT]
│
├── dossier css/
│   ├── theme.css
│   ├── index.css
│   ├── panier.css
│   ├── paiement.css                     [NOUVEAU]
│   ├── vente.css
│   ├── utilisateur.css
│   └── ... autres fichiers
│
├── dossier javascript/
│   ├── connection.js                    [MODIFIÉ]
│   ├── utilisateur.js                   [MODIFIÉ]
│   ├── panier.js                        [EXISTANT]
│   ├── paiement.js                      [NOUVEAU]
│   └── ... autres fichiers
│
└── instrument á vendre/
    └── ... images
```

---

## 🔧 Configuration des Chemins

### 1. Dans panier.html

```html
<!-- Lien CSS -->
<link rel="stylesheet" href="dossier css/panier.css">

<!-- Lien JavaScript -->
<script src="dossier javascript/panier.js"></script>

<!-- Bouton paiement -->
<a href="paiement.html" class="btn-checkout">Procéder au paiement</a>
```

### 2. Dans paiement.html

```html
<!-- Lien CSS -->
<link rel="stylesheet" href="dossier css/paiement.css">

<!-- Lien JavaScript -->
<script src="dossier javascript/paiement.js"></script>

<!-- Redirection page de connexion -->
<a href="page_de_connection.html">Se connecter</a>
```

### 3. Dans confirmation.html

```html
<!-- Lien CSS -->
<link rel="stylesheet" href="dossier css/theme.css">

<!-- Lien vers utilisateur -->
<a href="utilisateur.html">Voir mon compte</a>
```

---

## 📝 Modification de panier.html Existant

Si vous avez déjà un panier.html, ajoutez ceci :

```html
<!-- Remplacer le bouton -->
<!-- AVANT -->
<button class="btn-checkout" id="checkout-btn">Procéder au paiement</button>

<!-- APRÈS -->
<a href="paiement.html" class="btn-checkout" id="checkout-btn">Procéder au paiement</a>
```

```javascript
// Ajouter ce script à la fin du body
<script>
    const checkoutBtn = document.getElementById('checkout-btn');

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Vérifier si le panier est vide
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Votre panier est vide!');
            return;
        }

        // Vérifier si l'utilisateur est connecté
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser || !currentUser.email) {
            if (confirm('Vous devez être connecté pour accéder au paiement.\n\nVoulez-vous vous connecter maintenant?')) {
                window.location.href = 'page_de_connection.html';
            }
            return;
        }

        // Rediriger vers le paiement
        window.location.href = 'paiement.html';
    });
</script>
```

---

## 🔑 Clés localStorage à Vérifier

### Dans connection.js (VÉRIFIER)

```javascript
// ✓ La clé doit être 'currentUser' (exactement)
localStorage.setItem('currentUser', JSON.stringify(user));

// ✓ Les champs doivent être nommés ainsi :
// - prenom (pas firstName, firstname ou autre)
// - nom (pas lastName, lastname ou autre)
// - email
// - adresse (pas address, address ou autre)
// - motDePasse
// - nomUtilisateur
```

### Dans utilisateur.js (VÉRIFIER)

```javascript
// ✓ La mise à jour doit aussi utiliser 'currentUser'
localStorage.setItem('currentUser', JSON.stringify(updatedUser));

// ✓ Les noms de champs doivent être identiques
// Si l'utilisateur change son prénom, mettre à jour correctement
```

---

## 🧪 Checklist d'Installation

### Étape 1 : Fichiers
- [ ] Copier `paiement.html` dans le dossier racine
- [ ] Copier `confirmation.html` dans le dossier racine
- [ ] Copier `panier.html` dans le dossier racine (ou mettre à jour l'existant)
- [ ] Copier `paiement.js` dans `dossier javascript/`
- [ ] Copier `paiement.css` dans `dossier css/`

### Étape 2 : Vérifications
- [ ] Vérifier les chemins relatifs dans les balises `<link>` et `<script>`
- [ ] Vérifier que `page_de_connection.html` existe et est nommé correctement
- [ ] Vérifier que `utilisateur.html` existe
- [ ] Vérifier que `dossier css/theme.css` existe

### Étape 3 : localStorage
- [ ] Vérifier que connection.js sauvegarde `currentUser` avec les bons noms de champs
- [ ] Vérifier que utilisateur.js met à jour `currentUser` correctement
- [ ] Vérifier que panier.js sauvegarde `cart` correctement

### Étape 4 : Tests
- [ ] Se connecter sur page_de_connection.html
- [ ] Aller à vente.html et ajouter des articles
- [ ] Aller à panier.html
- [ ] Cliquer "Procéder au paiement"
- [ ] Vérifier que le formulaire est pré-rempli
- [ ] Remplir les champs supplémentaires (carte, CVV, etc.)
- [ ] Cliquer "Payer maintenant"
- [ ] Vérifier la redirection vers confirmation.html

---

## 🐛 Dépannage des Noms de Champs

Si le pré-remplissage ne fonctionne pas, **c'est généralement un problème de noms de champs**.

### Vérifier dans connection.js

```javascript
// ✓ BON
const user = {
    nomUtilisateur: "jean_dupont",
    prenom: "Jean",          // ← pas "firstName"
    nom: "Dupont",           // ← pas "lastName"
    email: "jean@example.com",
    adresse: "123 rue...",   // ← pas "address"
    motDePasse: "hashed..."
};
localStorage.setItem('currentUser', JSON.stringify(user));

// ✗ MAUVAIS (ne fonctionnera pas)
const user = {
    nomUtilisateur: "jean_dupont",
    firstName: "Jean",       // ✗ Mauvais nom
    lastName: "Dupont",      // ✗ Mauvais nom
    email: "jean@example.com",
    address: "123 rue...",   // ✗ Mauvais nom
    password: "hashed..."    // ✗ Mauvais nom
};
```

### Adapter si les noms sont différents

Si votre connection.js utilise d'autres noms (par exemple `firstName` au lieu de `prenom`), modifier dans `paiement.js` :

```javascript
// TROUVER CETTE SECTION (ligne ~800)
if (userData.prenom) {
    document.getElementById('first-name').value = userData.prenom.trim();
}

if (userData.nom) {
    document.getElementById('last-name').value = userData.nom.trim();
}

// ADAPTER SELON VOS NOMS DE CHAMPS
// Si vous utilisez firstName et lastName :
if (userData.firstName) {
    document.getElementById('first-name').value = userData.firstName.trim();
}

if (userData.lastName) {
    document.getElementById('last-name').value = userData.lastName.trim();
}
```

---

## 🔒 Sécurité - Points Important

### ✅ CE QUI EST FAIT
- ✓ CVV n'est jamais stocké
- ✓ Numéro de carte est masqué (****-****-****-1111)
- ✓ Validation côté client robuste

### ⚠️ À IMPLÉMENTER CÔTÉ SERVEUR

Avant de mettre en production :

```javascript
// ✗ NE PAS faire ceci en production
// Les données de paiement sensibles ne doivent JAMAIS
// être stockées en localStorage seul

// ✓ À FAIRE : Utiliser un service de paiement
// - Stripe
// - PayPal
// - Molly
// - Etc.

// Exemple avec Stripe
const response = await fetch('/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        amount: totalAmount,
        currency: 'USD',
        // Les données sensibles sont envoyées au serveur
        // Le serveur contacte Stripe directement
    })
});
```

---

## 📞 Support des Noms de Champs

Si vous avez un problème de pré-remplissage, créer un fichier de debug :

```javascript
// debug.js - À ajouter temporairement
window.debugPayment = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('=== DEBUG PAYMENT ===');
    console.log('currentUser:', currentUser);
    console.log('Champs disponibles:', Object.keys(currentUser));
    
    // Vérifier les valeurs spécifiques
    console.log('prenom:', currentUser?.prenom);
    console.log('nom:', currentUser?.nom);
    console.log('email:', currentUser?.email);
    console.log('adresse:', currentUser?.adresse);
};

// Appeler dans la console
// debugPayment()
```

Puis ouvrir la console (F12) et exécuter : `debugPayment()`

---

## 🚀 Lancement en Production

Avant de mettre en ligne :

### 1. Tests locaux complets
```bash
# Tester tous les navigateurs (Chrome, Firefox, Safari, Edge)
# Tester sur mobile
# Tester avec différents niveaux de connexion
```

### 2. Vérifier les erreurs console
```
F12 → Onglet "Console"
S'assurer qu'il n'y a pas d'erreurs JavaScript
```

### 3. Tester le flux complet
```
1. Connexion → ✓
2. Ajouter article → ✓
3. Panier → ✓
4. Paiement → ✓
5. Confirmation → ✓
```

### 4. Sauvegarder les commandes
```
localStorage['orders'] doit contenir les commandes
Implémenter une sauvegarde en base de données
```

### 5. Envoyer des emails
```
Implémenter l'envoi d'email de confirmation
Intégrer un service comme SendGrid, Mailgun, etc.
```

---

## 📊 Exemple de localStorage.getItem('currentUser')

```javascript
{
    nomUtilisateur: "jean_dupont",
    prenom: "Jean",
    nom: "Dupont",
    email: "jean@example.com",
    adresse: "123 rue de la Paix, 1200 Kinshasa",
    motDePasse: "$2b$10$... hashed ..."
}
```

Chaque champ en minuscules, exactement comme montré ci-dessus.

---

## 🎯 Résumé des Modifications

| Fichier | Action | Importance |
|---------|--------|------------|
| panier.html | CRÉER ou MODIFIER | 🔴 CRITICAL |
| paiement.html | CRÉER | 🔴 CRITICAL |
| paiement.js | CRÉER | 🔴 CRITICAL |
| paiement.css | CRÉER | 🟡 IMPORTANT |
| confirmation.html | CRÉER | 🟡 IMPORTANT |
| connection.js | VÉRIFIER | 🟡 IMPORTANT |
| utilisateur.js | VÉRIFIER | 🟡 IMPORTANT |

---

## 💡 Tips & Tricks

### Conseil 1 : Utiliser les DevTools
```
F12 → Application → Local Storage
Voir exactement ce qui est stocké
Modifier les valeurs pour tester
```

### Conseil 2 : Console Debugging
```javascript
// Ajouter dans paiement.js après chaque opération importante
console.log('currentUser:', JSON.parse(localStorage.getItem('currentUser')));
console.log('cart:', JSON.parse(localStorage.getItem('cart')));
console.log('orders:', JSON.parse(localStorage.getItem('orders')));
```

### Conseil 3 : Tester sans connexion
```javascript
// Dans la console
localStorage.removeItem('currentUser');
// Rechargez la page paiement
// Le message d'avertissement doit s'afficher
```

### Conseil 4 : Réinitialiser tout
```javascript
// Dans la console pour un test propre
localStorage.clear();
// OU plus sélectif
localStorage.removeItem('currentUser');
localStorage.removeItem('cart');
```

---

## 📚 Documentation Supplémentaire

- PAIEMENT_README.md : Documentation générale du système
- INTEGRATION_PAIEMENT.md : Guide d'intégration détaillé
- FLUX_PAIEMENT_DIAGRAM.md : Diagrammes visuels du flux
- CONFIG_PAIEMENT.md : Ce fichier (configuration)

---

**✅ Configuration complète et prêt à l'emploi !**

Pour toute question : cymukwkungu@gmail.com