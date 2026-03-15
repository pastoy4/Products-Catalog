import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../../core/services/api.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-product-list',
    imports: [FormsModule, ProductCardComponent, SpinnerComponent],
    template: `
    <div class="catalog-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1 class="hero-title">Discover Our <span class="gradient-text">Products</span></h1>
          <p class="hero-subtitle">Browse our curated collection of premium products</p>

          <!-- Search Bar -->
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              placeholder="Search products..."
              [ngModel]="searchTerm()"
              (ngModelChange)="onSearch($event)"
            />
          </div>
        </div>
      </section>

      <!-- Filters & Sort -->
      <section class="controls">
        <div class="controls-inner">
          <div class="category-chips">
            <button
              class="chip"
              [class.active]="selectedCategory() === 'All'"
              (click)="filterByCategory('All')"
            >
              All
            </button>
            @for (cat of categories(); track cat) {
              <button
                class="chip"
                [class.active]="selectedCategory() === cat"
                (click)="filterByCategory(cat)"
              >
                {{ cat }}
              </button>
            }
          </div>

          <select class="sort-select" [ngModel]="sortBy()" (ngModelChange)="onSort($event)">
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="products-section">
        @if (loading()) {
          <app-spinner />
        } @else if (products().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <h2>No Products Found</h2>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        } @else {
          <div class="products-grid">
            @for (product of products(); track product._id) {
              <app-product-card [product]="product" />
            }
          </div>
        }
      </section>
    </div>
  `,
    styles: [`
    .catalog-page {
      min-height: calc(100vh - 70px);
    }

    /* Hero */
    .hero {
      position: relative;
      padding: 80px 24px 60px;
      text-align: center;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(167, 139, 250, 0.15), transparent 70%),
                  radial-gradient(ellipse at 80% 50%, rgba(96, 165, 250, 0.1), transparent 60%);
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      max-width: 640px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 2.8rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 12px;
      letter-spacing: -1px;
    }

    .gradient-text {
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0 0 32px;
    }

    /* Search */
    .search-container {
      display: flex;
      align-items: center;
      background: rgba(30, 30, 50, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 0 20px;
      transition: border-color 0.3s;
    }

    .search-container:focus-within {
      border-color: rgba(167, 139, 250, 0.5);
    }

    .search-icon { font-size: 1.1rem; }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      padding: 16px 12px;
      font-size: 1rem;
      color: #fff;
      font-family: inherit;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    /* Controls */
    .controls {
      padding: 0 24px;
      margin-bottom: 32px;
    }

    .controls-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .category-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chip {
      padding: 8px 18px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(30, 30, 50, 0.5);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .chip:hover {
      border-color: rgba(167, 139, 250, 0.3);
      color: #fff;
    }

    .chip.active {
      background: rgba(167, 139, 250, 0.2);
      border-color: #a78bfa;
      color: #a78bfa;
    }

    .sort-select {
      padding: 10px 16px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(30, 30, 50, 0.8);
      color: #fff;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
      outline: none;
    }

    .sort-select option {
      background: #1e1e32;
    }

    /* Products Grid */
    .products-section {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px 60px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 80px 24px;
      color: rgba(255, 255, 255, 0.5);
    }

    .empty-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
    .empty-state h2 { color: #fff; margin: 0 0 8px; }
    .empty-state p { margin: 0; }

    @media (max-width: 640px) {
      .hero-title { font-size: 2rem; }
      .hero { padding: 50px 16px 40px; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    }
  `],
})
export class ProductListComponent implements OnInit {
    products = signal<Product[]>([]);
    categories = signal<string[]>([]);
    loading = signal(true);
    searchTerm = signal('');
    selectedCategory = signal('All');
    sortBy = signal('');

    private searchTimeout: any;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts() {
        this.loading.set(true);
        const params: any = {};
        if (this.searchTerm()) params.search = this.searchTerm();
        if (this.selectedCategory() !== 'All') params.category = this.selectedCategory();
        if (this.sortBy()) params.sort = this.sortBy();

        this.api.getProducts(params).subscribe({
            next: (res) => {
                this.products.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    loadCategories() {
        this.api.getCategories().subscribe({
            next: (res) => this.categories.set(res.data),
        });
    }

    onSearch(value: string) {
        this.searchTerm.set(value);
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.loadProducts(), 350);
    }

    filterByCategory(cat: string) {
        this.selectedCategory.set(cat);
        this.loadProducts();
    }

    onSort(value: string) {
        this.sortBy.set(value);
        this.loadProducts();
    }
}
