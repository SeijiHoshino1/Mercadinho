let usuarioAtual = null;
let produtos = [];
let carrinho = [];
let pagamentoSelecionado = null;

const usuarios = {
    'admin': '123',
    'user1': '123',
    'user2': '123'
};

const mockProducts = [
    {
        id: 1,
        title: "Camiseta Masculina Premium",
        description: "Camiseta de algodão 100% premium, confortável e durável. Ideal para o dia a dia.",
        price: 39.90,
        category: "men's clothing"
    },
    {
        id: 2,
        title: "Vestido Feminino Elegante",
        description: "Vestido social feminino elegante, perfeito para ocasiões especiais e trabalho.",
        price: 89.90,
        category: "women's clothing"
    },
    {
        id: 3,
        title: "Smartphone Android 128GB",
        description: "Smartphone com tela de 6.5 polegadas, 128GB de armazenamento e câmera de 48MP.",
        price: 899.90,
        category: "electronics"
    },
    {
        id: 4,
        title: "Colar de Prata com Pingente",
        description: "Lindo colar de prata 925 com pingente de coração. Joia delicada e elegante.",
        price: 159.90,
        category: "jewelery"
    },
    {
        id: 5,
        title: "Calça Jeans Masculina",
        description: "Calça jeans masculina slim fit, tecido de alta qualidade e modelagem moderna.",
        price: 79.90,
        category: "men's clothing"
    },
    {
        id: 6,
        title: "Blusa Feminina Estampada",
        description: "Blusa feminina com estampa floral, tecido leve e confortável para o verão.",
        price: 49.90,
        category: "women's clothing"
    },
    {
        id: 7,
        title: "Fone de Ouvido Bluetooth",
        description: "Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.",
        price: 199.90,
        category: "electronics"
    },
    {
        id: 8,
        title: "Anel de Ouro 18k",
        description: "Anel feminino em ouro 18k com design clássico e acabamento refinado.",
        price: 299.90,
        category: "jewelery"
    },
    {
        id: 9,
        title: "Tênis Esportivo Masculino",
        description: "Tênis para corrida e caminhada com tecnologia de amortecimento avançada.",
        price: 149.90,
        category: "men's clothing"
    },
    {
        id: 10,
        title: "Bolsa Feminina de Couro",
        description: "Bolsa de couro legítimo com design sofisticado e compartimentos organizadores.",
        price: 189.90,
        category: "women's clothing"
    },
    {
        id: 11,
        title: "Notebook Gamer 16GB RAM",
        description: "Notebook para jogos com processador Intel i7, 16GB RAM e placa de vídeo dedicada.",
        price: 2499.90,
        category: "electronics"
    },
    {
        id: 12,
        title: "Pulseira de Prata Feminina",
        description: "Pulseira delicada em prata 925 com detalhes em cristais. Elegante e moderna.",
        price: 89.90,
        category: "jewelery"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

async function loadProducts() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        produtos = data.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category
        }));
        
    } catch (error) {
        produtos = mockProducts;
    }
    
    loading.style.display = 'none';
    renderProducts();
}

function login() {
    const usuario = document.getElementById('username-input').value;
    const senha = document.getElementById('password-input').value;
    const erroDiv = document.getElementById('loginError');
    if (!usuario || !senha) {
        mostrarErro('Por favor, preencha todos os campos.');
        return;
    }
    if (usuarios[usuario] && usuarios[usuario] === senha) {
        usuarioAtual = usuario;
        document.getElementById('username').textContent = usuario;
        document.getElementById('header').style.display = 'flex';
        erroDiv.style.display = 'none';
        showProducts();
    } else {
        mostrarErro('Usuário ou senha incorretos.');
    }
}

function mostrarErro(mensagem) {
    const erroDiv = document.getElementById('loginError');
    erroDiv.textContent = mensagem;
    erroDiv.style.display = 'block';
}

function logout() {
    usuarioAtual = null;
    carrinho = [];
    atualizarContadorCarrinho();
    document.getElementById('header').style.display = 'none';
    mostrarTela('loginScreen');
    document.getElementById('username-input').value = '';
    document.getElementById('password-input').value = '';
}

function mostrarTela(idTela) {
    document.querySelectorAll('.screen').forEach(tela => {
        tela.classList.remove('active');
    });
    document.getElementById(idTela).classList.add('active');
}

function showProducts() {
    mostrarTela('productsScreen');
}

function showCart() {
    renderCart();
    mostrarTela('cartScreen');
}

function showCheckout() {
    updateCheckoutTotal();
    mostrarTela('checkoutScreen');
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    produtos.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const categoryIcons = {
            "men's clothing": '👔',
            "women's clothing": '👗',
            "jewelery": '💍',
            "electronics": '📱'
        };
        
        productCard.innerHTML = `
            <div class="product-image">
                ${categoryIcons[product.category] || '📦'}
            </div>
            <div class="product-title">${product.title}</div>
            <div class="product-description">${product.description.substring(0, 100)}...</div>
            <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <button class="btn" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
        `;
        
        grid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = produtos.find(p => p.id === productId);
    const existingItem = carrinho.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        carrinho.push({
            ...product,
            quantity: 1
        });
    }
    
    atualizarContadorCarrinho();
    
    event.target.textContent = 'Adicionado!';
    event.target.style.background = '#28a745';
    setTimeout(() => {
        event.target.textContent = 'Adicionar ao Carrinho';
        event.target.style.background = '';
    }, 1000);
}

function removeFromCart(productId) {
    carrinho = carrinho.filter(item => item.id !== productId);
    atualizarContadorCarrinho();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = carrinho.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            atualizarContadorCarrinho();
            renderCart();
        }
    }
}

function atualizarContadorCarrinho() {
    const counter = document.getElementById('cartCounter');
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalItems;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">Seu carrinho está vazio</p>';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    carrinho.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div style="font-weight: bold;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    document.getElementById('totalAmount').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartTotal.style.display = 'block';
    checkoutBtn.style.display = 'inline-block';
}

function selectPayment(method) {
    pagamentoSelecionado = method;
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function updateCheckoutTotal() {
    const total = carrinho.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function finalizePurchase() {
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zipCode').value;
    
    if (!fullName || !phone || !address || !city || !zipCode) {
        alert('Por favor, preencha todos os campos de entrega.');
        return;
    }
    
    if (!pagamentoSelecionado) {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }
    
    const orderNumber = Math.floor(Math.random() * 1000000);
    document.getElementById('orderNumber').textContent = `#${orderNumber}`;
    
    carrinho = [];
    atualizarContadorCarrinho();
    
    mostrarTela('successScreen');
}

function startNewOrder() {
    document.getElementById('fullName').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('zipCode').value = '';
    pagamentoSelecionado = null;
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    showProducts();
}

function alternarCrudUsuarios() {
    const painel = document.getElementById('painelCrudUsuarios');
    painel.style.display = painel.style.display === 'none' ? 'block' : 'none';
    renderizarCrudUsuarios();
}

function renderizarCrudUsuarios() {
    const ul = document.getElementById('listaCrudUsuarios');
    ul.innerHTML = '';
    Object.keys(usuarios).forEach(usuario => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.marginBottom = '8px';
        li.innerHTML = `
            <span style='flex:1;'><b>${usuario}</b> / <span id='senha-${usuario}'>${usuarios[usuario]}</span></span>
            <button class='btn btn-secondary' style='margin-right:5px;' onclick='editarUsuarioPrompt("${usuario}")'>Editar</button>
            <button class='btn btn-secondary' onclick='removerUsuario("${usuario}")'>Remover</button>
        `;
        ul.appendChild(li);
    });
    document.getElementById('listaUsuariosCrud').textContent = Object.keys(usuarios).map(u => `${u}/${usuarios[u]}`).join(' | ');
}

function adicionarUsuario() {
    const usuario = document.getElementById('novoUsuario').value.trim();
    const senha = document.getElementById('novaSenha').value.trim();
    if (!usuario || !senha) { alert('Preencha usuário e senha!'); return; }
    if (usuarios[usuario]) { alert('Usuário já existe!'); return; }
    usuarios[usuario] = senha;
    document.getElementById('novoUsuario').value = '';
    document.getElementById('novaSenha').value = '';
    renderizarCrudUsuarios();
}

function removerUsuario(usuario) {
    if (usuario === 'admin') { alert('Não é possível remover o admin!'); return; }
    delete usuarios[usuario];
    renderizarCrudUsuarios();
}

function editarUsuarioPrompt(usuario) {
    const novaSenha = prompt('Nova senha para ' + usuario + ':', usuarios[usuario]);
    if (novaSenha && novaSenha.trim()) {
        usuarios[usuario] = novaSenha.trim();
        renderizarCrudUsuarios();
    }
}

document.getElementById('username-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});

document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});