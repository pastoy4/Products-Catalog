import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Product, Slide } from '../../../core/services/api.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-product-list',
    imports: [FormsModule, ProductCardComponent, SpinnerComponent],
    template: `
    <div class="catalog-page">
      <!-- Hero Carousel -->
      @if (slideData().length > 0) {
      <section class="carousel-section"
        (mouseenter)="pauseCarousel()"
        (mouseleave)="resumeCarousel()">
        <div class="carousel-track" [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'">
          @for (slide of slideData(); track slide._id) {
            <div class="carousel-slide" [style.background]="slide.imageUrl ? 'url(' + slide.imageUrl + ') center/cover no-repeat' : slide.bgGradient">
              <div class="slide-overlay"></div>
              <div class="slide-content">
                @if (slide.badge) {
                  <span class="slide-badge">{{ slide.badge }}</span>
                }
                <h1 class="slide-title">{{ slide.title }}</h1>
                @if (slide.subtitle) {
                  <p class="slide-subtitle">{{ slide.subtitle }}</p>
                }
              </div>
            </div>
          }
        </div>
        <div class="carousel-dots">
          @for (slide of slideData(); track slide._id; let i = $index) {
            <button class="dot" [class.active]="currentSlide() === i" (click)="goToSlide(i)"></button>
          }
        </div>
        <button class="carousel-arrow prev" (click)="prevSlide()">‹</button>
        <button class="carousel-arrow next" (click)="nextSlide()">›</button>
      </section>
      }

      <!-- Search Bar -->
      <section class="search-section">
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

    /* Carousel */
    .carousel-section {
      position: relative;
      overflow: hidden;
      width: 100%;
      max-height: 500px;
      aspect-ratio: 16 / 9;
    }

    .carousel-track {
      display: flex;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .carousel-slide {
      min-width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .slide-overlay {
      position: absolute;
      inset: 0;
      background: rgba(10, 10, 20, 0.45);
    }

    .slide-content {
      position: relative;
      text-align: center;
      z-index: 1;
      max-width: 600px;
      padding: 0 24px;
    }

    .slide-badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(167, 139, 250, 0.2);
      color: #a78bfa;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .slide-title {
      font-size: 2.6rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 12px;
      letter-spacing: -1px;
      line-height: 1.15;
    }

    .slide-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
      line-height: 1.5;
    }

    .carousel-dots {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      z-index: 2;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.5);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s;
      padding: 0;
    }

    .dot.active {
      background: #a78bfa;
      border-color: #a78bfa;
      transform: scale(1.2);
    }

    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(15, 15, 25, 0.6);
      backdrop-filter: blur(8px);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 2;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .carousel-arrow:hover {
      background: rgba(167, 139, 250, 0.3);
      border-color: #a78bfa;
    }

    .carousel-arrow.prev { left: 16px; }
    .carousel-arrow.next { right: 16px; }

    /* Search */
    .search-section {
      padding: 32px 24px 0;
      max-width: 640px;
      margin: 0 auto;
    }

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
      margin-top: 24px;
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
      .carousel-section { max-height: 280px; }
      .slide-title { font-size: 1.8rem; }
      .carousel-arrow { display: none; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    }
  `],
})
export class ProductListComponent implements OnInit, OnDestroy {
    products = signal<Product[]>([]);
    categories = signal<string[]>([]);
    loading = signal(true);
    searchTerm = signal('');
    selectedCategory = signal('All');
    sortBy = signal('');
    currentSlide = signal(0);
    slideData = signal<Slide[]>([]);

    private defaultSlides: Slide[] = [
        {
            _id: 'default-1', badge: '\u2728 New Arrivals',
            title: 'Discover Our Premium Products',
            subtitle: 'Browse our curated collection of the finest items handpicked for you.',
            bgGradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 50%, #1a1a3e 100%)',
            imageUrl: '', imagePublicId: '', order: 0, active: true, createdAt: '', updatedAt: '',
        },
        {
            _id: 'default-2', badge: '\uD83D\uDD25 Hot Deals',
            title: 'Exclusive Discounts Await',
            subtitle: 'Save big on top-rated products. Limited time offers you can\'t miss.',
            bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            imageUrl: '', imagePublicId: '', order: 1, active: true, createdAt: '', updatedAt: '',
        },
        {
            _id: 'default-3', badge: '\uD83D\uDE80 Trending',
            title: 'Top Picks Just For You',
            subtitle: 'Explore what\'s trending right now across all categories.',
            bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            imageUrl: '', imagePublicId: '', order: 2, active: true, createdAt: '', updatedAt: '',
        },
    ];

    private searchTimeout: any;
    private carouselInterval: any;

    constructor(private api: ApiService) {}

    ngOnInit() {
        this.loadProducts();
        this.loadCategories();
        this.loadSlides();
    }

    ngOnDestroy() {
        this.stopCarousel();
        clearTimeout(this.searchTimeout);
    }

    // Slides
    loadSlides() {
        this.api.getSlides().subscribe({
            next: (res) => {
                this.slideData.set(res.data.length > 0 ? res.data : this.defaultSlides);
                this.startCarousel();
            },
            error: () => {
                this.slideData.set(this.defaultSlides);
                this.startCarousel();
            },
        });
    }

    // Carousel
    startCarousel() {
        this.stopCarousel();
        if (this.slideData().length > 1) {
            this.carouselInterval = setInterval(() => this.nextSlide(), 5000);
        }
    }

    stopCarousel() {
        clearInterval(this.carouselInterval);
    }

    pauseCarousel() {
        this.stopCarousel();
    }

    resumeCarousel() {
        this.startCarousel();
    }

    nextSlide() {
        this.currentSlide.set((this.currentSlide() + 1) % this.slideData().length);
    }

    prevSlide() {
        this.currentSlide.set(
            (this.currentSlide() - 1 + this.slideData().length) % this.slideData().length
        );
    }

    goToSlide(index: number) {
        this.currentSlide.set(index);
    }

    // Products
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

