# Documentation complète de la syntaxe JavaScript — Chris & Compagnie

Ce document recense **toute la syntaxe JavaScript** utilisée dans le projet, avec des extraits réels du code et une explication de chaque élément.

## Fichiers analysés

**Fichiers `.js` dédiés :**
- `dossier javascript/connection.js`
- `dossier javascript/vente.js`
- `dossier javascript/panier.js`
- `dossier javascript/panier .js` (ancienne version, avec espace dans le nom)
- `dossier javascript/utilisateur.js`
- `dossier javascript/paiement.js`

**Scripts `<script>` intégrés dans les pages HTML** (mêmes patterns + quelques variantes) :
`index.html`, `index_base.html`, `maintenance.html`, `location.html`, `confirmation.html`

---

## 1. Déclaration de variables

Le projet utilise exclusivement `const` et `let` (aucun `var` nulle part — style ES6+).

### 1.1 `const` — variable non réassignable
```js
const cartBadge = document.querySelector('.cart-badge');
const nouvelUtilisateur = { ... };
```
`const` déclare une référence qui ne peut pas être réaffectée. Notez que le **contenu** d'un objet ou tableau `const` reste modifiable (ex. `cart.push(...)` sur un `const cart`).

### 1.2 `let` — variable réassignable
```js
let error = '';
let sum = 0;
let isEven = false;
let value = e.target.value.replace(/\s/g, '');
```
Utilisé quand la valeur doit changer en cours de fonction (accumulateurs, drapeaux, construction de chaînes HTML : `let html = '...'`).

### 1.3 `var`
**Non utilisé** dans tout le projet — signe d'un code écrit en syntaxe moderne (ES6+).

---

## 2. Fonctions

### 2.1 Déclaration de fonction classique (`function` statement)
```js
function afficherMotdePasse() {
    const input = document.getElementById("login-password");
    ...
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}
```
Ces fonctions sont « hissées » (hoisting) : elles sont disponibles avant leur ligne de définition dans le fichier.

### 2.2 Expression de fonction anonyme
```js
window.addToCart = function(emoji, nomProduit, prix) {
    ...
};
```
Ici, une fonction sans nom est **assignée** à une propriété (`window.addToCart`) plutôt que déclarée avec `function nom() {}`.

### 2.3 Fonctions fléchées (`arrow functions`)

**Forme avec bloc `{}` :**
```js
menuToggle.addEventListener('click', () => {
    const isOpen = siteMenu.classList.toggle('open');
});
```

**Un seul paramètre sans parenthèses obligatoires :**
```js
cart.forEach(item => {
    const itemElement = document.createElement('div');
    ...
});
```

**Corps « expression implicite »** (pas d'accolades, pas de `return` explicite) :
```js
input.addEventListener('blur', () => validateField(input));
modalAction.onclick = () => closePaymentModal();
```
La valeur de l'expression après `=>` est automatiquement retournée.

**Retour direct d'un objet littéral** — nécessite d'entourer l'objet de parenthèses, sinon `{}` serait interprété comme un bloc de code :
```js
return cart.map((item) => ({
    emoji: item.emoji,
    name: item.name || item.nomProduit || '',
    price: Number(item.price ?? item.prix) || 0,
    quantity: Math.max(1, Number(item.quantity) || 1),
}));
```

**Différence avec `function` classique :** les fonctions fléchées n'ont pas leur propre `this` ni leur propre `arguments` — le projet les utilise surtout pour les callbacks courts (événements, `.map`, `.find`, `.forEach`).

### 2.4 Fonctions asynchrones
```js
async function processPayment() {
    ...
    await new Promise(resolve => setTimeout(resolve, 2500));
    ...
}

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    ...
    await processPayment();
});
```
Le mot-clé `async` devant `function` (ou une fléchée) permet d'utiliser `await` à l'intérieur — voir section 14.

### 2.5 Attacher une fonction à l'objet global `window`
```js
window.addToCart = function(emoji, nomProduit, prix) { ... };
window.removeFromCart = function(index) { ... };
```
Rend la fonction accessible depuis n'importe où, y compris depuis les attributs `onclick="..."` écrits directement dans le HTML (voir section 19).

### 2.6 Callback passé par référence vs fonction anonyme
```js
window.addEventListener('storage', updateBadge);      // référence directe à la fonction
window.addEventListener('storage', updateCart);

menuToggle.addEventListener('click', () => { ... });   // fonction anonyme définie sur place
```

---

## 3. Opérateurs

### 3.1 Affectation
```js
input.type = "text";
let value = e.target.value;
```

### 3.2 Affectation composée
```js
existingItem.quantity += 1;   // addition puis assignation
digit *= 2;                    // multiplication puis assignation
digit -= 9;
subtotal += itemTotal;
```

### 3.3 Comparaison stricte
Le projet utilise **uniquement** `===` et `!==` (jamais `==` ni `!=`), ce qui évite les conversions de type implicites :
```js
if (input.type === "password") { ... }
if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
return sum % 10 === 0;
```
Autres comparateurs : `<`, `>`, `<=`, `>=`
```js
if (field.value.length < 2) { ... }
if (index >= 0) { ... }
return expiryMonth >= 1 && expiryMonth <= 12;
```

### 3.4 Opérateurs logiques
```js
if (menuToggle && siteMenu) { ... }               // ET logique
const cart = JSON.parse(...) || [];               // OU logique (valeur de repli)
if (!cartBadge) { return; }                        // NON logique
if (!currentUser || !currentUser.email) { ... }
```

### 3.5 Double négation `!!`
```js
field.classList.toggle('error', !!error);
```
Convertit n'importe quelle valeur en booléen strict (`!!"un message"` → `true`, `!!""` → `false`).

### 3.6 Opérateur ternaire `condition ? siOui : siNon`
```js
return Array.isArray(cart) ? cart : [];
const shipping = subtotal > 100 ? 0 : 15;
menuToggle.textContent = isOpen ? '✕' : '☰';
```

### 3.7 Opérateur de coalescence des nuls `??`
```js
price: Number(item.price ?? item.prix) || 0,
```
Contrairement à `||`, `??` ne remplace la valeur que si elle est `null` ou `undefined` (pas si elle est `0` ou `""`).

### 3.8 Chaînage optionnel `?.`
```js
const userData = currentUser || JSON.parse(localStorage.getItem('utilisateurs'))?.[0] || {};
```
`?.[0]` accède au premier élément du tableau seulement si l'expression avant n'est pas `null`/`undefined`, sinon retourne `undefined` sans lever d'erreur.

### 3.9 Opérateur de propagation (spread) `...`
```js
const order = {
    id: generateOrderNumber(),
    ...paymentData,           // copie toutes les propriétés de paymentData ici
    status: 'completed',
    totalAmount: calculateOrderTotal(paymentData.cart),
};
```

### 3.10 Déstructuration de tableau
```js
const [month, year] = expiry.split('/');
```
Extrait directement les éléments d'un tableau dans des variables nommées.

### 3.11 Opérateur modulo `%`
```js
const currentYear = now.getFullYear() % 100;
return sum % 10 === 0;
```

### 3.12 Incrémentation / décrémentation
```js
for (let i = cardNumber.length - 1; i >= 0; i--) { ... }
```

### 3.13 Concaténation de chaînes avec `+`
```js
subtotalEl.textContent = subtotal.toFixed(2) + ' €';
```

---

## 4. Structures conditionnelles

### 4.1 `if` / `else` / `else if`
```js
if (existingIndex) {
    users[existingIndex] = nouvelUtilisateur;
    alert("Votre utilisateur connectez vous")
} else {
    users.push(nouvelUtilisateur);
}
```

```js
if (!field.value.trim()) {
    error = 'Ce champ est requis';
} else if (field.value.length < 2) {
    error = 'Minimum 2 caractères';
}
```

### 4.2 `if` sur une seule ligne, sans accolades
```js
if (expiryYear < currentYear) return false;
if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
```
Syntaxe valide en JavaScript : les accolades sont facultatives quand le bloc ne contient qu'une instruction.

### 4.3 `switch` / `case` / `break` / regroupement de cas (fall-through)
```js
switch(fieldName) {
    case 'firstName':
    case 'lastName':
        if (!field.value.trim()) {
            error = 'Ce champ est requis';
        }
        break;

    case 'email':
        if (!field.value.trim()) {
            error = 'Email requis';
        }
        break;
    ...
}
```
`case 'firstName': case 'lastName':` l'un en dessous de l'autre sans `break` entre eux : les deux valeurs partagent le même traitement (« fall-through » volontaire).

### 4.4 Instruction vide `;`
```js
if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "utilisateur.html";
} else {
    alert("email incorrect ou mot de passe incoorrect");   
};
```
Le point-virgule juste après le `}` du `if/else` (dans `connection.js`) forme une **instruction vide** — syntaxiquement valide mais sans effet ; c'est un résidu de frappe, pas une erreur bloquante.

---

## 5. Boucles et itération

### 5.1 Boucle `for` classique
```js
for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    ...
}
```
Trois parties : initialisation (`let i = ...`), condition (`i >= 0`), pas (`i--`).

### 5.2 `Array.prototype.forEach`
```js
cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    ...
});

siteMenu.querySelectorAll('a').forEach((link) => { ... });
```
Peut recevoir un deuxième paramètre optionnel : l'**index** de l'élément.

### 5.3 `Array.prototype.map`
```js
return cart.map((item) => ({ ... }));
const initials = source.map((part) => part.charAt(0)).join("");
```
Transforme chaque élément d'un tableau et retourne un **nouveau** tableau.

### 5.4 `Array.prototype.reduce`
```js
return cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
```
Cumule les éléments d'un tableau en une seule valeur ; le `0` final est la valeur initiale de l'accumulateur.

### 5.5 `Array.prototype.find`
```js
const existingItem = cart.find((item) => item.name === nomProduit);
const user = users.find((savedUser) => savedUser.email === email && savedUser.motDePasse === password);
```
Retourne le **premier élément** qui satisfait la condition, ou `undefined`.

### 5.6 `Array.prototype.findIndex`
```js
const index = users.findIndex((savedUser) => savedUser.email === user.email && user.email);
```
Retourne la **position** du premier élément trouvé (ou `-1`).

### 5.7 Absents du projet
Aucune boucle `while`, `do...while`, `for...of` ou `for...in` n'est utilisée — toutes les itérations passent par des méthodes de tableau (`forEach`, `map`, `reduce`, `find`) ou par la boucle `for` classique (dans l'algorithme de Luhn uniquement).

---

## 6. Chaînes de caractères

### 6.1 Guillemets simples et doubles
Le code mélange `'...'` et `"..."` sans convention stricte (style toléré en JS, les deux sont équivalents) :
```js
const input = document.getElementById("login-password");
localStorage.setItem('cart', JSON.stringify(cart));
```

### 6.2 Template literals (accents graves) avec interpolation `${}`
```js
alert(`${nomProduit} a été ajouté au panier !`);
const errorElement = document.getElementById(`error-${field.id}`);
return `****-****-****-${last4}`;
```

### 6.3 Template literals multi-lignes (construction de blocs HTML)
```js
html += `
    <div class="cart-item">
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-details">
            <h4>${item.name}</h4>
            <p>${item.price.toFixed(2)} € x <span id="qty-${index}">${item.quantity}</span></p>
        </div>
        <button class="btn-remove" onclick="removeFromCart(${index})">×</button>
    </div>
`;
```
Permet d'écrire du HTML sur plusieurs lignes tout en y insérant des valeurs JavaScript (`${...}`) — y compris pour générer dynamiquement un attribut `onclick`.

### 6.4 Méthodes de chaîne utilisées
```js
.trim()                 // enlève les espaces au début/à la fin
.split(" ")              // découpe une chaîne en tableau
.split('/')
.join("")                 // recolle un tableau en chaîne
.slice(0, 2)              // extrait une portion
.slice(-4)                 // portion depuis la fin (4 derniers caractères)
.charAt(0)                  // caractère à une position
.toUpperCase()
.toFixed(2)                  // formate un nombre avec 2 décimales
.replace(/\s/g, '')            // remplace selon une regex
.replace('€', '')              // remplace un texte littéral
.test(field.value)               // teste une regex sur une chaîne
```

---

## 7. Tableaux

### 7.1 Littéral de tableau
```js
const cart = JSON.parse(localStorage.getItem('cart')) || [];
```

### 7.2 Méthodes utilisées
```js
Array.isArray(cart)                 // vérifie que c'est bien un tableau
cart.push({ ... })                  // ajoute un élément à la fin
cart.splice(index, 1)               // retire 1 élément à la position "index"
cart.find(...)                       // voir section 5.5
cart.findIndex(...)                  // voir section 5.6
cart.map(...)                        // voir section 5.3
cart.reduce(...)                     // voir section 5.4
cart.forEach(...)                    // voir section 5.2
users.length                        // nombre d'éléments
users[users.length - 1]             // dernier élément (accès par index calculé)
```

---

## 8. Objets

### 8.1 Littéral d'objet
```js
const defaultUser = {
    nomUtilisateur: "musicien",
    prenom: "",
    nom: "",
    email: "",
    adresse: ""
};
```

### 8.2 Propriétés « raccourcies » (shorthand)
```js
cart.push({ emoji, name: nomInstrument, price: prix, quantity: 1 });
```
`emoji` équivaut à `emoji: emoji` — quand le nom de la clé est identique au nom de la variable, on peut l'écrire une seule fois.

### 8.3 Objets imbriqués
```js
const paymentData = {
    personal: {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
    },
    address: { address: formData.get('address'), city: formData.get('city'), postalCode: formData.get('postalCode') },
    card: { holder: formData.get('cardHolder'), number: maskCardNumber(formData.get('cardNumber')), expiry: formData.get('expiry') },
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    timestamp: new Date().toISOString(),
};
```

### 8.4 Virgule finale (« trailing comma »)
```js
cart.push({
    emoji: String(emoji || '🎵').trim(),
    name: nomProduit,
    price: numericPrice,
    quantity: 1,
});
```
Une virgule après le dernier élément est autorisée en JavaScript moderne (facilite l'ajout futur de propriétés).

### 8.5 Accès aux propriétés : point vs crochets
```js
user.email                   // accès par point (nom fixe)
cardNumber[i]                 // accès par crochet (index/clé calculée)
users[existingIndex]
```

### 8.6 `JSON.stringify` / `JSON.parse`
```js
localStorage.setItem("utilisateurs", JSON.stringify(users));
const cart = JSON.parse(localStorage.getItem('cart')) || [];
```
Convertit un objet/tableau JS en texte (`stringify`) et inversement (`parse`) — nécessaire car `localStorage` ne stocke que des chaînes de caractères.

---

## 9. Manipulation du DOM

### 9.1 Sélection d'éléments
```js
document.getElementById('menuToggle')
document.querySelector('.login-form')
document.querySelectorAll('input[required]')     // sélecteur CSS avec attribut
```

### 9.2 Création et insertion d'éléments
```js
const itemElement = document.createElement('div');
itemElement.className = 'order-item';
orderItemsContainer.appendChild(itemElement);
```

### 9.3 Lecture / écriture de contenu
```js
button.textContent = "🔒";
orderItemsContainer.innerHTML = '';
document.getElementById("first-name").value = user.prenom;
```

### 9.4 `classList`
```js
siteMenu.classList.toggle('open');            // ajoute si absent, retire si présent
siteMenu.classList.remove('open');
field.classList.toggle('error', !!error);       // forme à 2 arguments : force l'ajout/retrait
```

### 9.5 Styles en ligne
```js
paymentForm.style.opacity = '0.6';
paymentForm.style.pointerEvents = 'none';
paymentForm.style.display = 'none';
```

### 9.6 Attributs
```js
menuToggle.setAttribute('aria-expanded', String(isOpen));
```

### 9.7 Navigation dans le DOM
```js
const card = e.target.closest('.card');
```
Remonte dans les ancêtres jusqu'à trouver un élément correspondant au sélecteur.

---

## 10. Gestion des événements

### 10.1 `addEventListener`
```js
document.addEventListener("DOMContentLoaded", () => { ... });
loginForm.addEventListener("submit", (event) => { ... });
cardNumberInput.addEventListener('input', (e) => { ... });
window.addEventListener('storage', updateBadge);
window.addEventListener('load', () => { ... });
```
Types d'événements rencontrés : `DOMContentLoaded`, `load`, `submit`, `click`, `input`, `blur`, `change`, `storage`.

### 10.2 Propriétés `on...`
```js
modalAction.onclick = () => { ... };
```
Alternative à `addEventListener` : assigne directement une fonction à la propriété `onclick`.

### 10.3 L'objet `Event`
```js
event.preventDefault();          // empêche le rechargement de page au submit
const button = event.target;      // élément qui a déclenché l'événement
let value = e.target.value;
```

---

## 11. Stockage local (`localStorage`) et JSON

```js
localStorage.getItem('cart')
localStorage.setItem('cart', JSON.stringify(cart))
localStorage.removeItem('currentUser')
```
Combiné systématiquement avec `JSON.parse(...) || []` ou `|| {}` pour éviter une erreur si la clé n'existe pas encore.

---

## 12. Expressions régulières

```js
/\s/g            // tout espace, recherche globale
/\D/g            // tout caractère qui n'est pas un chiffre
/(\d{4})/g        // groupes de 4 chiffres (avec capture de groupe)
/^\d{2}\/\d{2}$/   // format strict MM/AA
/^[^\s@]+@[^\s@]+\.[^\s@]+$/   // validation simplifiée d'email
```
Utilisation :
```js
value.replace(/\D/g, '')                        // supprime tout ce qui n'est pas un chiffre
value.replace(/(\d{4})/g, '$1 ').trim()          // insère un espace tous les 4 chiffres ($1 = groupe capturé)
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)   // teste la validité
```

---

## 13. Programmation asynchrone

### 13.1 `Promise`
```js
await new Promise(resolve => setTimeout(resolve, 2500));
```
Crée une pause artificielle de 2,5 secondes (simulation d'un traitement de paiement).

### 13.2 `async` / `await`
```js
async function processPayment() {
    ...
    await new Promise(...);
    ...
}
```
`await` met en pause l'exécution de la fonction `async` jusqu'à ce que la promesse soit résolue, sans bloquer le reste de la page.

### 13.3 `setTimeout`
```js
setTimeout(resolve, 2500)
```

---

## 14. Gestion des erreurs

### 14.1 `try` / `catch`
```js
try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return Array.isArray(cart) ? cart : [];
} catch {
    return [];
}
```
Ici, `catch` est utilisé **sans paramètre** (syntaxe autorisée depuis ES2019, quand on n'a pas besoin de l'objet d'erreur).

```js
try {
    ...
} catch (error) {
    console.error('Erreur lors du paiement:', error);
    ...
}
```
Ici, `catch (error)` capture l'erreur dans une variable nommée.

### 14.2 `console`
```js
console.log('Commande sauvegardée:', order);
console.warn('⚠️ Utilisateur non connecté');
console.error('Erreur lors du paiement:', error);
```

---

## 15. Objets et API natifs utilisés

### 15.1 `Date`
```js
const now = new Date();
now.getFullYear()
now.getMonth()                       // 0 = janvier
new Date().toISOString()
new Date(lastOrder.timestamp)
orderDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});                                   // objet d'options passé en 2e argument
Date.now()
```

### 15.2 `Math`
```js
Math.random()
Math.floor(Math.random() * 10000)
Math.max(1, Number(item.quantity) || 1)
```

### 15.3 Conversion de types
```js
Number(prix)             // texte/valeur → nombre
String(isOpen)           // valeur → texte
parseInt(cardNumber[i], 10)   // texte → entier, en base 10
parseFloat(...)               // texte → nombre décimal
```

### 15.4 `FormData`
```js
const formData = new FormData(paymentForm);
formData.get('firstName');
```
API du navigateur qui lit automatiquement les champs d'un formulaire HTML.

---

## 16. Portée globale et objet `window`

```js
window.addToCart = function(...) { ... };
window.removeFromCart = function(index) { ... };
window.location.href = "utilisateur.html";
window.addEventListener('storage', updateBadge);
```
Attacher une fonction à `window` la rend disponible **globalement**, y compris pour du code appelé depuis un attribut HTML (`onclick="addToCart(...)"`) situé dans un autre fichier/une autre balise `<script>`.

---

## 17. Commentaires

```js
// afficher les mots de passses          → commentaire sur une ligne
// inscription et connection
// tableau d'insscption

/**
 * Système de paiement - Chris & Compagnie
 * Gère la validation, le traitement et la sauvegarde des commandes
 */                                        → commentaire bloc (style JSDoc)

// ============================================
// VARIABLES GLOBALES
// ============================================     → blocs de séparation décoratifs
```

---

## 18. Syntaxe côté HTML liée au JavaScript (bonus)

Même si ce ne sont pas des fichiers `.js`, ces éléments HTML sont indissociables de la syntaxe JS du projet :

### 18.1 Appel de fonction JS directement dans un attribut `onclick`
```html
<button onclick="addToCart('🎸', 'Guitare Acoustique Classique', 89.99)">Ajouter au panier</button>
```
Le navigateur exécute ce texte comme du JavaScript ; les arguments (chaîne, chaîne, nombre) doivent être des littéraux valides.

### 18.2 Deux façons d'inclure du JS
```html
<script src="dossier javascript/vente.js"></script>   <!-- fichier externe -->
<script>
    const cartBadge = document.querySelector('.cart-badge');
    ...
</script>                                              <!-- script inline -->
```

### 18.3 Absence de modules ES
Aucune balise `<script type="module">` et donc aucune syntaxe `import` / `export` : tout le code partage le même espace global, ce qui explique pourquoi les fonctions doivent être attachées à `window` pour être réutilisées d'une page à l'autre.

---

## 19. Récapitulatif par fichier

| Fichier | Points de syntaxe notables |
|---|---|
| `connection.js` | `function`, objets littéraux, `find`, `push`, `addEventListener("DOMContentLoaded", ...)`, instruction vide `;` |
| `vente.js` | `try/catch` sans paramètre, `reduce`, `typeof`, template literals, `window.addToCart =` |
| `panier.js` | déstructuration via `map`, `??`, `Math.max`, boucles `forEach(item, index)`, `splice`, template multi-lignes |
| `utilisateur.js` | chaînes de `||`, `.split().map().join().slice()`, `findIndex`, `localStorage.removeItem` |
| `paiement.js` | `async/await`, `Promise`, `switch/case`, expressions régulières, `FormData`, spread `...`, `Date`, `try/catch(error)` |

---

## 20. Éléments modernes du langage **absents** du projet (repère de contexte)

Pour situer le niveau de syntaxe utilisé, voici ce qui **n'apparaît jamais** dans ces fichiers :
- les classes ES6 (`class ... { constructor() {} }`)
- les modules (`import` / `export`)
- `var`
- les boucles `while`, `do...while`, `for...of`, `for...in`
- les générateurs (`function*`, `yield`)
- `Set`, `Map`, `Symbol`
- les getters/setters d'objet (`get`/`set`)
- les paramètres par défaut de fonction (`function f(x = 1)`) — le projet utilise plutôt `x || valeur`

Le code repose donc sur un socle **ES6 « pratique »** : `const`/`let`, fonctions fléchées, template literals, déstructuration, spread, `async/await`, méthodes de tableau — sans recourir aux fonctionnalités orientées objet ou modulaires plus avancées.
