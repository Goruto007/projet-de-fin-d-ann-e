
            // Fonctionnalité d'achat - Intégration panier
            const cartBadge = document.querySelector('.cart-badge');
            const boutonsAcheter = document.querySelectorAll('.btn-louer');

            // Charger le badge du panier
            function updateBadge() {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                cartBadge.textContent = cart.length;
            }

            boutonsAcheter.forEach(bouton => {
                bouton.addEventListener('click', function(e) {
                    const card = e.target.closest('.card');
                    const emoji = card.querySelector('.card-image').textContent;
                    const nomProduit = card.querySelector('h3').textContent;
                    const prix = parseFloat(card.querySelector('.price').textContent.replace('€', '').replace(',', '.'));

                    // Ajouter au panier
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.name === nomProduit);

                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ emoji, name: nomProduit, price: prix, quantity: 1});
                    }

                     // Notification utilisateur
                     alert(`✓ ${nomProduit} a été ajouté au panier!`);

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateBadge();
                });
            });

             // Fonction pour ajouter au panier
            window.addToCart = function(emoji, name, price) {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.name === name);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ emoji, name, price, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateBadge();
                
               
                
                // Mettre à jour le badge dans tous les onglets
                window.dispatchEvent(new Event('storage'));
            }

            // Initialiser le badge au chargement
            updateBadge();

              // Écouter les changements de localStorage
            window.addEventListener('storage', updateBadge);
        