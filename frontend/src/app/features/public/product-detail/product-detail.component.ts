import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, Location } from '@angular/common';
import { ApiService, Product } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-product-detail',
    imports: [CurrencyPipe, RouterLink, SpinnerComponent],
    template: `
    @if (loading()) {
      <app-spinner />
    } @else if (product()) {
      <div class="detail-page">
        <div class="detail-container">
          <button class="back-btn" (click)="goBack()">
            ← Back to Catalog
          </button>

          <div class="detail-grid">
            <!-- Image -->
            <div class="detail-image-wrap">
              @if (product()!.imageUrl) {
                <img [src]="product()!.imageUrl" [alt]="product()!.name" class="detail-image" />
              } @else {
                <div class="detail-placeholder">📷</div>
              }
            </div>

            <!-- Info -->
            <div class="detail-info">
              <span class="detail-category">{{ product()!.category }}</span>
              <h1 class="detail-title">{{ product()!.name }}</h1>

              <div class="detail-price-row">
                <span class="detail-price">{{ product()!.price | currency }}</span>
                <span class="detail-stock" [class.out-of-stock]="product()!.stock === 0">
                  {{ product()!.stock > 0 ? product()!.stock + ' in stock' : 'Out of Stock' }}
                </span>
              </div>

              <div class="detail-divider"></div>

              <div class="detail-section">
                <h3>Description</h3>
                <p>{{ product()!.description || 'No description available.' }}</p>
              </div>

              <div class="detail-meta">
                <div class="meta-item">
                  <span class="meta-label">Category</span>
                  <span class="meta-value">{{ product()!.category }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Stock</span>
                  <span class="meta-value">{{ product()!.stock }} units</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <span>😕</span>
        <h2>Product Not Found</h2>
        <a routerLink="/" class="btn-primary">Back to Catalog</a>
      </div>
    }
  `,
    styles: [`
    .detail-page {
      min-height: calc(100vh - 70px);
      padding: 40px 24px 60px;
    }

    .detail-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .back-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
      margin-bottom: 32px;
      font-family: inherit;
    }

    .back-btn:hover {
      border-color: #a78bfa;
      color: #a78bfa;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: start;
    }

    .detail-image-wrap {
      border-radius: 20px;
      overflow: hidden;
      background: rgba(30, 30, 50, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      aspect-ratio: 1;
    }

    .detail-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .detail-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      opacity: 0.2;
    }

    .detail-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-category {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #a78bfa;
      font-weight: 600;
    }

    .detail-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .detail-price-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .detail-price {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .detail-stock {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(52, 211, 153, 0.15);
      color: #34d399;
    }

    .detail-stock.out-of-stock {
      background: rgba(248, 113, 113, 0.15);
      color: #f87171;
    }

    .detail-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 8px 0;
    }

    .detail-section h3 {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 8px;
    }

    .detail-section p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
      margin: 0;
      font-size: 0.95rem;
    }

    .detail-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 8px;
    }

    .meta-item {
      background: rgba(30, 30, 50, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px;
    }

    .meta-label {
      display: block;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
    }

    .not-found {
      text-align: center;
      padding: 120px 24px;
      color: rgba(255, 255, 255, 0.5);
    }

    .not-found span { font-size: 4rem; }
    .not-found h2 { color: #fff; margin: 16px 0; }

    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.2s;
    }

    .btn-primary:hover { opacity: 0.9; }

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .detail-title { font-size: 1.6rem; }
      .detail-price { font-size: 1.4rem; }
    }
  `],
})
export class ProductDetailComponent implements OnInit {
    product = signal<Product | null>(null);
    loading = signal(true);

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private location: Location
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.api.getProduct(id).subscribe({
                next: (res) => {
                    this.product.set(res.data);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false),
            });
        }
    }

    goBack() {
        this.location.back();
    }
}
