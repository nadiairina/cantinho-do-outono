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
    const cartIcon = document.querySelector('.cart-icon');

    // Função para atualizar a contagem do carrinho na interface
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
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

        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            const productElement = e.target.closest('.product-card');
            animateToCart(productElement);
            addToCart(product);
        });
    };

    // Função para adicionar um produto ao carrinho (salva no localStorage)
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    // Animação de "voo" para o carrinho
    const animateToCart = (productElement) => {
        const productImg = productElement.querySelector('img');
        const cartRect = cartIcon.getBoundingClientRect();
        const imgRect = productImg.getBoundingClientRect();

        const clone = productImg.cloneNode(true);
        clone.classList.add('product-clone');
        clone.style.left = `${imgRect.left}px`;
        clone.style.top = `${imgRect.top}px`;
        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;

        document.body.appendChild(clone);

        // Força o navegador a recalcular os estilos para a transição
        clone.offsetHeight;

        // Calcula a posição do carrinho
        document.documentElement.style.setProperty('--cart-x', `${cartRect.left - imgRect.left}px`);
        document.documentElement.style.setProperty('--cart-y', `${cartRect.top - imgRect.top}px`);

        clone.classList.add('fly-to-cart');

        // Remove o clone depois da animação
        setTimeout(() => {
            clone.remove();
        }, 800);
    };

    // Carregar e renderizar os produtos
    const loadProducts = async () => {
        try {
            const response = await fetch('data/products.json');
            const products = await response.json();

            if (productsGrid) {
                const bestsellers = products.filter(p => p.isBestseller);
                bestsellers.forEach(product => renderProduct(product, productsGrid));
            }

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
