# 📊 Diagramme du Flux de Paiement

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE COMMERCE                           │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────┐                  ┌──────────────────┐
    │  VENTE.HTML      │                  │  LOCATION.HTML   │
    │  (Catalogue)     │                  │  (Catalogue)     │
    └────────┬─────────┘                  └────────┬─────────┘
             │                                     │
             │ Ajoute au panier                    │ Ajoute au panier
             ↓                                     ↓
    ┌────────────────────────────────────────────────────────────┐
    │                  localStorage['cart']                       │
    │  [                                                          │
    │    { name: "Guitare", price: 150, quantity: 1, emoji: 🎸 │
    │    { name: "Piano", price: 300, quantity: 1, emoji: 🎹   │
    │  ]                                                          │
    └────────┬─────────────────────────────────────────────────────┘
             │
             │ Clique "Voir le panier"
             ↓
    ┌──────────────────────────────────┐
    │       PANIER.HTML                │
    ├──────────────────────────────────┤
    │ • Affiche articles               │
    │ • Calcule totaux                 │
    │ • Bouton "Procéder au paiement"  │
    └──────────────────┬───────────────┘
                       │
                       │ Clique "Procéder"
                       ↓
       ┌───────────────────────────────┐
       │  VÉRIFICATION CONNEXION        │
       │  (JavaScript dans panier.html) │
       └───────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ❌ NON          ✅ OUI
        │             │
        ↓             ↓
    Pas connecté   Connecté
        │             │
        ↓             ↓
   Confirmation    Redirection
   "Se connecter?" directe vers
        │           paiement.html
        ├────────────┐
        │            │
       OK        ANNULER
        │            │
        ↓            ↓
    page_de_      panier.html
  connection.html (reste)


┌─────────────────────────────────────────────────────────────────┐
│                        FLUX CONNEXION/PANIER → PAIEMENT          │
└─────────────────────────────────────────────────────────────────┘

SCÉNARIO 1 : Utilisateur non connecté
═════════════════════════════════════════

    1. Utilisateur clique "Procéder au paiement"
                      ↓
    2. JavaScript vérifie localStorage['currentUser']
                      ↓
    3. currentUser = null ou vide
                      ↓
    4. Affiche : "Vous devez être connecté. Continuer?"
                      ↓
           ┌──────────────────┐
           │ Utilisateur      │
           │ clique OK ou Non │
           └────┬─────────────┘
               │
        ┌──────┴──────┐
        │ OK          │ NON
        ↓             ↓
  Redirection    Reste sur
  vers           panier.html
  page_de_
  connection


SCÉNARIO 2 : Utilisateur connecté
═════════════════════════════════════════

    1. Utilisateur clique "Procéder au paiement"
                      ↓
    2. JavaScript vérifie localStorage['currentUser']
                      ↓
    3. currentUser = { nom: "Dupont", prenom: "Jean", ... }
                      ↓
    4. Redirection DIRECTE vers paiement.html
                      ↓
    5. paiement.html charge
                      ↓
    6. JavaScript paiement.js exécute :
       • checkUserConnection() ✓
       • loadCart() ✓
       • Pré-remplit les champs
                      ↓
    7. Utilisateur voit le formulaire complété
```

---

## 🔄 Flux de Données Utilisateur

```
┌─────────────────────────────────────────────────────────────────┐
│              CONNECTION.JS & UTILISATEUR.JS WORKFLOW             │
└─────────────────────────────────────────────────────────────────┘

    PAGE_DE_CONNECTION.HTML
    ├─ Formulaire Connexion
    │  ├─ Email: jean@example.com
    │  └─ Mot de passe: ****
    │
    └─ Clique "Se connecter"
        │
        ↓
    CONNECTION.JS
    ├─ Récupère les données du formulaire
    ├─ Cherche dans localStorage['utilisateurs']
    ├─ Valide email + mot de passe
    └─ Sauvegarde dans localStorage['currentUser']
        │
        ↓
    localStorage['currentUser'] = {
        nomUtilisateur: "jean_dupont",
        prenom: "Jean",
        nom: "Dupont",
        email: "jean@example.com",
        adresse: "123 rue de la Paix, 1200 Kinshasa",
        motDePasse: "hashedPassword..."
    }
        │
        ↓
    Redirection vers UTILISATEUR.HTML
    │
    ├─ Affiche le profil utilisateur
    ├─ charge utilisateur.js
    └─ utilisateur.js affiche les données


┌─────────────────────────────────────────────────────────────────┐
│              DONNÉES UTILISATEUR → FORMULAIRE PAIEMENT           │
└─────────────────────────────────────────────────────────────────┘

    PAIEMENT.JS au chargement
    │
    ├─ Exécute : const currentUser = JSON.parse(
    │             localStorage.getItem('currentUser')
    │           )
    │
    ├─ Récupère les champs de currentUser :
    │  ├─ currentUser.prenom      → "Jean"
    │  ├─ currentUser.nom         → "Dupont"
    │  ├─ currentUser.email       → "jean@example.com"
    │  └─ currentUser.adresse     → "123 rue..."
    │
    └─ Pré-remplit les champs HTML :
        │
        ├─ document.getElementById('first-name').value = "Jean"
        ├─ document.getElementById('last-name').value = "Dupont"
        ├─ document.getElementById('email').value = "jean@example.com"
        ├─ document.getElementById('address').value = "123 rue..."
        └─ document.getElementById('card-holder').value = "DUPONT JEAN"
            │
            ↓
        FORMULAIRE PAIEMENT PRÉ-REMPLI ✓
```

---

## 🔐 Flux de Paiement Complet

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUX DE PAIEMENT COMPLET                      │
└─────────────────────────────────────────────────────────────────┘

PANIER.HTML → PAIEMENT.HTML → CONFIRMATION.HTML → UTILISATEUR.HTML

    1. PANIER
    ├─ Articles affichés
    ├─ Total calculé
    └─ Bouton "Procéder au paiement"
                │
                ↓
    2. VÉRIFICATION CONNEXION (panier.js)
    ├─ localStorage['currentUser'] existe ?
    ├─ Si NON → Redirection page_de_connection.html
    └─ Si OUI → Continue vers paiement
                │
                ↓
    3. PAIEMENT
    ├─ Chargement paiement.html
    │  ├─ Récupère panier
    │  ├─ Affiche résumé commande
    │  └─ Affiche formulaire pré-rempli
    │
    ├─ Utilisateur complète si nécessaire
    │  ├─ Numéro de carte
    │  ├─ Date d'expiration
    │  └─ CVV
    │
    ├─ Clique "Payer maintenant"
    │  │
    │  ├─ Validation de tous les champs
    │  ├─ Vérification des conditions
    │  └─ Si erreur → Messages affichés
    │
    ├─ Traitement du paiement
    │  ├─ Modal de chargement s'affiche
    │  ├─ Simulation traitement (2-3s)
    │  └─ Sauvegarde commande dans localStorage['orders']
    │
    └─ Redirection CONFIRMATION.HTML
                │
                ↓
    4. CONFIRMATION
    ├─ Numéro de commande: #ORD-XXX-XXX
    ├─ Montant confirmé
    ├─ Statut: ✓ Payé
    ├─ Prochaines étapes
    └─ Boutons : Accueil / Mon Compte
                │
                ↓
    5. APRÈS PAIEMENT
    ├─ Panier vidé (localStorage['cart'] = [])
    ├─ Commande sauvegardée (localStorage['orders'])
    ├─ Email de confirmation envoyé (futur)
    └─ Livraison prévue 5-7 jours


┌─────────────────────────────────────────────────────────────────┐
│                    STRUCTURE LOCALSTORAGE                        │
└─────────────────────────────────────────────────────────────────┘

localStorage = {

    /* UTILISATEURS */
    'utilisateurs': [
        {
            nomUtilisateur: "jean_dupont",
            prenom: "Jean",
            nom: "Dupont",
            email: "jean@example.com",
            adresse: "123 rue de la Paix",
            motDePasse: "hashedPassword"
        },
        {
            nomUtilisateur: "marie_martin",
            prenom: "Marie",
            nom: "Martin",
            email: "marie@example.com",
            adresse: "456 avenue des Fleurs",
            motDePasse: "hashedPassword"
        }
    ],

    /* UTILISATEUR ACTUELLEMENT CONNECTÉ */
    'currentUser': {
        nomUtilisateur: "jean_dupont",
        prenom: "Jean",
        nom: "Dupont",
        email: "jean@example.com",
        adresse: "123 rue de la Paix"
    },

    /* PANIER ACTUEL */
    'cart': [
        {
            emoji: "🎸",
            name: "Guitare Classique",
            price: 150.00,
            quantity: 1
        },
        {
            emoji: "🎹",
            name: "Piano Électrique",
            price: 300.00,
            quantity: 1
        }
    ],

    /* HISTORIQUE DES COMMANDES */
    'orders': [
        {
            id: "ORD-1234567890-5678",
            personal: {
                firstName: "Jean",
                lastName: "Dupont",
                email: "jean@example.com",
                phone: "+243972693813"
            },
            address: {
                address: "123 rue de la Paix",
                city: "Kinshasa",
                postalCode: "1200"
            },
            card: {
                holder: "DUPONT JEAN",
                number: "****-****-****-1111",
                expiry: "12/25"
            },
            cart: [...articles...],
            status: "completed",
            totalAmount: 450.00,
            timestamp: "2024-01-15T10:30:00Z"
        }
    ]
}
```

---

## 🎯 Points de Contrôle

```
Contrôle 1: Panier → Paiement
═════════════════════════════
    ✓ Panier non vide
    ✓ Utilisateur connecté
    ✓ Bouton redirige vers paiement.html

Contrôle 2: Chargement Paiement
═══════════════════════════════
    ✓ Utilisateur vérifié
    ✓ Panier chargé depuis localStorage
    ✓ Totaux calculés
    ✓ Champs pré-remplis depuis currentUser
    ✓ Message d'avertissement caché si connecté

Contrôle 3: Formulaire
══════════════════════
    ✓ Tous les champs requis
    ✓ Validation en temps réel
    ✓ Messages d'erreur affichés
    ✓ Bouton soumettre activé

Contrôle 4: Paiement
════════════════════
    ✓ Validation Luhn pour carte
    ✓ Vérification d'expiration
    ✓ Modal de traitement
    ✓ Commande sauvegardée
    ✓ Panier vidé

Contrôle 5: Confirmation
════════════════════════
    ✓ Numéro de commande affiché
    ✓ Données utilisateur confirmées
    ✓ Lien vers mon compte
    ✓ Panier vidé (badge = 0)
```

---

## 📱 Responsive Design

```
DESKTOP (> 1000px)
┌─────────────────────────────────────┐
│  RÉSUMÉ      │  FORMULAIRE PAIEMENT │
│  COMMANDE    │  ├─ Perso            │
│  (sticky)    │  ├─ Adresse          │
│              │  └─ Carte            │
└─────────────────────────────────────┘


TABLETTE (640px - 1000px)
┌─────────────────────────────────┐
│  RÉSUMÉ COMMANDE                │
├─────────────────────────────────┤
│  FORMULAIRE PAIEMENT            │
│  ├─ Perso                       │
│  ├─ Adresse                     │
│  └─ Carte                       │
└─────────────────────────────────┘


MOBILE (< 640px)
┌──────────────────┐
│ RÉSUMÉ COMMANDE  │
├──────────────────┤
│ FORMULAIRE (100%)│
├──────────────────┤
│ Boutons (100%)   │
└──────────────────┘
```

---

## 🔗 Intégration avec les Autres Pages

```
index.html
    ├─ Lien vers vente.html
    └─ Lien vers location.html
            │
            ↓
vente.html / location.html
    ├─ Ajoute articles au panier (panier.js)
    ├─ Affiche badge panier
    └─ Lien vers panier.html
            │
            ↓
panier.html (NOUVEAU)
    ├─ Affiche articles
    ├─ Calcule totaux
    ├─ Vérification connexion
    └─ Redirige vers paiement.html
            │
            ↓
paiement.html
    ├─ Affiche résumé
    ├─ Formulaire pré-rempli
    ├─ Traite paiement
    └─ Redirige vers confirmation.html
            │
            ↓
confirmation.html
    ├─ Affiche numéro commande
    ├─ Affiche détails
    └─ Lien vers utilisateur.html / index.html
            │
            ↓
utilisateur.html
    ├─ Affiche profil
    ├─ Affiche commandes (futur)
    └─ Option de déconnexion
```

---

## ✅ Résumé de l'Architecture

| Composant | Fonction | Données |
|-----------|----------|---------|
| **panier.html** | Affiche le panier et vérifie connexion | cart, currentUser |
| **paiement.html** | Formulaire de paiement | cart, currentUser |
| **paiement.js** | Gère validation et traitement | cart, currentUser, orders |
| **confirmation.html** | Affiche confirmation | orders |
| **localStorage** | Stocke toutes les données | utilisateurs, currentUser, cart, orders |

---

**🎯 Système d'intégration complet et sécurisé !**