import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ApiService, Product } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, CurrencyPipe, SpinnerComponent],
    template: `
    <div class="dashboard-page">
      <div class="dashboard-container">
        <!-- Header -->
        <div class="dash-header">
          <div>
            <h1 class="dash-title">Product Dashboard</h1>
            <p class="dash-subtitle">Manage your product catalog</p>
          </div>
          <a routerLink="/admin/product/new" class="btn-add">
            <span>+</span> Add Product
          </a>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">📦</span>
            <div class="stat-info">
              <span class="stat-value">{{ products().length }}</span>
              <span class="stat-label">Total Products</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div class="stat-info">
              <span class="stat-value">{{ inStockCount() }}</span>
              <span class="stat-label">In Stock</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⚠️</span>
            <div class="stat-info">
              <span class="stat-value">{{ outOfStockCount() }}</span>
              <span class="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        @if (loading()) {
          <app-spinner />
        } @else {
          <!-- Table -->
          <div class="table-wrap">
            <table class="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of products(); track product._id) {
                  <tr>
                    <td>
                      <div class="table-img">
                        @if (product.imageUrl) {
                          <img [src]="product.imageUrl" [alt]="product.name" />
                        } @else {
                          <span class="img-placeholder">📷</span>
                        }
                      </div>
                    </td>
                    <td><span class="cell-name">{{ product.name }}</span></td>
                    <td><span class="cell-cat">{{ product.category }}</span></td>
                    <td><span class="cell-price">{{ product.price | currency }}</span></td>
                    <td>
                      <span class="cell-stock" [class.low]="product.stock === 0">
                        {{ product.stock }}
                      </span>
                    </td>
                    <td>
                      <div class="action-btns">
                        <a [routerLink]="['/admin/product/edit', product._id]" class="btn-edit" title="Edit">✏️</a>
                        <button (click)="deleteProduct(product)" class="btn-delete" title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="empty-row">
                      No products yet. Click "Add Product" to get started.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .dashboard-page {
      min-height: calc(100vh - 70px);
      padding: 40px 24px 60px;
    }

    .dashboard-container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .dash-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .dash-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
    }

    .dash-subtitle {
      color: rgba(255, 255, 255, 0.4);
      margin: 4px 0 0;
      font-size: 0.95rem;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .btn-add:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
    }

    .btn-add span {
      font-size: 1.2rem;
      font-weight: 300;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: rgba(30, 30, 50, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon { font-size: 2rem; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
    }

    .stat-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 2px;
    }

    /* Table */
    .table-wrap {
      background: rgba(30, 30, 50, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      overflow: hidden;
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table th {
      text-align: left;
      padding: 16px 20px;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-weight: 600;
    }

    .products-table td {
      padding: 12px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }

    .products-table tbody tr {
      transition: background 0.2s;
    }

    .products-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .table-img {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      overflow: hidden;
      background: rgba(15, 15, 25, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .img-placeholder {
      font-size: 1.2rem;
      opacity: 0.3;
    }

    .cell-name {
      font-weight: 600;
      color: #fff;
    }

    .cell-cat {
      font-size: 0.8rem;
      padding: 4px 10px;
      background: rgba(167, 139, 250, 0.12);
      color: #a78bfa;
      border-radius: 6px;
    }

    .cell-price {
      font-weight: 600;
      color: #60a5fa;
    }

    .cell-stock {
      font-weight: 600;
      color: #34d399;
    }

    .cell-stock.low {
      color: #f87171;
    }

    .action-btns {
      display: flex;
      gap: 8px;
    }

    .btn-edit, .btn-delete {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(15, 15, 25, 0.5);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .btn-edit:hover {
      border-color: rgba(96, 165, 250, 0.5);
      background: rgba(96, 165, 250, 0.1);
    }

    .btn-delete:hover {
      border-color: rgba(248, 113, 113, 0.5);
      background: rgba(248, 113, 113, 0.1);
    }

    .empty-row {
      text-align: center;
      padding: 48px 20px !important;
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
      .table-wrap { overflow-x: auto; }
      .products-table { min-width: 600px; }
    }
  `],
})
export class DashboardComponent implements OnInit {
    products = signal<Product[]>([]);
    loading = signal(true);

    inStockCount = signal(0);
    outOfStockCount = signal(0);

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading.set(true);
        this.api.getProducts().subscribe({
            next: (res) => {
                this.products.set(res.data);
                this.inStockCount.set(res.data.filter((p) => p.stock > 0).length);
                this.outOfStockCount.set(res.data.filter((p) => p.stock === 0).length);
                this.loading.set(false);
            },
            error: () => this.loading.set(false),
        });
    }

    deleteProduct(product: Product) {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

        this.api.deleteProduct(product._id).subscribe({
            next: () => this.loadProducts(),
            error: (err) => alert(err.error?.message || 'Failed to delete product'),
        });
    }
}
