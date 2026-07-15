
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

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateBadge();
                });
            });

            // Initialiser le badge au chargement
            updateBadge();

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
        