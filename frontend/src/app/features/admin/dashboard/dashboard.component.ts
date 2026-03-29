import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, CurrencyPipe, SpinnerComponent, FormsModule],
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
          <div class="stat-card clickable" [class.active]="stockFilter() === 'all'" (click)="setStockFilter('all')">
            <span class="stat-icon">📦</span>
            <div class="stat-info">
              <span class="stat-value">{{ allProducts().length }}</span>
              <span class="stat-label">Total Products</span>
            </div>
          </div>
          <div class="stat-card clickable" [class.active]="stockFilter() === 'in'" (click)="setStockFilter('in')">
            <span class="stat-icon">✅</span>
            <div class="stat-info">
              <span class="stat-value">{{ inStockCount() }}</span>
              <span class="stat-label">In Stock</span>
            </div>
          </div>
          <div class="stat-card clickable" [class.active]="stockFilter() === 'out'" (click)="setStockFilter('out')">
            <span class="stat-icon">⚠️</span>
            <div class="stat-info">
              <span class="stat-value">{{ outOfStockCount() }}</span>
              <span class="stat-label">Out of Stock</span>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <div class="filter-group">
            <label class="filter-label">Category</label>
            <select class="filter-select" [ngModel]="categoryFilter()" (ngModelChange)="setCategoryFilter($event)">
              <option value="All">All Categories</option>
              @for (cat of categories(); track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Stock Status</label>
            <div class="filter-chips">
              <button class="f-chip" [class.active]="stockFilter() === 'all'" (click)="setStockFilter('all')">All</button>
              <button class="f-chip" [class.active]="stockFilter() === 'in'" (click)="setStockFilter('in')">In Stock</button>
              <button class="f-chip" [class.active]="stockFilter() === 'out'" (click)="setStockFilter('out')">Out of Stock</button>
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
                @for (product of filteredProducts(); track product._id) {
                  <tr [class.modified]="hasStockChange(product._id)">
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
                      <div class="stock-control">
                        <button class="stock-btn minus" (click)="decrementStock(product)" title="Decrease stock">−</button>
                        <span class="cell-stock" [class.low]="getDisplayStock(product) === 0">
                          {{ getDisplayStock(product) }}
                        </span>
                        <button class="stock-btn plus" (click)="incrementStock(product)" title="Increase stock">+</button>
                      </div>
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
                      No products found matching your filters.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Floating Save Button -->
        @if (pendingChangesCount() > 0) {
          <div class="save-float">
            <div class="save-float-inner">
              <span class="save-count">{{ pendingChangesCount() }} product(s) modified</span>
              <div class="save-actions">
                <button class="btn-discard" (click)="discardChanges()">Discard</button>
                <button class="btn-save" (click)="saveStockChanges()" [disabled]="saving()">
                  {{ saving() ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .dashboard-page {
      min-height: calc(100vh - 70px);
      padding: 40px 24px 100px;
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
      margin-bottom: 24px;
    }

    .stat-card {
      background: rgba(30, 30, 50, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s;
    }

    .stat-card.clickable {
      cursor: pointer;
    }

    .stat-card.clickable:hover {
      border-color: rgba(167, 139, 250, 0.3);
    }

    .stat-card.active {
      border-color: #a78bfa;
      background: rgba(167, 139, 250, 0.08);
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

    /* Filters */
    .filter-bar {
      display: flex;
      align-items: flex-end;
      gap: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .filter-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 600;
    }

    .filter-select {
      padding: 10px 16px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(30, 30, 50, 0.8);
      color: #fff;
      font-size: 0.85rem;
      cursor: pointer;
      font-family: inherit;
      outline: none;
      min-width: 180px;
    }

    .filter-select option {
      background: #1e1e32;
    }

    .filter-chips {
      display: flex;
      gap: 6px;
    }

    .f-chip {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(30, 30, 50, 0.5);
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .f-chip:hover {
      border-color: rgba(167, 139, 250, 0.3);
      color: #fff;
    }

    .f-chip.active {
      background: rgba(167, 139, 250, 0.2);
      border-color: #a78bfa;
      color: #a78bfa;
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

    .products-table tbody tr.modified {
      background: rgba(167, 139, 250, 0.06);
      border-left: 3px solid #a78bfa;
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

    /* Stock control */
    .stock-control {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stock-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(15, 15, 25, 0.6);
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      padding: 0;
      line-height: 1;
    }

    .stock-btn:hover {
      border-color: rgba(167, 139, 250, 0.5);
      background: rgba(167, 139, 250, 0.15);
    }

    .stock-btn.minus:hover {
      border-color: rgba(248, 113, 113, 0.5);
      background: rgba(248, 113, 113, 0.15);
    }

    .stock-btn.plus:hover {
      border-color: rgba(52, 211, 153, 0.5);
      background: rgba(52, 211, 153, 0.15);
    }

    .cell-stock {
      font-weight: 600;
      color: #34d399;
      min-width: 32px;
      text-align: center;
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

    /* Floating Save */
    .save-float {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 900;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .save-float-inner {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px 24px;
      background: rgba(30, 30, 50, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(167, 139, 250, 0.3);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .save-count {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .save-actions {
      display: flex;
      gap: 8px;
    }

    .btn-discard {
      padding: 8px 18px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-discard:hover {
      border-color: rgba(248, 113, 113, 0.5);
      color: #f87171;
    }

    .btn-save {
      padding: 8px 24px;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .btn-save:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: 1fr; }
      .table-wrap { overflow-x: auto; }
      .products-table { min-width: 600px; }
      .filter-bar { flex-direction: column; align-items: stretch; }
    }
  `],
})
export class DashboardComponent implements OnInit {
    allProducts = signal<Product[]>([]);
    categories = signal<string[]>([]);
    loading = signal(true);
    saving = signal(false);

    stockFilter = signal<'all' | 'in' | 'out'>('all');
    categoryFilter = signal('All');
    stockChanges = signal<Map<string, number>>(new Map());

    inStockCount = computed(() => this.allProducts().filter(p => p.stock > 0).length);
    outOfStockCount = computed(() => this.allProducts().filter(p => p.stock === 0).length);
    pendingChangesCount = computed(() => this.stockChanges().size);

    filteredProducts = computed(() => {
        let products = this.allProducts();

        // Category filter
        if (this.categoryFilter() !== 'All') {
            products = products.filter(p => p.category === this.categoryFilter());
        }

        // Stock filter
        const sf = this.stockFilter();
        if (sf === 'in') {
            products = products.filter(p => this.getDisplayStock(p) > 0);
        } else if (sf === 'out') {
            products = products.filter(p => this.getDisplayStock(p) === 0);
        }

        return products;
    });

    constructor(private api: ApiService) {}

    ngOnInit() {
        this.loadProducts();
        this.loadCategories();
    }

    loadProducts() {
        this.loading.set(true);
        this.api.getProducts().subscribe({
            next: (res) => {
                this.allProducts.set(res.data);
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

    setStockFilter(filter: 'all' | 'in' | 'out') {
        this.stockFilter.set(filter);
    }

    setCategoryFilter(cat: string) {
        this.categoryFilter.set(cat);
    }

    // Stock editing
    getDisplayStock(product: Product): number {
        const changes = this.stockChanges();
        return changes.has(product._id) ? changes.get(product._id)! : product.stock;
    }

    hasStockChange(productId: string): boolean {
        return this.stockChanges().has(productId);
    }

    incrementStock(product: Product) {
        const current = this.getDisplayStock(product);
        this.setStockChange(product, current + 1);
    }

    decrementStock(product: Product) {
        const current = this.getDisplayStock(product);
        if (current > 0) {
            this.setStockChange(product, current - 1);
        }
    }

    private setStockChange(product: Product, newStock: number) {
        const changes = new Map(this.stockChanges());
        if (newStock === product.stock) {
            changes.delete(product._id);
        } else {
            changes.set(product._id, newStock);
        }
        this.stockChanges.set(changes);
    }

    discardChanges() {
        this.stockChanges.set(new Map());
    }

    saveStockChanges() {
        const changes = this.stockChanges();
        if (changes.size === 0) return;

        this.saving.set(true);
        const updates = Array.from(changes.entries()).map(([id, stock]) => ({ id, stock }));

        this.api.bulkUpdateStock(updates).subscribe({
            next: () => {
                this.saving.set(false);
                this.stockChanges.set(new Map());
                this.loadProducts();
            },
            error: (err) => {
                this.saving.set(false);
                alert(err.error?.message || 'Failed to save stock changes');
            },
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
