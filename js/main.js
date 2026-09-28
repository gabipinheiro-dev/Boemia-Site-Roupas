/* ==========================================================
   BOEMIA — script principal (JavaScript puro)
   ========================================================== */

// ---------- Dados ----------
const PRODUCTS = [
  {
    id: 1,
    name: 'OVERSIZED VOID TEE',
    price: 'R$ 189',
    originalPrice: 'R$ 249',
    tag: 'NOVO',
    tagColor: '#8b3dff',
    img: 'imagens/foto_moça_camiseta.png',
    sizes: ['P', 'M', 'G', 'GG'],
    category: 'tops',
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
    desc: 'Calça cargo com múltiplos bolsos laterais. Elástico na cintura e barra ajustável.',
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
let activeFilter = 'todos';
let cartCount = 0;
let currentProduct = null;
let selectedSize = '';
let qty = 1;

// ---------- Toast (Bootstrap) ----------
const toastEl = document.getElementById('boeToast');
const toastBody = document.getElementById('toastBody');
const boeToast = new bootstrap.Toast(toastEl, { delay: 2800 });

function showToast(msg) {
  toastBody.textContent = msg;
  boeToast.show();
}

// ---------- Renderizar categorias ----------
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
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
  const grid = document.getElementById('productsGrid');
  const list = activeFilter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);

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

// ---------- Renderizar reviews ----------
function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
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
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.boe-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderProducts();
}

document.getElementById('filterGroup').addEventListener('click', e => {
  const btn = e.target.closest('.boe-filter-btn');
  if (!btn) return;
  setFilter(btn.dataset.filter);
});

// Links do menu/hero/categorias que também aplicam filtro
document.addEventListener('click', e => {
  const link = e.target.closest('[data-filter-link]');
  if (!link) return;
  setFilter(link.dataset.filterLink);
});

// ---------- Modal de produto ----------
const productModalEl = document.getElementById('productModal');
const productModal = new bootstrap.Modal(productModalEl);

function openModal(product) {
  currentProduct = product;
  selectedSize = '';
  qty = 1;

  document.getElementById('modalImg').src = product.img;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalTag').textContent = product.tag;
  document.getElementById('modalTag').style.background = 'rgba(139,61,255,0.2)';
  document.getElementById('modalTag').style.color = '#a855f7';
  document.getElementById('modalTag').style.border = '1px solid rgba(139,61,255,0.3)';

  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalPrice').textContent = product.price;
  document.getElementById('modalOriginalPrice').textContent = product.originalPrice || '';
  document.getElementById('modalDesc').textContent = product.desc;
  document.getElementById('qtyValue').textContent = '1';

  const sizesWrap = document.getElementById('modalSizes');
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

document.getElementById('qtyMinus').addEventListener('click', () => {
  qty = Math.max(1, qty - 1);
  document.getElementById('qtyValue').textContent = qty;
});
document.getElementById('qtyPlus').addEventListener('click', () => {
  qty += 1;
  document.getElementById('qtyValue').textContent = qty;
});

document.getElementById('addToCartBtn').addEventListener('click', () => {
  if (!selectedSize) {
    showToast('Selecione um tamanho!');
    return;
  }
  cartCount += qty;
  updateCartBadge();
  productModal.hide();
  showToast(`${currentProduct.name} adicionado ao carrinho ✓`);
});

// ---------- Carrinho / busca (ícones da navbar) ----------
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  badge.textContent = cartCount;
  badge.classList.toggle('d-none', cartCount === 0);
}

document.getElementById('btnCart').addEventListener('click', () => {
  showToast(`${cartCount} item(s) no carrinho`);
});
document.getElementById('btnSearch').addEventListener('click', () => {
  showToast('Busca em breve...');
});
document.querySelectorAll('.boe-social-btn').forEach(btn => {
  btn.addEventListener('click', () => showToast(`${btn.dataset.social} em breve!`));
});

// ---------- Newsletter ----------
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value;
  if (!email) return;
  document.getElementById('newsletterForm').classList.add('d-none');
  document.getElementById('newsletterSuccess').classList.remove('d-none');
  showToast('Inscrito com sucesso! ✓');
});

// ---------- Back to top ----------
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('show', window.scrollY > 400);
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Init ----------
renderCategories();
renderProducts();
renderReviews();
