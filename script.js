document.addEventListener('DOMContentLoaded', () => {

    const productsGrid = document.getElementById('bestsellers-list');
    const allProductsGrid = document.getElementById('all-products-list');
    const cartCountElement = document.querySelector('.cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        cartCountElement.textContent = cart.length;
    };

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

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} adicionado ao carrinho!`);
    };

    const loadProducts = async () => {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            const products = await response.json();
            console.log('Produtos carregados com sucesso:', products); // Verifica se os produtos foram carregados

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

    loadProducts();
    updateCartCount();
});
