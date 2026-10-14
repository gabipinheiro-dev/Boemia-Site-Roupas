/* ==========================================================
   BOEMIA — script principal (JavaScript puro)
   Compartilhado por todas as páginas (index, feminino, masculino, cadastro).
   Cada bloco só roda se os elementos existirem na página atual.
   ========================================================== */

// ---------- Dados ----------
// gender: 'feminino' | 'masculino' | ['feminino', 'masculino'] p/ unissex (define em qual catálogo a peça aparece;
// a Home mostra todas as peças)
const PRODUCTS = [
  {
    id: 1,
    name: 'OVERSIZED VOID TEE',
    price: 'R$ 189',
    originalPrice: 'R$ 249',
    tag: 'NOVO',
    tagColor: '#8b3dff',
    img: '/static/imagens/foto_moca_camiseta.png',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'tops',
    gender: 'feminino',
    desc: 'Camiseta oversized em algodão premium 320g. Corte amplo e caído, gola careca reforçada.',
  },
  {
    id: 2,
    name: 'LEATHER BOMBER JACKET',
    price: 'R$ 389',
    originalPrice: null,
    tag: 'LIMITADO',
    tagColor: '#8b3dff',
    img: 'https://images.unsplash.com/photo-1786052902193-98a5278b2602?q=80&w=701&auto=format',
    sizes: ['P', 'M', 'G'],
    category: 'jaquetas',
    gender: 'masculino',
    desc: 'Jaqueta tática em ripstop com camuflagem urbana. Detalhes refletivos e bolsos funcionais.',
  },
  {
    id: 3,
    name: 'CORDUROY BAGGY PANTS',
    price: 'R$ 219',
    originalPrice: 'R$ 329',
    tag: 'SALE',
    tagColor: '#dc2626',
    img: 'https://images.unsplash.com/photo-1763044938182-ed2526ae803a?w=600&h=750&fit=crop&auto=format',
    sizes: ['36', '38', '40', '42'],
    category: 'calças',
    gender: ['feminino', 'masculino'], // unissex: aparece nos dois catálogos
    desc: 'Unissex. Calça cargo com múltiplos bolsos laterais. Elástico na cintura e barra ajustável.',
  },
  {
    id: 4,
    name: 'FAUX LEATHER PATCHES JACKET',
    price: 'R$ 349',
    originalPrice: null,
    tag: 'NOVO',
    tagColor: '#8b3dff',
    img: 'https://images.unsplash.com/photo-1770192988911-39f344a10dfe?q=80&w=687&auto=format',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'tops',
    gender: 'feminino',
    desc: 'Jaqueta de couro legítimo com patchs bordados. Capuz duplo e cordão encerado.',
  },
  {
    id: 5,
    name: 'EMBROIDERED CRUISE CAP',
    price: 'R$ 149',
    originalPrice: null,
    tag: 'NOVO',
    tagColor: '#8b3dff',
    img: 'https://images.unsplash.com/photo-1711403194371-c914bd7fd26d?q=80&w=687&auto=format',
    sizes: ['P', 'M', 'G'],
    category: 'acessórios',
    gender: 'masculino',
    desc: 'Top em malha mesh com acabamento irregular nas bordas. Fit ajustado.',
  },
  {
    id: 6,
    name: 'PHANTOM BOMBER JACKET',
    price: 'R$ 459',
    originalPrice: 'R$ 599',
    tag: 'SALE',
    tagColor: '#dc2626',
    img: 'https://images.unsplash.com/photo-1509847950535-14e861e5191b?q=80&w=692&auto=format',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'jaquetas',
    gender: 'masculino',
    desc: 'Bomber impermeável com forro em fleece removível. Patch bordado exclusivo.',
  },
]

const CATEGORIES = [
  { name: 'CROPPEDS', filter: 'croppeds', img: 'https://images.unsplash.com/photo-1688404537732-16e1ecaf7166?q=80&w=688&auto=format', count: '42 peças' },
  { name: 'JAQUETAS', filter: 'jaquetas', img:'https://images.unsplash.com/photo-1736754079501-96e8c68e4fef?q=80&w=687&auto=format', count: '18 peças' },
  { name: 'CALÇAS', filter: 'calças', img: 'https://images.unsplash.com/photo-1763044938182-ed2526ae803a?w=400&h=500&fit=crop&auto=format', count: '31 peças' },
]

const REVIEWS = [
  { name: 'Ana Lima', stars: 5, text: 'Qualidade incrível, o caimento é perfeito. Recebi elogios toda vez que usei.', product: 'Oversized Void Tee' },
  { name: 'Bruno Souza', stars: 5, text: 'Entrega rápida, embalagem cuidadosa. A jaqueta é melhor pessoalmente, a cor é incrível.', product: 'Urban Camo Jacket' },
  { name: 'Clara Mendes', stars: 4, text: 'Tecido pesado no bom sentido. Ficou um pouco maior que o esperado, mas adorei o resultado oversized.', product: 'Neon Soul Hoodie' },
]

// ---------- Estado ----------
// <body data-gender="feminino|masculino"> restringe o catálogo da página
const PAGE_GENDER = document.body.dataset.gender || null;
const CART_KEY = 'boemia_cart';

let activeFilter = 'todos';
let cartCount = loadCart();
let currentProduct = null;
let selectedSize = '';
let qty = 1;

const $ = id => document.getElementById(id);

// O carrinho é guardado no navegador para não zerar ao trocar de página
function loadCart() {
  try { return Number(localStorage.getItem(CART_KEY)) || 0; } catch { return 0; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, String(cartCount)); } catch { /* ignora */ }
}

// ---------- Toast (Bootstrap) ----------
const toastEl = $('boeToast');
const toastBody = $('toastBody');
const boeToast = toastEl ? new bootstrap.Toast(toastEl, { delay: 2800 }) : null;

function showToast(msg) {
  if (!boeToast) return;
  toastBody.textContent = msg;
  boeToast.show();
}

// ---------- Renderizar categorias (Home) ----------
function renderCategories() {
  const grid = $('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(c => `
    <div class="col-12 col-md-4">
      <a href="#produtos" class="boe-category-card" data-filter-link="${c.filter}">
        <img src="${c.img}" alt="${c.name}">
        <div class="boe-category-overlay"></div>
        <div class="boe-category-info">
          <p class="boe-category-name">${c.name}</p>
          <p class="boe-category-count">${c.count}</p>
        </div>
        <div class="boe-category-arrow"><i class="bi bi-arrow-right"></i></div>
      </a>
    </div>
  `).join('');
}

// ---------- Renderizar produtos ----------
function renderProducts() {
  const grid = $('productsGrid');
  if (!grid) return;

  let list = PAGE_GENDER ? PRODUCTS.filter(p => [].concat(p.gender).includes(PAGE_GENDER)) : PRODUCTS;
  if (activeFilter !== 'todos') list = list.filter(p => p.category === activeFilter);

  if (!list.length) {
    grid.innerHTML = '<div class="col-12"><p class="boe-empty">NENHUMA PEÇA NESTA CATEGORIA POR ENQUANTO.</p></div>';
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="col-6 col-md-4">
      <div class="boe-product-card" data-id="${p.id}">
        <div class="boe-product-img-wrap">
          <img src="${p.img}" alt="${p.name}">
          <span class="boe-tag boe-product-badge" style="background:${p.tagColor}26; color:${p.tagColor}; border:1px solid ${p.tagColor}40;">${p.tag}</span>
        </div>
        <div class="boe-product-body">
          <h3 class="boe-product-name">${p.name}</h3>
          <div>
            <span class="boe-product-price">${p.price}</span>
            ${p.originalPrice ? `<span class="boe-product-original-price">${p.originalPrice}</span>` : ''}
          </div>
          <div class="boe-product-sizes">
            ${p.sizes.map(s => `<span>${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.boe-product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = Number(card.dataset.id);
      openModal(PRODUCTS.find(p => p.id === id));
    });
  });
}

// ---------- Renderizar reviews (Home) ----------
function renderReviews() {
  const grid = $('reviewsGrid');
  if (!grid) return;
  grid.innerHTML = REVIEWS.map(r => `
    <div class="col-12 col-md-4">
      <div class="boe-review-card">
        <div class="boe-review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
        <p class="boe-review-text">"${r.text}"</p>
        <div class="boe-review-footer">
          <p class="boe-review-name">${r.name}</p>
          <p class="boe-review-product">${r.product}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- Filtro de produtos ----------
const filterGroup = $('filterGroup');

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.boe-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderProducts();
}

if (filterGroup) {
  filterGroup.addEventListener('click', e => {
    const btn = e.target.closest('.boe-filter-btn');
    if (!btn) return;
    setFilter(btn.dataset.filter);
  });
}

// Links do hero/categorias que também aplicam filtro
document.addEventListener('click', e => {
  const link = e.target.closest('[data-filter-link]');
  if (!link || !filterGroup) return;
  setFilter(link.dataset.filterLink);
});

// ---------- Modal de produto ----------
const productModalEl = $('productModal');
const productModal = productModalEl ? new bootstrap.Modal(productModalEl) : null;

function openModal(product) {
  if (!productModal) return;
  currentProduct = product;
  selectedSize = '';
  qty = 1;

  $('modalImg').src = product.img;
  $('modalImg').alt = product.name;
  $('modalTag').textContent = product.tag;
  $('modalTag').style.background = 'rgba(139,61,255,0.2)';
  $('modalTag').style.color = '#a855f7';
  $('modalTag').style.border = '1px solid rgba(139,61,255,0.3)';

  $('modalName').textContent = product.name;
  $('modalPrice').textContent = product.price;
  $('modalOriginalPrice').textContent = product.originalPrice || '';
  $('modalDesc').textContent = product.desc;
  $('qtyValue').textContent = '1';

  const sizesWrap = $('modalSizes');
  sizesWrap.innerHTML = product.sizes.map(s => `<button type="button" class="boe-size-btn" data-size="${s}">${s}</button>`).join('');
  sizesWrap.querySelectorAll('.boe-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size;
      sizesWrap.querySelectorAll('.boe-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  productModal.show();
}

if (productModal) {
  $('qtyMinus').addEventListener('click', () => {
    qty = Math.max(1, qty - 1);
    $('qtyValue').textContent = qty;
  });
  $('qtyPlus').addEventListener('click', () => {
    qty += 1;
    $('qtyValue').textContent = qty;
  });

  $('addToCartBtn').addEventListener('click', () => {
    if (!selectedSize) {
      showToast('Selecione um tamanho!');
      return;
    }
    cartCount += qty;
    saveCart();
    updateCartBadge();
    productModal.hide();
    showToast(`${currentProduct.name} adicionado ao carrinho ✓`);
  });
}

// ---------- Carrinho / busca (ícones da navbar — em todas as páginas) ----------
function updateCartBadge() {
  const badge = $('cartBadge');
  if (!badge) return;
  badge.textContent = cartCount;
  badge.classList.toggle('d-none', cartCount === 0);
}

$('btnCart')?.addEventListener('click', () => {
  showToast(`${cartCount} item(s) no carrinho`);
});
$('btnSearch')?.addEventListener('click', () => {
  showToast('Busca em breve...');
});
document.querySelectorAll('.boe-social-btn').forEach(btn => {
  btn.addEventListener('click', () => showToast(`${btn.dataset.social} em breve!`));
});

// ---------- Newsletter (Home) ----------
const newsletterForm = $('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('newsletterEmail').value;
    if (!email) return;
    newsletterForm.classList.add('d-none');
    $('newsletterSuccess').classList.remove('d-none');
    showToast('Inscrito com sucesso! ✓');
  });
}

// ---------- Cadastro de clientes (cadastro.html) ----------
const signupForm = $('signupForm');
if (signupForm) {
  const senha = $('signupSenha');
  const senha2 = $('signupSenha2');

  // Confirmação de senha: marca o campo como inválido enquanto for diferente
  const checkMatch = () => {
    senha2.setCustomValidity(senha2.value !== senha.value ? 'As senhas não conferem' : '');
  };
  senha.addEventListener('input', checkMatch);
  senha2.addEventListener('input', checkMatch);

  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    checkMatch();
    if (!signupForm.checkValidity()) {
      e.stopPropagation();
      signupForm.classList.add('was-validated');
      return;
    }
    // Sem back-end: apenas confirma o cadastro na tela (a senha não é armazenada)
    signupForm.classList.add('d-none');
    $('signupSuccess').classList.remove('d-none');
    showToast('Cadastro realizado com sucesso! ✓');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Menu mobile (offcanvas) ----------
// Links que levam a outra página NÃO usam data-bs-dismiss: o Bootstrap bloqueia
// a navegação de <a> com esse atributo. Só fechamos o menu quando o link aponta
// para a própria página (ex.: NOVIDADES na Home).
const mobileMenuEl = $('mobileMenu');
if (mobileMenuEl) {
  const mobileMenu = bootstrap.Offcanvas.getOrCreateInstance(mobileMenuEl);
  mobileMenuEl.querySelectorAll('.boe-mobile-link:not([data-bs-dismiss])').forEach(link => {
    link.addEventListener('click', e => {
      const url = new URL(link.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return; // outra página: navega normal
      e.preventDefault();
      mobileMenuEl.addEventListener('hidden.bs.offcanvas', () => {
        document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, { once: true });
      mobileMenu.hide();
    });
  });
}

// ---------- Back to top ----------
const backToTopBtn = $('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 400);
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Init ----------
renderCategories();
renderProducts();
renderReviews();
updateCartBadge();