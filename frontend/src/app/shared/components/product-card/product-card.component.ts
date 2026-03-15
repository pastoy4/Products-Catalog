import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Product } from '../../../core/services/api.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, SlicePipe],
  template: `
    <a [routerLink]="['/product', product._id]" class="card">
      <div class="card-image">
        @if (product.imageUrl) {
          <img [src]="product.imageUrl" [alt]="product.name" loading="lazy" />
        } @else {
          <div class="placeholder-image">📷</div>
        }
        <div class="stock-badge" [class.out-of-stock]="product.stock === 0">
          {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
        </div>
      </div>
      <div class="card-body">
        <span class="card-category">{{ product.category }}</span>
        <h3 class="card-title">{{ product.name }}</h3>
        <p class="card-desc">{{ product.description | slice:0:80 }}{{ product.description.length > 80 ? '...' : '' }}</p>
        <div class="card-footer">
          <span class="card-price">{{ product.price | currency }}</span>
          <span class="card-stock">{{ product.stock }} left</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card {
      display: flex;
      flex-direction: column;
      background: rgba(30, 30, 50, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-6px);
      border-color: rgba(167, 139, 250, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(167, 139, 250, 0.08);
    }

    .card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: rgba(15, 15, 25, 0.5);
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .card:hover .card-image img {
      transform: scale(1.08);
    }

    .placeholder-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      opacity: 0.3;
    }

    .stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(52, 211, 153, 0.2);
      color: #34d399;
      backdrop-filter: blur(10px);
    }

    .stock-badge.out-of-stock {
      background: rgba(248, 113, 113, 0.2);
      color: #f87171;
    }

    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .card-category {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a78bfa;
      font-weight: 600;
    }

    .card-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
    }

    .card-desc {
      margin: 0;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
      flex: 1;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .card-price {
      font-size: 1.15rem;
      font-weight: 700;
      color: #60a5fa;
    }

    .card-stock {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
    }
  `],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
