# Guide d'Intégration - Système de Paiement avec Données Utilisateur

## 🎯 Vue d'ensemble

Le système de paiement est maintenant **complètement intégré** avec :
- ✅ Récupération automatique des données utilisateur
- ✅ Pré-remplissage du formulaire de paiement
- ✅ Vérification de connexion
- ✅ Redirection depuis panier.html vers paiement.html

---

## 📦 Fichiers Modifiés

### 1. **panier.html** (NOUVEAU)
Le bouton "Procéder au paiement" redirige maintenant vers `paiement.html` avec vérifications :

```html
<a href="paiement.html" class="btn-checkout" id="checkout-btn">
    Procéder au paiement
</a>
```

**Logique JavaScript incluse :**
- Vérifie si le panier est vide
- Vérifie si l'utilisateur est connecté
- Affiche un message de confirmation si l'utilisateur doit se connecter
- Redirige vers `page_de_connection.html` si nécessaire

### 2. **paiement.html** (MODIFIÉ)
Ajout d'un message d'avertissement au-dessus du formulaire :
- S'affiche automatiquement si l'utilisateur n'est pas connecté
- Propose un lien direct vers la connexion
- Désactive le formulaire jusqu'à la connexion

### 3. **dossier javascript/paiement.js** (MODIFIÉ)

#### Nouvelle fonction : `checkUserConnection()`
```javascript
function checkUserConnection() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.email) {
        // Afficher le message d'avertissement
        // Désactiver le formulaire
        return false;
    }
    
    return true;
}
```

#### Pré-remplissage automatique amélioré
Au chargement de la page, les champs suivants sont pré-remplis automatiquement :

```javascript
- Prénom (prenom)
- Nom (nom)
- Email (email)
- Adresse (adresse)
- Titulaire de la carte (nom complet en majuscules)
```

#### Récupération des données utilisateur
Les données viennent de `localStorage` :
```javascript
localStorage.getItem('currentUser')  // Utilisateur actuel connecté
localStorage.getItem('utilisateurs') // Liste de tous les utilisateurs
```

---

## 🔄 Flux de Connexion et Paiement

### Scénario 1 : Utilisateur Non Connecté

```
1. Utilisateur remplit le panier
        ↓
2. Clique sur "Procéder au paiement"
        ↓
3. JavaScript vérifie : localStorage.getItem('currentUser')
        ↓
4. currentUser est vide ou null
        ↓
5. Message de confirmation : "Vous devez être connecté..."
        ↓
6. Si OK → Redirection vers page_de_connection.html
```

### Scénario 2 : Utilisateur Connecté

```
1. Utilisateur remplit le panier
        ↓
2. Clique sur "Procéder au paiement"
        ↓
3. JavaScript vérifie : localStorage.getItem('currentUser')
        ↓
4. currentUser existe avec email
        ↓
5. Redirection directe vers paiement.html
        ↓
6. Le formulaire se pré-remplit automatiquement
        ↓
7. L'utilisateur valide et paie
```

---

## 💾 Structure des Données Utilisateur

Les données stockées par `connection.js` et `utilisateur.js` :

```javascript
{
    nomUtilisateur: "musicien",
    prenom: "Jean",
    nom: "Dupont",
    email: "jean@example.com",
    adresse: "123 rue de la Paix, 1200 Kinshasa",
    motDePasse: "hashedPassword..." // Ne pas utiliser
}
```

---

## 🔍 Points Clés de l'Intégration

### 1. Stockage des Données Utilisateur
Les données proviennent de deux sources dans `localStorage` :

**Lors de la connexion :**
```javascript
// connection.js enregistre l'utilisateur actuel
localStorage.setItem('currentUser', JSON.stringify(user));
```

**Lors de la mise à jour du profil :**
```javascript
// utilisateur.js met à jour les données actuelles
localStorage.setItem('currentUser', JSON.stringify(updatedUser));
```

### 2. Récupération au Paiement
```javascript
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Pré-remplir le formulaire
document.getElementById('first-name').value = currentUser.prenom || '';
document.getElementById('last-name').value = currentUser.nom || '';
document.getElementById('email').value = currentUser.email || '';
document.getElementById('address').value = currentUser.adresse || '';
```

### 3. Vérification de Sécurité
Avant chaque opération sensible (paiement), vérifier :
```javascript
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || !currentUser.email) {
    // Pas connecté → rediriger vers login
    window.location.href = 'page_de_connection.html';
}
```

---

## ✅ Checklist d'Installation

- [x] Fichier `panier.html` créé et configuré
- [x] Fichier `paiement.html` modifié avec avertissement
- [x] Fichier `paiement.js` amélioré avec pré-remplissage
- [x] Fonction `checkUserConnection()` ajoutée
- [x] Redirection depuis panier vers paiement
- [x] Pré-remplissage automatique des champs
- [ ] Tester le flux complet (connexion → panier → paiement)
- [ ] Vérifier la récupération des données utilisateur
- [ ] Tester les messages d'erreur

---

## 🧪 Tests à Effectuer

### Test 1 : Utilisateur Non Connecté
```
1. Aller à panier.html
2. Remplir le panier avec des articles
3. Cliquer sur "Procéder au paiement"
4. ✓ Message de confirmation doit s'afficher
5. ✓ Cliquer OK doit rediriger vers page_de_connection.html
```

### Test 2 : Connexion et Remplissage
```
1. Aller à page_de_connection.html
2. Se connecter avec un compte existant
3. Aller à panier.html
4. Remplir le panier
5. Cliquer sur "Procéder au paiement"
6. ✓ Redirection directe vers paiement.html
7. ✓ Formulaire pré-rempli avec les données
```

### Test 3 : Vérification du Message d'Avertissement
```
1. Ouvrir paiement.html directement (sans connexion)
2. ✓ Message d'avertissement doit s'afficher
3. ✓ Formulaire doit être désactivé
4. ✓ Le lien "Se connecter maintenant" doit fonctionner
```

### Test 4 : LocalStorage
```
Ouvrir la console (F12) et exécuter :

// Voir l'utilisateur actuel
console.log(JSON.parse(localStorage.getItem('currentUser')));

// Voir tous les utilisateurs
console.log(JSON.parse(localStorage.getItem('utilisateurs')));

// Voir le panier
console.log(JSON.parse(localStorage.getItem('cart')));
```

---

## 🔧 Dépannage

### Problème : Le formulaire n'est pas pré-rempli
**Cause :** L'utilisateur n'est pas connecté ou les données ne sont pas sauvegardées
**Solution :**
1. Vérifier que `currentUser` existe dans localStorage
2. Vérifier que les champs de l'utilisateur ont les bons noms
3. Ouvrir la console et exécuter : `localStorage.getItem('currentUser')`

### Problème : Le message d'avertissement ne s'affiche pas
**Cause :** L'ID `auth-warning` n'existe pas ou est mal nommé
**Solution :**
1. Vérifier que paiement.html contient : `<div id="auth-warning">`
2. Vérifier la console pour les erreurs JavaScript

### Problème : Redirection ne fonctionne pas
**Cause :** Les chemins des fichiers sont incorrects
**Solution :**
1. Vérifier les chemins dans les liens :
   - `page_de_connection.html`
   - `paiement.html`
   - `panier.html`
2. Adapter les chemins selon votre structure de dossiers

---

## 📝 Notes Importantes

### Données Sensibles
⚠️ **Le CVV n'est jamais stocké** pour des raisons de sécurité

### Masquage du Numéro de Carte
Le numéro de carte est masqué lors de la sauvegarde :
```javascript
"****-****-****-3456" // Seuls les 4 derniers chiffres visibles
```

### Redirection Sécurisée
La redirection vers la connexion respecte la sécurité :
```javascript
// Ne jamais passer de données sensibles en URL
window.location.href = 'page_de_connection.html';

// Pas comme ça : ❌
// window.location.href = 'page_de_connection.html?email=user@email.com';
```

---

## 🚀 Améliorations Futures

1. **Afficher une confirmation avant paiement**
```javascript
// Ajouter dans setupFormSubmission
const confirmPayment = confirm(
    `Veuillez confirmer votre paiement de ${totalAmount}€`
);
if (!confirmPayment) return;
```

2. **Sauvegarde automatique du formulaire**
```javascript
// Sauvegarder les données au fur et à mesure
paymentForm.addEventListener('change', () => {
    const formData = new FormData(paymentForm);
    localStorage.setItem('paymentFormDraft', JSON.stringify(Object.fromEntries(formData)));
});
```

3. **Historique des commandes dans le profil utilisateur**
```javascript
// Afficher les commandes précédentes dans utilisateur.html
const orders = JSON.parse(localStorage.getItem('orders')) || [];
```

4. **Notification par email (à implémenter côté serveur)**
```javascript
// Envoyer un email après paiement réussi
await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
        to: currentUser.email,
        subject: `Commande confirmée #${orderId}`,
        template: 'order-confirmation'
    })
});
```

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : cymukwkungu@gmail.com
- 📱 Téléphone : +243 972 693 813

---

**✅ Système de paiement intégré et prêt à l'emploi !**