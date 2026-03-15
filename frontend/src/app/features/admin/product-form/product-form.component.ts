import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, Product } from '../../../core/services/api.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
    selector: 'app-product-form',
    imports: [FormsModule, RouterLink, SpinnerComponent],
    template: `
    <div class="form-page">
      <div class="form-container">
        <a routerLink="/admin/dashboard" class="back-link">← Back to Dashboard</a>

        <div class="form-card">
          <h1 class="form-title">{{ isEdit() ? 'Edit Product' : 'Add New Product' }}</h1>

          @if (loading()) {
            <app-spinner />
          } @else {
            @if (error()) {
              <div class="error-msg">{{ error() }}</div>
            }

            <form (ngSubmit)="onSubmit()" class="product-form">
              <!-- Image Upload -->
              <div class="image-upload-area">
                @if (imagePreview()) {
                  <div class="preview-wrap">
                    <img [src]="imagePreview()!" alt="Preview" class="image-preview" />
                    <button type="button" class="remove-img" (click)="removeImage()">✕</button>
                  </div>
                } @else {
                  <label class="upload-placeholder" for="imageInput">
                    <span class="upload-icon">📸</span>
                    <span class="upload-text">Click to upload image</span>
                    <span class="upload-hint">JPG, PNG – Max 5MB</span>
                  </label>
                }
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  hidden
                />
              </div>

              @if (uploading()) {
                <div class="upload-progress">
                  <div class="progress-bar"><div class="progress-fill"></div></div>
                  <span>Uploading image...</span>
                </div>
              }

              <div class="form-grid">
                <div class="form-group full">
                  <label for="name">Product Name *</label>
                  <input id="name" type="text" [(ngModel)]="form.name" name="name" required placeholder="Enter product name" />
                </div>

                <div class="form-group">
                  <label for="price">Price ($) *</label>
                  <input id="price" type="number" [(ngModel)]="form.price" name="price" required min="0" step="0.01" placeholder="0.00" />
                </div>

                <div class="form-group">
                  <label for="stock">Stock Quantity *</label>
                  <input id="stock" type="number" [(ngModel)]="form.stock" name="stock" required min="0" placeholder="0" />
                </div>

                <div class="form-group full">
                  <label for="category">Category</label>
                  <input id="category" type="text" [(ngModel)]="form.category" name="category" placeholder="e.g. Electronics, Clothing" />
                </div>

                <div class="form-group full">
                  <label for="description">Description</label>
                  <textarea id="description" [(ngModel)]="form.description" name="description" placeholder="Describe the product..." rows="4"></textarea>
                </div>
              </div>

              <div class="form-actions">
                <a routerLink="/admin/dashboard" class="btn-cancel">Cancel</a>
                <button type="submit" class="btn-submit" [disabled]="saving()">
                  {{ saving() ? 'Saving...' : isEdit() ? 'Update Product' : 'Create Product' }}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
    styles: [`
    .form-page {
      min-height: calc(100vh - 70px);
      padding: 40px 24px 60px;
    }

    .form-container {
      max-width: 720px;
      margin: 0 auto;
    }

    .back-link {
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-size: 0.9rem;
      display: inline-block;
      margin-bottom: 24px;
      transition: color 0.2s;
    }

    .back-link:hover { color: #a78bfa; }

    .form-card {
      background: rgba(30, 30, 50, 0.6);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 24px;
      padding: 48px 40px;
    }

    .form-title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 32px;
    }

    .error-msg {
      background: rgba(248, 113, 113, 0.12);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #f87171;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 24px;
    }

    /* Image Upload */
    .image-upload-area {
      margin-bottom: 24px;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 48px;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      background: rgba(15, 15, 25, 0.3);
    }

    .upload-placeholder:hover {
      border-color: rgba(167, 139, 250, 0.4);
      background: rgba(167, 139, 250, 0.05);
    }

    .upload-icon { font-size: 2.5rem; }
    .upload-text { color: rgba(255, 255, 255, 0.6); font-weight: 500; }
    .upload-hint { color: rgba(255, 255, 255, 0.3); font-size: 0.8rem; }

    .preview-wrap {
      position: relative;
      display: inline-block;
    }

    .image-preview {
      max-width: 100%;
      max-height: 300px;
      border-radius: 16px;
      object-fit: cover;
    }

    .remove-img {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .remove-img:hover { background: rgba(248, 113, 113, 0.8); }

    .upload-progress {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 60%;
      background: linear-gradient(90deg, #a78bfa, #60a5fa);
      border-radius: 4px;
      animation: progress 1.5s ease-in-out infinite;
    }

    @keyframes progress {
      0% { width: 0; }
      50% { width: 80%; }
      100% { width: 100%; }
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group.full { grid-column: 1 / -1; }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 8px;
    }

    .form-group input, .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      background: rgba(15, 15, 25, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: #fff;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus, .form-group textarea:focus {
      border-color: rgba(167, 139, 250, 0.5);
    }

    .form-group input::placeholder, .form-group textarea::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .btn-cancel {
      padding: 12px 24px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: none;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }

    .btn-cancel:hover {
      border-color: rgba(255, 255, 255, 0.3);
      color: #fff;
    }

    .btn-submit {
      padding: 12px 32px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #a78bfa, #60a5fa);
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 640px) {
      .form-card { padding: 32px 24px; }
      .form-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ProductFormComponent implements OnInit {
    isEdit = signal(false);
    loading = signal(false);
    saving = signal(false);
    uploading = signal(false);
    error = signal('');
    imagePreview = signal<string | null>(null);

    form = {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'General',
        imageUrl: '',
        imagePublicId: '',
    };

    private productId = '';
    private selectedFile: File | null = null;

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.productId = id;
            this.loading.set(true);
            this.api.getProduct(id).subscribe({
                next: (res) => {
                    const p = res.data;
                    this.form = {
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        stock: p.stock,
                        category: p.category,
                        imageUrl: p.imageUrl,
                        imagePublicId: p.imagePublicId,
                    };
                    if (p.imageUrl) this.imagePreview.set(p.imageUrl);
                    this.loading.set(false);
                },
                error: () => {
                    this.error.set('Failed to load product');
                    this.loading.set(false);
                },
            });
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];

            // Preview
            const reader = new FileReader();
            reader.onload = () => this.imagePreview.set(reader.result as string);
            reader.readAsDataURL(this.selectedFile);
        }
    }

    removeImage() {
        this.selectedFile = null;
        this.imagePreview.set(null);
        this.form.imageUrl = '';
        this.form.imagePublicId = '';
    }

    async onSubmit() {
        if (!this.form.name || this.form.price < 0) {
            this.error.set('Please fill in all required fields');
            return;
        }

        this.saving.set(true);
        this.error.set('');

        try {
            // Upload image first if a new file was selected
            if (this.selectedFile) {
                this.uploading.set(true);
                const uploadRes = await this.api.uploadImage(this.selectedFile).toPromise();
                if (uploadRes?.success) {
                    this.form.imageUrl = uploadRes.data.url;
                    this.form.imagePublicId = uploadRes.data.publicId;
                }
                this.uploading.set(false);
            }

            const req$ = this.isEdit()
                ? this.api.updateProduct(this.productId, this.form)
                : this.api.createProduct(this.form);

            req$.subscribe({
                next: () => {
                    this.saving.set(false);
                    this.router.navigate(['/admin/dashboard']);
                },
                error: (err) => {
                    this.saving.set(false);
                    this.error.set(err.error?.message || 'Failed to save product');
                },
            });
        } catch (err: any) {
            this.saving.set(false);
            this.uploading.set(false);
            this.error.set(err.error?.message || 'Image upload failed');
        }
    }
}
