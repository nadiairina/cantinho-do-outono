document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidade do Menu Hamburger ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const nav = document.querySelector('.navbar');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Animação do header ao scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Gestão de Produtos e Carrinho ---
    const productsGrid = document.getElementById('bestsellers-list');
    const allProductsGrid = document.getElementById('all-products-list');
    const cartCountElement = document.querySelector('.cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Função para atualizar a contagem do carrinho na interface
    const updateCartCount = () => {
        cartCountElement.textContent = cart.length;
    };

    // Função para renderizar um produto
    const renderProduct = (product, container) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${product.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
        `;
        container.appendChild(productCard);

        productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(product);
        });
    };

    // Função para adicionar um produto ao carrinho
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            // Se o produto já existe, apenas aumenta a quantidade
            existingItem.quantity++;
        } else {
            // Se o produto não existe, adiciona-o com quantidade 1
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        window.location.href = 'carrinho.html'; // Redireciona para a página do carrinho
    };

    // Carregar e renderizar os produtos
    const loadProducts = async () => {
        try {
            const response = await fetch('data/products.json');
            const products = await response.json();

            // Renderizar os "Mais Vendidos" na página principal
            if (productsGrid) {
                const bestsellers = products.filter(p => p.isBestseller);
                bestsellers.forEach(product => renderProduct(product, productsGrid));
            }

            // Renderizar todos os produtos na página de produtos
            if (allProductsGrid) {
                products.forEach(product => renderProduct(product, allProductsGrid));
            }

        } catch (error) {
            console.error('Erro ao carregar os produtos:', error);
        }
    };

    // Chamar a função para carregar os produtos ao iniciar a página
    loadProducts();

    // Atualizar a contagem do carrinho ao carregar a página
    updateCartCount();
});
