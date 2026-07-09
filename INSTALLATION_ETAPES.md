# 🚀 Instructions d'Intégration - Étape par Étape

## 📋 Table des Matières
1. [Préparation](#préparation)
2. [Installation des Fichiers](#installation-des-fichiers)
3. [Configuration](#configuration)
4. [Tests](#tests)
5. [Dépannage](#dépannage)

---

## 🎯 Préparation

### Avant de commencer

Assurez-vous d'avoir :
- [ ] Une copie locale de votre projet Chris & Compagnie
- [ ] Les fichiers de paiement (voir [Installation](#installation-des-fichiers))
- [ ] Accès à votre navigateur (Chrome, Firefox, Edge, Safari)
- [ ] Console DevTools (F12)

### Vérifier votre structure actuelle

Ouvrez votre projet et vérifiez que vous avez :
```
✓ index.html
✓ page_de_connection.html
✓ utilisateur.html
✓ vente.html
✓ location.html
✓ maintenance.html
✓ dossier css/theme.css
✓ dossier javascript/connection.js
✓ dossier javascript/utilisateur.js
```

---

## 📦 Installation des Fichiers

### Étape 1 : Copier les Fichiers HTML

**Fichiers à copier dans le **dossier racine** :**

1. `paiement.html` → `votre-projet/paiement.html`
2. `confirmation.html` → `votre-projet/confirmation.html`
3. `panier.html` → `votre-projet/panier.html`

**✓ Dossier racine = même niveau que index.html**

### Étape 2 : Copier les Fichiers CSS

**Fichier à copier dans `dossier css/` :**

1. `paiement.css` → `votre-projet/dossier css/paiement.css`

### Étape 3 : Copier les Fichiers JavaScript

**Fichier à copier dans `dossier javascript/` :**

1. `paiement.js` → `votre-projet/dossier javascript/paiement.js`

### Vérifier la Structure

```
votre-projet/
├── index.html
├── paiement.html           ✓ NOUVEAU
├── confirmation.html       ✓ NOUVEAU
├── panier.html             ✓ NOUVEAU ou MODIFIÉ
├── page_de_connection.html
├── utilisateur.html
├── ...
├── dossier css/
│   ├── theme.css
│   ├── paiement.css        ✓ NOUVEAU
│   └── ...
└── dossier javascript/
    ├── connection.js
    ├── paiement.js         ✓ NOUVEAU
    ├── utilisateur.js
    └── ...
```

---

## ⚙️ Configuration

### Étape 1 : Vérifier les Noms de Champs

**CRUCIAL ! Ouvrez `connection.js` et vérifiez :**

```javascript
// Chercher la fonction enregistrerUtilisateur()
function enregistrerUtilisateur() {
    const nouvelUtilisateur = {
        nomUtilisateur: ...,  // ✓ Doit être "nomUtilisateur"
        prenom: ...,          // ✓ Doit être "prenom" (pas "firstName")
        nom: ...,             // ✓ Doit être "nom" (pas "lastName")
        email: ...,           // ✓ Doit être "email"
        adresse: ...,         // ✓ Doit être "adresse" (pas "address")
        motDePasse: ...       // ✓ Doit être "motDePasse"
    };
    
    localStorage.setItem('currentUser', JSON.stringify(nouvelUtilisateur));
    // ...
}
```

**Les noms doivent être EXACTEMENT comme ci-dessus, sinon le pré-remplissage ne fonctionnera pas.**

### Étape 2 : Vérifier utilisateur.js

**Ouvrir `utilisateur.js` et vérifier :**

```javascript
// Chercher la fonction saveUser()
function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    // ...
}

// Les champs doivent matcher :
const updatedUser = {
    nomUtilisateur: ...,  // ✓ OK
    prenom: ...,          // ✓ OK
    nom: ...,             // ✓ OK
    email: ...,           // ✓ OK
    adresse: ...,         // ✓ OK
    motDePasse: ...       // ✓ OK
};
```

### Étape 3 : Tester les Liens Internes

**Ouvrir `panier.html` et vérifier les liens :**

```html
<!-- VÉRIFIER CES LIENS -->
<link rel="stylesheet" href="dossier css/panier.css"> ✓
<script src="dossier javascript/panier.js"></script> ✓
<a href="paiement.html">Procéder au paiement</a> ✓
<a href="page_de_connection.html">Se connecter</a> ✓
```

**Vérifier `paiement.html` :**

```html
<link rel="stylesheet" href="dossier css/paiement.css"> ✓
<script src="dossier javascript/paiement.js"></script> ✓
<a href="page_de_connection.html">Se connecter</a> ✓
```

---

## 🧪 Tests

### Test 1 : Vérifier la Sauvegarde de l'Utilisateur

1. **Ouvrir `page_de_connection.html`**
2. **Cliquer sur "Inscription"**
3. **Remplir le formulaire :**
   - Nom d'utilisateur : `testuser`
   - Prénom : `Test`
   - Nom : `User`
   - Email : `test@example.com`
   - Adresse : `123 Test Street`
   - Mot de passe : `password123`

4. **Cliquer "Créer mon compte"**
5. **Ouvrir la console (F12)**
6. **Exécuter :**
   ```javascript
   JSON.parse(localStorage.getItem('currentUser'))
   ```
7. **Vérifier l'output :**
   ```javascript
   {
       nomUtilisateur: "testuser",
       prenom: "Test",
       nom: "User",
       email: "test@example.com",
       adresse: "123 Test Street",
       motDePasse: "..."
   }
   ```

✓ Si vous voyez les bonnes données → **SUCCÈS**
✗ Si vous voyez des noms différents → Modifier `connection.js`

### Test 2 : Ajouter des Articles au Panier

1. **Aller à `vente.html`**
2. **Ajouter 2-3 articles au panier**
3. **Ouvrir la console et exécuter :**
   ```javascript
   JSON.parse(localStorage.getItem('cart'))
   ```
4. **Vérifier que les articles sont listés**

✓ Si vous voyez les articles → **SUCCÈS**
✗ Si le panier est vide → Vérifier `panier.js`

### Test 3 : Naviguer vers le Paiement

1. **Aller à `panier.html`**
2. **Voir le résumé du panier**
3. **Cliquer "Procéder au paiement"**
4. **Vérifier :**
   - ✓ Redirection vers `paiement.html`
   - ✓ Pas de message d'erreur dans la console

### Test 4 : Pré-remplissage du Formulaire

1. **Sur `paiement.html`, vérifier que les champs sont remplis :**
   - Prénom : `Test` ✓
   - Nom : `User` ✓
   - Email : `test@example.com` ✓
   - Adresse : `123 Test Street` ✓
   - Titulaire : `USER TEST` ✓

✓ Si tous les champs sont remplis → **SUCCÈS**
✗ Si les champs sont vides → Vérifier les noms de champs dans `connection.js`

### Test 5 : Validation du Formulaire

1. **Laisser le champ "Numéro de carte" vide**
2. **Cliquer "Payer maintenant"**
3. **Vérifier :**
   - Message d'erreur s'affiche : "Numéro de carte requis" ✓

✓ Si l'erreur s'affiche → **SUCCÈS**
✗ Si rien ne se passe → Vérifier la console

### Test 6 : Paiement Réussi

1. **Remplir le formulaire avec :**
   - Carte : `4111 1111 1111 1111`
   - Expiration : `12/25`
   - CVV : `123`
   - Titulaire : `TEST USER` (ou accepter le pré-rempli)
   - ✓ Accepter les conditions

2. **Cliquer "Payer maintenant"**
3. **Vérifier :**
   - Modal de traitement s'affiche ✓
   - Après 2-3 secondes, "Paiement réussi ✓" s'affiche ✓
   - Bouton "Voir la confirmation" apparaît ✓

4. **Cliquer "Voir la confirmation"**
5. **Vérifier :**
   - Redirection vers `confirmation.html` ✓
   - Numéro de commande affiché (#ORD-...) ✓
   - Email affiché : `test@example.com` ✓

✓ Si tout fonctionne → **SYSTÈME COMPLET** 🎉

---

## 🐛 Dépannage

### Problème 1 : Paiement ne redirige pas vers paiement.html

**Symptôme :** Cliquer "Procéder au paiement" ne fait rien

**Solution :**
```javascript
// Ouvrir la console (F12)
// Vérifier :
localStorage.getItem('currentUser')  // Doit exister et avoir email
localStorage.getItem('cart')         // Doit contenir des articles

// Si currentUser est null → l'utilisateur n'est pas connecté
// Si cart est vide → le panier n'a pas d'articles
```

### Problème 2 : Formulaire ne se pré-remplit pas

**Symptôme :** Les champs restent vides sur paiement.html

**Solution :**
```javascript
// Ouvrir la console
// Exécuter :
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log(Object.keys(user)); // Voir les noms de champs

// Vérifier si vous voyez :
// ['nomUtilisateur', 'prenom', 'nom', 'email', 'adresse', ...]

// Si vous voyez ['firstName', 'lastName', ...] au lieu de ['prenom', 'nom', ...]
// → Modifier les noms dans connection.js
```

### Problème 3 : Message d'avertissement "Pas connecté" apparaît

**Symptôme :** Sur paiement.html, voir "⚠️ Vous n'êtes pas connecté"

**Solution :**
```javascript
// Ouvrir la console
// Exécuter :
localStorage.getItem('currentUser')  // Doit retourner une chaîne JSON

// Si retour : null ou undefined
// → Vous n'êtes pas connecté, allez vous connecter d'abord

// Si retour : {...} mais pas d'email
// → Modifier connection.js pour toujours sauvegarder email
```

### Problème 4 : Erreur "Numéro de carte invalide"

**Symptôme :** Même avec `4111 1111 1111 1111`, erreur persiste

**Solution :**
```javascript
// Ouvrir la console
// Exécuter :
// Copier le numéro exact : 4111 1111 1111 1111
// Vérifier qu'il y a bien 16 chiffres (sans espaces)

// Le JavaScript retire automatiquement les espaces
// Donc "4111 1111 1111 1111" devient "4111111111111111"
```

### Problème 5 : Commande pas sauvegardée

**Symptôme :** Après paiement, pas de numéro de commande

**Solution :**
```javascript
// Ouvrir la console
// Exécuter :
JSON.parse(localStorage.getItem('orders'))

// Doit retourner un tableau avec les commandes
// Si vide ou null → vérifier paiement.js
// Chercher la fonction saveOrder()
```

---

## ✅ Checklist Finale

Avant de mettre en ligne :

- [ ] Tous les fichiers sont copiés
- [ ] Les noms de champs correspondent (prenom, nom, email, adresse)
- [ ] Test 1 : Inscription fonctionne
- [ ] Test 2 : Panier fonctionne
- [ ] Test 3 : Redirection vers paiement fonctionne
- [ ] Test 4 : Pré-remplissage fonctionne
- [ ] Test 5 : Validation fonctionne
- [ ] Test 6 : Paiement complet fonctionne
- [ ] Aucune erreur dans la console
- [ ] Testé sur mobile aussi
- [ ] Commandedes sauvegardées dans localStorage['orders']

---

## 📞 En cas de Problème

**Ouvrir la console (F12) et exécuter :**

```javascript
// Debug complet
console.log('=== SYSTÈME DE PAIEMENT DEBUG ===');
console.log('Utilisateur:', JSON.parse(localStorage.getItem('currentUser')));
console.log('Panier:', JSON.parse(localStorage.getItem('cart')));
console.log('Commandes:', JSON.parse(localStorage.getItem('orders')));

// Vérifier les chemins
console.log('Chemin actuel:', window.location.href);
```

**Envoyer les logs à :**
- Email : cymukwkungu@gmail.com
- Téléphone : +243 972 693 813

---

**🎉 Système de paiement intégré avec succès !**

Vous pouvez maintenant accepter les commandes de vos clients!